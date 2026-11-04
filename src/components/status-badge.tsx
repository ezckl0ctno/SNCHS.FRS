import { STATUS_LABEL } from "@/lib/school/rules";
import type { GateStatus } from "@/lib/school/types";
import { cn } from "@/lib/utils";

/*
 * On time, left early and absent keep their green / red semantics — a status
 * badge has to stay readable at a glance. Late and dismissed, which carry no
 * warning, use the sky blue and navy of the component scheme.
 */
const tone: Record<GateStatus, string> = {
  on_time: "bg-ok-soft text-ok",
  late: "bg-sky-soft text-navy-dark",
  early_exit: "bg-rose-soft text-rose",
  dismissed: "bg-navy/10 text-navy-dark",
  absent: "bg-rose-soft text-rose",
};

export function StatusBadge({ status }: { status: GateStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        tone[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
