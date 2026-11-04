import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Alert, SchoolState, Student } from "./types";

const SaveInput = z.object({ state: z.unknown() });

export function sharedSchoolSnapshot(state: SchoolState) {
  return {
    school: {
      ...state.school,
      notify: {
        checkIn: state.school.notify?.checkIn ?? true,
        checkOut: state.school.notify?.checkOut ?? false,
        absence: state.school.notify?.absence ?? false,
      },
    },
    sections: state.sections,
    students: state.students.map((student): Student => ({ ...student, descriptors: [] })),
    parents: state.parents,
    attendance: state.attendance,
    alerts: state.alerts,
  };
}

export const loadSharedSchoolState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<{ data: SchoolState }>(
      "select data from school_state where user_id = $1",
      [context.userId],
    );
    return rows[0]?.data ?? null;
  });

export const saveSharedSchoolState = createServerFn({ method: "POST" })
  .validator((input: unknown) => SaveInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const parsed = data.state as Partial<SchoolState>;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.students) || !Array.isArray(parsed.sections)) {
      throw new Error("Invalid school state.");
    }
    const safeState = sharedSchoolSnapshot(parsed as SchoolState);
    const sql = await getSql();
    await sql.query(
      `insert into school_state (user_id, data, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (user_id) do update set data = excluded.data, updated_at = now()`,
      [context.userId, JSON.stringify(safeState)],
    );
    return { ok: true as const };
  });

const DeliveryInput = z.object({
  alertId: z.string().min(1).max(100),
  sendEmail: z.boolean(),
  sendSms: z.boolean(),
});

export type SecureNoticeResult = {
  email: { status: "sent" | "failed" | "skipped"; detail: string };
  sms: { status: "sent" | "failed" | "skipped"; detail: string };
};

const windowMs = 60_000;
const maxPerWindow = 24;
const sendStamps: number[] = [];

function rateOk() {
  const now = Date.now();
  while (sendStamps.length && now - sendStamps[0] > windowMs) sendStamps.shift();
  if (sendStamps.length >= maxPerWindow) return false;
  sendStamps.push(now);
  return true;
}

export const sendSchoolNotice = createServerFn({ method: "POST" })
  .validator((input: unknown) => DeliveryInput.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<SecureNoticeResult> => {
    if (!rateOk()) {
      return {
        email: { status: "failed", detail: "Too many alerts in one minute. Try again shortly." },
        sms: { status: "failed", detail: "Too many alerts in one minute. Try again shortly." },
      };
    }
    const sql = await getSql();
    const rows = await sql.query<{ data: SchoolState }>(
      "select data from school_state where user_id = $1",
      [context.userId],
    );
    const state = rows[0]?.data;
    const alert = state?.alerts?.find((item: Alert) => item.id === data.alertId);
    if (!alert) throw new Error("The attendance alert was not found in the office records.");
    const parent = state.parents?.find((item) => item.id === alert.parentId);
    if (!parent) {
      return {
        email: { status: "skipped", detail: "No parent linked." },
        sms: { status: "skipped", detail: "No parent linked." },
      };
    }

    const readServerEnv = (key: string, fallback = "") => process.env[key]?.trim() || fallback;
    const emailConfig = {
      host: readServerEnv("SCNHS_EMAIL_HOST", "smtp.gmail.com"),
      user: readServerEnv("SCNHS_EMAIL_USER"),
      pass: readServerEnv("SCNHS_EMAIL_PASS"),
    };
    const smsKey = readServerEnv("SCNHS_SMS_KEY");
    const smsSender = readServerEnv("SCNHS_SMS_SENDER", "SCNGATE");

    const [emailClaim, smsClaim] = await Promise.all([
      data.sendEmail ? claimChannel(sql, context.userId, alert.id, "email") : Promise.resolve(false),
      data.sendSms ? claimChannel(sql, context.userId, alert.id, "sms") : Promise.resolve(false),
    ]);
    const [emailResult, smsResult] = await Promise.all([
      emailClaim
        ? sendEmailForAlert(state.school.name, emailConfig, parent.email, alert.text)
        : Promise.resolve({ status: "skipped" as const, detail: data.sendEmail ? "Email already sent or currently sending." : "Email not requested." }),
      smsClaim
        ? sendSmsForAlert(smsKey, smsSender, parent.phone, alert.text)
        : Promise.resolve({ status: "skipped" as const, detail: data.sendSms ? "SMS already sent or currently sending." : "SMS not requested." }),
    ]);
    await Promise.all([
      recordChannel(sql, context.userId, alert.id, "email", emailResult.status, emailResult.detail),
      recordChannel(sql, context.userId, alert.id, "sms", smsResult.status, smsResult.detail),
    ]);
    return { email: emailResult, sms: smsResult };
  });

type Channel = "email" | "sms";
type ChannelStatus = "sent" | "failed" | "skipped";
type SqlClient = Awaited<ReturnType<typeof getSql>>;

async function claimChannel(sql: SqlClient, userId: string, alertId: string, channel: Channel) {
  const rows = await sql.query<{ channel: string }>(
    `insert into school_notification_deliveries (user_id, alert_id, channel, status, detail, updated_at)
     values ($1, $2, $3, 'sending', '', now())
     on conflict (user_id, alert_id, channel) do update
       set status = 'sending', detail = '', updated_at = now()
       where school_notification_deliveries.status not in ('sent', 'sending')
          or (school_notification_deliveries.status = 'sending' and school_notification_deliveries.updated_at < now() - interval '2 minutes')
     returning channel`,
    [userId, alertId, channel],
  );
  return rows.length > 0;
}

async function recordChannel(
  sql: SqlClient,
  userId: string,
  alertId: string,
  channel: Channel,
  status: ChannelStatus,
  detail: string,
) {
  await sql.query(
    `insert into school_notification_deliveries (user_id, alert_id, channel, status, detail, updated_at)
     values ($1, $2, $3, $4, $5, now())
     on conflict (user_id, alert_id, channel) do update
       set status = excluded.status, detail = excluded.detail, updated_at = now()`,
    [userId, alertId, channel, status, detail.slice(0, 300)],
  );
}

async function sendEmailForAlert(
  fromName: string,
  config: { host: string; user: string; pass: string },
  to: string,
  text: string,
): Promise<{ status: ChannelStatus; detail: string }> {
  if (!to.includes("@")) return { status: "skipped", detail: "No parent email on file." };
  if (!config.user || !config.pass) return { status: "skipped", detail: "School email delivery is not configured on the server." };
  const { sendEmail } = await import("./notify-send.server.ts");
  const result = await sendEmail({ ...config, fromName, to, subject: `${fromName}: attendance update`, text });
  return result.ok ? { status: "sent", detail: result.detail } : { status: "failed", detail: result.detail };
}

async function sendSmsForAlert(
  apiKey: string,
  sender: string,
  number: string,
  text: string,
): Promise<{ status: ChannelStatus; detail: string }> {
  if (!number.trim()) return { status: "skipped", detail: "No parent mobile on file." };
  if (!apiKey) return { status: "skipped", detail: "SMS delivery is not configured on the server." };
  const { sendSms } = await import("./notify-send.server.ts");
  const result = await sendSms({ apiKey, sender, number, message: text });
  return result.ok ? { status: "sent", detail: result.detail } : { status: "failed", detail: result.detail };
}