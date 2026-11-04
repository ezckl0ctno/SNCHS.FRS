import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { FaceCapture } from "@/components/face-capture";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/lib/school/rules";
import { useSchool } from "@/lib/school/store";
import type { AttendanceEvent, Student } from "@/lib/school/types";

export const Route = createFileRoute("/gate")({ component: GatePage });

function GatePage() {
  return (
    <AppShell title="School Facial Recognition System" kicker="Sta Catalina National High School">
      <ClientReady>
        <GateBody />
      </ClientReady>
    </AppShell>
  );
}

function GateBody() {
  const checkFace = useSchool((s) => s.checkFace);
  const recognizeFace = useSchool((s) => s.recognizeFace);
  const students = useSchool((s) => s.students);
  const [pendingFace, setPendingFace] = useState<number[] | null>(null);
  const [recognized, setRecognized] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [last, setLast] = useState<{ student: Student; event: AttendanceEvent } | null>(null);

  function finish(
    result:
      | { ok: true; student: Student; event: AttendanceEvent }
      | { ok: false; error: string },
  ) {
    if (!result.ok) {
      setLast(null);
      setError(result.error);
      return;
    }
    setError("");
    setLast({ student: result.student, event: result.event });
    setRecognized(null);
  }

  function submit(direction: "in" | "out") {
    if (!pendingFace) {
      setError("Face the camera first.");
      return;
    }
    finish(checkFace(pendingFace, direction));
    setPendingFace(null);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl bg-ink p-5 text-paper shadow-border sm:p-7">
        <p className="text-xs uppercase tracking-[0.16em] text-sky">Kiosk</p>
        <h2 className="mt-1 font-display text-3xl font-semibold">Face the camera. Attendance is automatic.</h2>
        {students.length === 0 ? (
          <p className="mt-6 text-sm text-sky-soft">The office has not added students yet.</p>
        ) : (
          <>
            <p className="mt-4 text-sm text-sky-soft">
              {students.length} student{students.length === 1 ? "" : "s"} on the roster. No code, ID, or section entry needed.
            </p>
            <div className="mt-6">
              <FaceCapture
                onCapture={(descriptor) => {
                  const result = recognizeFace(descriptor);
                  if (!result.ok) {
                    setPendingFace(null);
                    setRecognized(null);
                    setError(result.error);
                    return;
                  }
                  setPendingFace(descriptor);
                  setRecognized(result.student);
                  setError("");
                  setLast(null);
                }}
                autoScan
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="sky" className="min-h-12" disabled={!pendingFace} onClick={() => submit("in")}>
                <LogIn className="size-4" /> Check in
              </Button>
              <Button variant="outline" className="min-h-12 bg-transparent text-paper" disabled={!pendingFace} onClick={() => submit("out")}>
                <LogOut className="size-4" /> Check out
              </Button>
            </div>
            {pendingFace ? (
              <p className="mt-3 text-sm text-sky">Face recognized. Choose check in or check out.</p>
            ) : null}
            {error ? <p className="mt-4 rounded-xl bg-rose-soft px-3 py-3 text-sm text-rose">{error}</p> : null}
            {recognized ? (
              <p className="mt-4 rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok">
                Recognized: {recognized.name} · Grade {recognized.grade} {recognized.section}. Choose check in or check out.
              </p>
            ) : last ? (
              <p className="mt-4 rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok">
                {last.student.name} · Grade {last.student.grade} {last.student.section}: {" "}
                {STATUS_LABEL[last.event.status]}
              </p>
            ) : null}
          </>
        )}
      </section>
      <aside className="rounded-3xl bg-paper p-5 shadow-border">
        <h3 className="font-display text-xl font-semibold">Face check-in steps</h3>
        <ol className="mt-3 grid gap-3 text-sm text-muted">
          <li>1. The office enrolls each student’s face and assigns their section on the roster.</li>
          <li>2. The camera recognizes the enrolled student and their saved section automatically.</li>
          <li>3. The student chooses check in or check out.</li>
          <li>4. Linked parents see the alert on the Parents desk.</li>
        </ol>
        <p className="mt-6 rounded-xl bg-canvas p-3 text-sm text-muted">
          A face must be enrolled by the office first. Attendance starts fresh each school day while the history remains available to the office.
        </p>
      </aside>
    </div>
  );
}
