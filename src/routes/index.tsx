import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, DoorOpen, GraduationCap, Landmark } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { Field } from "@/components/field";
import { SectionPicker } from "@/components/section-picker";
import { Button } from "@/components/ui/button";
import { sortSections, studentsInSection } from "@/lib/school/sections";
import { useSchool } from "@/lib/school/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const name = useSchool((s) => s.school.name);
  return (
    <AppShell title="School FRS Interface" kicker={name}>
      <ClientReady>
        <HomeBody />
      </ClientReady>
    </AppShell>
  );
}

function HomeBody() {
  const school = useSchool((s) => s.school);
  const ready = Boolean(useSchool((s) => s.officePasswordHash));
  const session = useSchool((s) => s.session);
  const sections = useSchool((s) => s.sections);
  const students = useSchool((s) => s.students);

  return (
    <div className="relative isolate grid gap-5 rounded-[2rem] bg-canvas/80 p-1 sm:p-2">
      <img
        src="/scnhs-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-3 -top-24 z-[-2] size-[20rem] max-w-none object-contain opacity-[0.70] mix-blend-multiply sm:right-7 sm:-top-24 sm:size-[20rem]"
      />
      <p className="max-w-2xl text-muted">
        This platform is the School FRS for attendance monitoring. Every student belongs to one section. They sign in
        and check in only under that section. The Office Dashboard keeps all sections and enrolled students. Parents desk will notify when their child is scanned. 
        "Ang Pandayan ng Responsableng Mamamayan".
      </p>

      {!ready ? <SetupOffice /> : session.role === "none" ? <SignInRow /> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RoleCard to="/gate" icon={DoorOpen} title="Gate" body="Automatic Face Detection System, then check in/out." />
        <RoleCard to="/office" icon={Landmark} title="Office" body="Sections, Roster, and Alerts." />
        <RoleCard to="/student" icon={GraduationCap} title="Student" body="Sign in to your own Section." />
        <RoleCard to="/parent" icon={Bell} title="Parents" body="See your child’s day." />
      </div>

      <section className="rounded-3xl bg-paper p-5 shadow-border sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Existing Sections</h2>
          <p className="text-sm text-muted">{sections.length} sections saved on this platform</p>
        </div>
        {sections.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-canvas/80 px-4 py-5 text-sm text-muted">
            No sections have been created yet.
          </p>
        ) : (
          <ul className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortSections(sections).map((section) => {
              const count = studentsInSection(students, section.id).length;
              return (
                <li key={section.id} className="flex min-h-32 flex-col justify-between rounded-2xl bg-canvas/80 p-4">
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-muted">Grade {section.grade}</span>
                      <span className="mt-1 block font-display text-lg font-semibold">{section.name}</span>
                      {section.adviser ? <span className="mt-1 block text-xs text-muted">{section.adviser}</span> : null}
                    </span>
                    <span className="mt-4 text-sm text-muted">{count} student{count === 1 ? "" : "s"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border sm:p-6">
        <h2 className="font-display text-xl font-semibold">Class Schedule</h2>
        <ol className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Step n="1" title="Arrival">
            {school.arrivalStart}–{school.arrivalEnd} is on time. After that is late.
          </Step>
          <Step n="2" title="No arrival">
            After {school.absentCutoff}, the office marks missing students — one section or all.
          </Step>
          <Step n="3" title="Dismissal">
            Checkout before {school.dismissStart} is left early.
          </Step>
          <Step n="4" title="Parents">
            Linked parents get SMS and email at the same moment as the gate scan.
          </Step>
        </ol>
      </section>
    </div>
  );
}

function SetupOffice() {
  const setupOffice = useSchool((s) => s.setupOffice);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const result = await setupOffice(password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    void navigate({ to: "/office", search: { view: "dashboard" } });
  }

  return (
    <section className="rounded-3xl bg-paper p-5 shadow-border">
      <h2 className="font-display text-xl font-semibold">Create the office password</h2>
      <p className="mt-1 text-sm text-muted">
        Do this once. Only the office should know it. You will need it each time you open
        the roster.
      </p>
      <form className="mt-4 grid max-w-sm gap-3" onSubmit={onSubmit}>
        <Field name="password" label="Office password" type="password" required autoComplete="new-password" />
        <Button type="submit">Save and open office</Button>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
      </form>
    </section>
  );
}

function SignInRow() {
  const signInOffice = useSchool((s) => s.signInOffice);
  const signInParent = useSchool((s) => s.signInParent);
  const signInStudent = useSchool((s) => s.signInStudent);
  const sections = useSchool((s) => s.sections);
  const navigate = useNavigate();
  const [officeError, setOfficeError] = useState("");
  const [parentError, setParentError] = useState("");
  const [studentError, setStudentError] = useState("");
  const [sectionId, setSectionId] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <form
        className="rounded-3xl bg-paper p-5 shadow-border"
        onSubmit={async (e) => {
          e.preventDefault();
          const password = String(new FormData(e.currentTarget).get("office") || "");
          const result = await signInOffice(password);
          if (!result.ok) {
            setOfficeError(result.error);
            return;
          }
          void navigate({ to: "/office", search: { view: "dashboard" } });
        }}
      >
        <h2 className="font-display text-xl font-semibold">Office</h2>
        <div className="mt-4 grid gap-3">
          <Field name="office" label="Password" type="password" required autoComplete="current-password" />
          <Button type="submit">Open office</Button>
          {officeError ? <p className="text-sm text-rose">{officeError}</p> : null}
        </div>
      </form>
      <form
        className="rounded-3xl bg-paper p-5 shadow-border"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const result = await signInStudent(
            sectionId,
            String(data.get("code") || ""),
            String(data.get("pin") || ""),
          );
          if (!result.ok) {
            setStudentError(result.error);
            return;
          }
          void navigate({ to: "/student" });
        }}
      >
        <h2 className="font-display text-xl font-semibold">Student</h2>
        <p className="mt-1 text-sm text-muted">Sign in only to the section on your class list.</p>
        <div className="mt-4 grid gap-3">
          <label className="text-xs uppercase tracking-wider text-muted">
            Your section
            <SectionPicker sections={sections} value={sectionId} onChange={setSectionId} />
          </label>
          <Field name="code" label="Student code" placeholder="STUDENTS-1001" required autoComplete="username" />
          <Field name="pin" label="PIN" required autoComplete="current-password" />
          <Button type="submit" variant="outline">
            Open my section
          </Button>
          {studentError ? <p className="text-sm text-rose">{studentError}</p> : null}
        </div>
      </form>
      <form
        className="rounded-3xl bg-paper p-5 shadow-border"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const result = await signInParent(String(data.get("email") || ""), String(data.get("password") || ""));
          if (!result.ok) {
            setParentError(result.error);
            return;
          }
          void navigate({ to: "/parent" });
        }}
      >
        <h2 className="font-display text-xl font-semibold">Parent</h2>
        <div className="mt-4 grid gap-3">
          <Field name="email" label="Email" type="email" required autoComplete="username" />
          <Field name="password" label="Password" type="password" required autoComplete="current-password" />
          <Button type="submit" variant="outline">
            Open parent desk
          </Button>
          {parentError ? <p className="text-sm text-rose">{parentError}</p> : null}
        </div>
      </form>
    </div>
  );
}

function RoleCard({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: "/gate" | "/office" | "/parent" | "/student";
  icon: typeof DoorOpen;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-3xl bg-paper p-5 shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover"
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-sky-soft text-navy">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </Link>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-2xl bg-canvas/80 p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-fg">
        {n}
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="text-muted">{children}</span>
      </span>
    </li>
  );
}
