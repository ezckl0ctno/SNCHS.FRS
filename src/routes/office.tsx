import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { ClientReady } from "@/components/client-ready";
import { FaceCapture } from "@/components/face-capture";
import { Field } from "@/components/field";
import { SectionPicker } from "@/components/section-picker";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { attendanceCsv, backupPayload, downloadText } from "@/lib/school/export";
import { CLASS_TEMPLATE, parseClassCsv, starterClass } from "@/lib/school/class-list";
import { STATUS_LABEL, currentAttendanceEvents, isBeforeDismissal, todayISO } from "@/lib/school/rules";
import { sectionLabel, sortSections, studentsInSection } from "@/lib/school/sections";
import { genderLabel, groupRosterByGender, sortRosterStudents } from "@/lib/school/gender";
import { rankMostAbsent } from "@/lib/school/attendance-report";
import { useSchool } from "@/lib/school/store";

export const Route = createFileRoute("/office")({
  validateSearch: (search: Record<string, unknown>) => ({
    view:
      search.view === "sections" || search.view === "attendance"
        ? "sections" as const
        : search.view === "history"
          ? "history" as const
        : search.view === "roster"
          ? "roster" as const
          : search.view === "settings"
            ? "settings" as const
            : "dashboard" as const,
  }),
  component: OfficePage,
});

function OfficePage() {
  return (
    <AppShell title="Office Dashboard" kicker="Sta Catalina National High School">
      <ClientReady>
        <OfficeGate />
      </ClientReady>
    </AppShell>
  );
}

function OfficeGate() {
  const session = useSchool((s) => s.session);
  const ready = Boolean(useSchool((s) => s.officePasswordHash));
  if (!ready) {
    return (
      <p className="text-muted">
        Create the office password on the <Link to="/" className="text-primary underline">home page</Link> first.
      </p>
    );
  }
  if (session.role !== "office") {
    return (
      <p className="text-muted">
        Sign in as office on the <Link to="/" className="text-primary underline">home page</Link>.
      </p>
    );
  }
  return <OfficeBody />;
}

function OfficeBody() {
  const officeSearch = Route.useSearch();
  const navigate = Route.useNavigate();
  const school = useSchool((s) => s.school);
  const sections = useSchool((s) => s.sections);
  const students = useSchool((s) => s.students);
  const parents = useSchool((s) => s.parents);
  const attendance = useSchool((s) => s.attendance);
  const alerts = useSchool((s) => s.alerts);
  const addStudent = useSchool((s) => s.addStudent);
  const addParent = useSchool((s) => s.addParent);
  const addSection = useSchool((s) => s.addSection);
  const setStudentGender = useSchool((s) => s.setStudentGender);
  const removeSection = useSchool((s) => s.removeSection);
  const removeStudent = useSchool((s) => s.removeStudent);
  const markAbsences = useSchool((s) => s.markAbsences);
  const updateHours = useSchool((s) => s.updateHours);
  const enrollFace = useSchool((s) => s.enrollFace);
  const clearRecords = useSchool((s) => s.clearRecords);
  const importBackup = useSchool((s) => s.importBackup);
  const importClass = useSchool((s) => s.importClass);
  const updateNotify = useSchool((s) => s.updateNotify);
  const pushNotice = useSchool((s) => s.pushNotice);
  const [notice, setNotice] = useState("");
  const [enrollId, setEnrollId] = useState<string | null>(null);
  const [historyDate, setHistoryDate] = useState(todayISO());
  const [filterSection, setFilterSection] = useState(sections[0]?.id ?? "");
  const [rosterSectionId, setRosterSectionId] = useState(sections[0]?.id ?? "");
  const [rosterQuery, setRosterQuery] = useState("");
  const [addSectionId, setAddSectionId] = useState(sections[0]?.id ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const classFileRef = useRef<HTMLInputElement>(null);

  const currentDate = todayISO();
  const canMarkAbsencesForDate = isBeforeDismissal(school);
  const today = currentAttendanceEvents(attendance, school);
  const activeRosterSectionId = sections.some((section) => section.id === rosterSectionId)
    ? rosterSectionId
    : sections[0]?.id ?? "";
  const activeRosterSection = sections.find((section) => section.id === activeRosterSectionId);
  const activeLogSectionId = sections.some((section) => section.id === filterSection)
    ? filterSection
    : sections[0]?.id ?? "";
  const rosterStudents = activeRosterSectionId
    ? studentsInSection(students, activeRosterSectionId)
    : [];
  const normalizedRosterQuery = rosterQuery.trim().toLocaleLowerCase();
  const searchedStudents = normalizedRosterQuery
    ? rosterStudents.filter((student) =>
        [student.name, student.code, student.grade, student.section]
          .some((value) => value.toLocaleLowerCase().includes(normalizedRosterQuery)),
      )
    : rosterStudents;
  const rosterGroups = groupRosterByGender(sortRosterStudents(searchedStudents, "name"));
  const absenceCards = sortSections(sections).map((section) => ({
    section,
    students: rankMostAbsent(studentsInSection(students, section.id), attendance),
  }));
  const visibleToday = activeLogSectionId
    ? today.filter((a) => {
        const st = students.find((s) => s.id === a.studentId);
        return st?.sectionId === activeLogSectionId;
      })
    : [];
  const loggedInToday = visibleToday
    .filter((event) => event.direction === "in")
    .map((event) => ({
      event,
      student: students.find((student) => student.id === event.studentId),
    }))
    .sort((a, b) => (a.student?.name ?? "").localeCompare(b.student?.name ?? "", "en", { sensitivity: "base" }));

  const stats = useMemo(
    () => ({
      events: visibleToday.length,
      onTime: visibleToday.filter((a) => a.status === "on_time").length,
      late: visibleToday.filter((a) => a.status === "late").length,
      absent: visibleToday.filter((a) => a.status === "absent").length,
    }),
    [visibleToday],
  );

  function onAddStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const rawGender = String(data.get("gender") || "");
    const gender = rawGender === "male" || rawGender === "female" ? rawGender : null;
    const result = addStudent({
      name: String(data.get("name") || ""),
      sectionId: addSectionId,
      pin: String(data.get("pin") || ""),
      parentId: String(data.get("parentId") || "") || null,
      gender,
    });
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(`${result.name} saved in Grade ${result.grade} — ${result.section}. Student ID ${result.code}. PIN ${result.pin}.`);
    form.reset();
  }

  async function onAddParent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await addParent({
      name: String(data.get("pname") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      password: String(data.get("ppass") || ""),
    });
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(`${result.name} can be reached at ${result.email || result.phone}. Give them their password in person.`);
    form.reset();
  }

  function onAddSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = addSection({
      grade: String(data.get("sgrade") || ""),
      name: String(data.get("sname") || ""),
      adviser: String(data.get("sadviser") || ""),
    });
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(`${sectionLabel(result)} is open.`);
    setAddSectionId(result.id);
    form.reset();
  }

  function onHours(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    updateHours({
      name: String(data.get("schoolName") || school.name).trim() || school.name,
      campus: String(data.get("campus") || school.campus).trim(),
      arrivalStart: String(data.get("arrivalStart") || school.arrivalStart),
      arrivalEnd: String(data.get("arrivalEnd") || school.arrivalEnd),
      absentCutoff: String(data.get("absentCutoff") || school.absentCutoff),
      dismissStart: String(data.get("dismissStart") || school.dismissStart),
    });
    setNotice("School hours and name saved.");
  }

  function exportLog() {
    downloadText(
      `scn-attendance-${currentDate}-${activeLogSectionId}.csv`,
      attendanceCsv({ ...useSchool.getState(), attendance: visibleToday }),
      "text/csv;charset=utf-8",
    );
    setNotice("Attendance CSV downloaded.");
  }

  function exportBackup() {
    downloadText(
      `scn-gate-backup-${todayISO()}.json`,
      JSON.stringify(backupPayload(useSchool.getState()), null, 2),
      "application/json",
    );
    setNotice("Backup saved. Keep that file on this laptop.");
  }

  async function onImportFile(file: File | undefined) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as unknown;
      const result = importBackup(raw);
      setNotice("ok" in result ? "Backup restored on this laptop." : result.error);
    } catch {
      setNotice("That file could not be read.");
    }
  }

  async function loadRows(rows: ReturnType<typeof starterClass>) {
    const result = await importClass(rows);
    if ("error" in result) {
      setNotice(result.error);
      return;
    }
    setNotice(
      `Loaded ${result.added} student${result.added === 1 ? "" : "s"} across ${result.sections} new section${result.sections === 1 ? "" : "s"} and ${result.parents} parent contact${result.parents === 1 ? "" : "s"}.`,
    );
  }

  async function onClassFile(file: File | undefined) {
    if (!file) return;
    const parsed = parseClassCsv(await file.text());
    if ("error" in parsed) {
      setNotice(parsed.error);
      return;
    }
    await loadRows(parsed);
  }

  function onNotify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    updateNotify({
    checkIn: data.get("notifyCheckIn") === "on",
    checkOut: data.get("notifyCheckOut") === "on",
    absence: data.get("notifyAbsence") === "on",
    });
    setNotice("Parent alert preferences saved. Delivery uses the school’s protected server configuration.");
  }

  const orderedSections = sortSections(sections);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2 border-b border-line pb-3 sm:grid-cols-5" role="tablist" aria-label="Office views">
        <Button
          variant={officeSearch.view === "dashboard" ? "primary" : "outline"}
          role="tab"
          aria-selected={officeSearch.view === "dashboard"}
          onClick={() => void navigate({ search: { view: "dashboard" } })}
        >
          Overview
        </Button>
        <Button
          variant={officeSearch.view === "roster" ? "primary" : "outline"}
          role="tab"
          aria-selected={officeSearch.view === "roster"}
          onClick={() => void navigate({ search: { view: "roster" } })}
        >
          Rosters
        </Button>
        <Button
          variant={officeSearch.view === "sections" ? "primary" : "outline"}
          role="tab"
          aria-selected={officeSearch.view === "sections"}
          onClick={() => void navigate({ search: { view: "sections" } })}
        >
          Gate History
        </Button>
        <Button
          variant={officeSearch.view === "history" ? "primary" : "outline"}
          role="tab"
          aria-selected={officeSearch.view === "history"}
          onClick={() => void navigate({ search: { view: "history" } })}
        >
          Sections and Attendance
        </Button>
        <Button
          variant={officeSearch.view === "settings" ? "primary" : "outline"}
          role="tab"
          aria-selected={officeSearch.view === "settings"}
          onClick={() => void navigate({ search: { view: "settings" } })}
        >
          Settings
        </Button>
      </div>
      {notice ? <p className="rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok" role="status">{notice}</p> : null}

      {officeSearch.view === "history" ? (
        <SectionRosterBoard
          sections={orderedSections}
          students={students}
          attendance={attendance}
          date={historyDate}
          onDateChange={setHistoryDate}
        />
      ) : null}
      <div className="grid gap-5">
      {officeSearch.view === "dashboard" ? (
        <section className="rounded-3xl bg-paper p-5 shadow-border sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Office</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">School Office</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Your sections, student rosters, daily attendance, and school settings are organized into separate views.
            Choose a workspace above to get started.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Sections" value={sections.length} />
            <Stat label="Students" value={students.length} />
            <Stat label="Today’s gate events" value={today.length} />
            <Stat label="Alerts" value={alerts.length} />
          </div>
          <section className="mt-6" aria-labelledby="absence-ranking-title">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 id="absence-ranking-title" className="font-display text-lg font-semibold">Most absences by section</h3>
                <p className="mt-1 text-xs text-muted">Students are ranked by distinct dates marked absent.</p>
              </div>
              <span className="text-xs text-muted">{absenceCards.length} sections</span>
            </div>
            {absenceCards.length === 0 ? (
              <p className="rounded-2xl border border-line bg-canvas/50 p-4 text-sm text-muted">Create sections and record attendance to see absence rankings.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {absenceCards.map(({ section, students: absentees }) => (
                  <article key={section.id} className="rounded-2xl border border-line bg-canvas/50 p-4">
                    <header className="flex items-start justify-between gap-2 border-b border-line pb-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Grade {section.grade}</p>
                        <h4 className="font-display text-base font-semibold">{section.name}</h4>
                      </div>
                      <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-semibold text-muted">{studentsInSection(students, section.id).length} students</span>
                    </header>
                    {absentees.length === 0 ? (
                      <p className="pt-3 text-xs text-muted">No absences recorded.</p>
                    ) : (
                      <ol className="divide-y divide-line">
                        {absentees.slice(0, 3).map(({ student, daysAbsent }, index) => (
                          <li key={student.id} className="flex items-center justify-between gap-2 py-2.5">
                            <span className="min-w-0">
                              <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-paper text-[10px] font-semibold text-primary">{index + 1}</span>
                              <span className="text-sm font-medium">{student.name}</span>
                              <span className="block pl-7 text-[10px] text-muted">{student.code}</span>
                            </span>
                            <span className="shrink-0 rounded-full bg-rose-soft px-2 py-1 text-[10px] font-semibold text-rose">{daysAbsent} {daysAbsent === 1 ? "day" : "days"}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      ) : null}

      {officeSearch.view === "sections" ? (
        <>
      <div className="rounded-3xl bg-paper p-5 shadow-border">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-semibold">Gate History by Section</h2>
            <p className="mt-1 text-sm text-muted">Choose a section to identify its students’ gate events.</p>
          </div>
          <p className="text-sm text-muted">{currentDate}</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {orderedSections.map((section) => {
            const sectionEvents = today.filter((event) => {
              const student = students.find((item) => item.id === event.studentId);
              return student?.sectionId === section.id;
            });
            const selected = activeLogSectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilterSection(section.id)}
                className={`min-h-14 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  selected ? "bg-navy text-primary-fg" : "bg-canvas/80 text-ink hover:bg-sky-soft/60"
                }`}
              >
                <span className="block font-medium">Grade {section.grade} · {section.name}</span>
                <span className={`text-xs ${selected ? "text-primary-fg/80" : "text-muted"}`}>
                  {sectionEvents.length} event{sectionEvents.length === 1 ? "" : "s"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="This date" value={stats.events} />
        <Stat label="On time" value={stats.onTime} />
        <Stat label="Late" value={stats.late} />
        <Stat label="No arrival" value={stats.absent} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={!canMarkAbsencesForDate || !activeLogSectionId}
          onClick={() => {
            const scope = sections.find((section) => section.id === activeLogSectionId);
            const scopeLabel = scope ? sectionLabel(scope) : "the selected section";
            if (!confirm(`Record missing arrivals for ${scopeLabel} on ${currentDate}? Students who already checked in or already have an absence record will be left unchanged. This may also send attendance alerts to linked parents.`)) {
              return;
            }
            void (async () => {
              const n = await markAbsences(activeLogSectionId || undefined);
              setNotice(
                n
                  ? `Recorded ${n} missing arrival${n === 1 ? "" : "s"}${scope ? ` in ${sectionLabel(scope)}` : ""}.`
                  : "Every student in this view already has a check-in or an absence today.",
              );
            })();
          }}
        >
          Mark today’s missing arrivals
        </Button>
        {!canMarkAbsencesForDate ? (
          <p className="self-center text-sm text-muted">
            {`Missing arrivals close at dismissal (${school.dismissStart}); the current attendance cycle has already reset.`}
          </p>
        ) : null}
        <Button variant="outline" onClick={exportLog}>
          Download CSV
        </Button>
      </div>
        </>
      ) : null}

      {officeSearch.view === "roster" ? (
      <>
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Sections</h2>
        <p className="mt-1 text-sm text-muted">
          The school can run many sections at once. Students may only sign in and check in
          under the section they belong to. Add extra strands or rooms as needed.
        </p>
        <form className="mt-4 grid gap-3 sm:grid-cols-4" onSubmit={onAddSection}>
          <Field name="sgrade" label="Grade" placeholder="12" required />
          <Field name="sname" label="Section name" placeholder="Add your Section" required />
          <Field name="sadviser" label="Adviser" placeholder="Optional" />
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Add section
            </Button>
          </div>
        </form>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {orderedSections.map((sec) => {
            const count = studentsInSection(students, sec.id).length;
            return (
              <li
                key={sec.id}
                className="flex items-center justify-between gap-2 rounded-2xl bg-canvas/80 px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-medium">{sectionLabel(sec)}</span>
                  <span className="block text-xs text-muted">
                    {count} student{count === 1 ? "" : "s"}
                    {sec.adviser ? ` · ${sec.adviser}` : ""}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  className="min-h-10 text-xs"
                  onClick={() => {
                    const result = removeSection(sec.id);
                    setNotice("error" in result ? result.error : `${sectionLabel(sec)} removed.`);
                  }}
                >
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Class List</h2>
        <p className="mt-1 text-sm text-muted">
          CSV columns include grade and section, so one file can load the whole school.
          Download the template, replace the sample rows, then import it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => downloadText("scn-class-template.csv", CLASS_TEMPLATE, "text/csv;charset=utf-8")}
          >
            Download template
          </Button>
          <Button variant="outline" onClick={() => classFileRef.current?.click()}>
            Import CSV
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (students.length && !confirm("Add the multi-section starter roster to the current list?")) return;
              void loadRows(starterClass());
            }}
          >
            Load sample school
          </Button>
          <input
            ref={classFileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              void onClassFile(e.target.files?.[0]);
              e.currentTarget.value = "";
            }}
          />
        </div>
      </section>
      </>
      ) : null}

      {officeSearch.view === "sections" ? (
      <>
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
          <h2 className="font-display text-xl font-semibold">Gate History</h2>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted">
              {sectionLabel(sections.find((section) => section.id === activeLogSectionId) ?? { grade: "", name: "Section" })} · {currentDate}
            </p>
            <Button variant="outline" disabled={loggedInToday.length === 0} onClick={() => window.print()}>
              Print logged-in list
            </Button>
          </div>
        </div>
        {visibleToday.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No check-ins on this date in this view.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 font-medium">Time</th>
                  <th className="py-2 font-medium">Student</th>
                  <th className="py-2 font-medium">Section</th>
                  <th className="py-2 font-medium">In/Out</th>
                  <th className="py-2 font-medium">How</th>
                  <th className="py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {visibleToday.map((row) => {
                  const student = students.find((s) => s.id === row.studentId);
                  const genderLabelText = student?.gender ? genderLabel(student.gender) : "Gender unset";
                  return (
                    <tr key={row.id} className="border-t border-line">
                      <td className="py-2.5 tabular-nums">
                        {new Date(row.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5">
                        <div className="font-medium">{student?.name ?? "—"}</div>
                        <div className="text-xs text-muted">{genderLabelText}</div>
                      </td>
                      <td className="py-2.5">
                        {student ? `G${student.grade} ${student.section}` : "—"}
                      </td>
                      <td className="py-2.5 capitalize">{row.direction}</td>
                      <td className="py-2.5">{row.method}</td>
                      <td className="py-2.5">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="print-attendance" aria-label="Printable logged-in student list">
        <h1>{school.name}</h1>
        <h2>Students Logged In</h2>
        <p>
          {sectionLabel(sections.find((section) => section.id === activeLogSectionId) ?? { grade: "", name: "Section" })}
          {" · "}{currentDate}
        </p>
        <p>Total checked in: {loggedInToday.length}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student name</th>
              <th>Gender</th>
              <th>Student ID</th>
              <th>Check-in time</th>
            </tr>
          </thead>
          <tbody>
            {loggedInToday.map(({ event, student }, index) => (
              <tr key={event.id}>
                <td>{index + 1}</td>
                <td>{student?.name ?? "Removed student"}</td>
                <td>{student?.gender ? genderLabel(student.gender) : "—"}</td>
                <td>{student?.code ?? "—"}</td>
                <td>{new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      </>
      ) : null}

      {officeSearch.view === "roster" ? (
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl bg-paper p-5 shadow-border">
          <h2 className="font-display text-xl font-semibold">Add student</h2>
          <form className="mt-4 grid gap-3" onSubmit={onAddStudent}>
            <Field name="name" label="Name" required />
            <label className="text-xs uppercase tracking-wider text-muted">
              Section
              <SectionPicker sections={sections} value={addSectionId} onChange={setAddSectionId} />
            </label>
            <label className="text-xs uppercase tracking-wider text-muted">
              Gender
              <select
                name="gender"
                required
                defaultValue="male"
                className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <Field name="pin" label="PIN" placeholder="Leave blank to auto-assign" />
            <label className="text-xs uppercase tracking-wider text-muted">
              Parent
              <select
                name="parentId"
                className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
              >
                <option value="">None yet</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">Save student</Button>
          </form>
        </section>

        <section className="rounded-3xl bg-paper p-5 shadow-border">
          <h2 className="font-display text-xl font-semibold">Add parent</h2>
          <form className="mt-4 grid gap-3" onSubmit={onAddParent}>
            <Field name="pname" label="Name" required />
            <Field name="email" label="Email" type="email" />
            <Field name="phone" label="Mobile" placeholder="0917…" />
            <Field name="ppass" label="Password" type="password" placeholder="At least 6 characters, or leave blank" />
            <Button type="submit" variant="outline">
              Save parent
            </Button>
          </form>
        </section>
      </div>
      ) : null}

      {officeSearch.view === "roster" ? (
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <div className="mb-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold">Roster by Section</h2>
              <p className="mt-1 text-sm text-muted">Choose a section to show only its students.</p>
              <p className="mt-1 text-xs text-muted">
                PINs and face data are hidden from the roster view. Share a student PIN privately, and enroll faces only with consent.
              </p>
            </div>
            <p className="text-xs text-muted">{sections.length} sections</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {orderedSections.map((section) => {
              const count = studentsInSection(students, section.id).length;
                const selected = activeRosterSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  aria-pressed={selected}
                    onClick={() => setRosterSectionId(section.id)}
                  className={`min-h-14 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "bg-primary text-primary-fg"
                      : "bg-canvas/80 text-ink hover:bg-sky-soft/60"
                  }`}
                >
                  <span className="block font-medium">Grade {section.grade} · {section.name}</span>
                  <span className={`text-xs ${selected ? "text-primary-fg/80" : "text-muted"}`}>
                    {count} student{count === 1 ? "" : "s"}
                    {section.adviser ? ` · ${section.adviser}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {activeRosterSection ? `Roster — ${sectionLabel(activeRosterSection)}` : "Roster"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Showing {searchedStudents.length} of {rosterStudents.length} student{rosterStudents.length === 1 ? "" : "s"} in this section.
            </p>
            <p className="mt-1 text-xs text-muted">Section, parent, and face enrollment are permanent after enrollment.</p>
          </div>
          <label className="w-full text-xs uppercase tracking-wider text-muted sm:max-w-sm">
            Search Student
            <input
              type="search"
              value={rosterQuery}
              onChange={(event) => setRosterQuery(event.target.value)}
              placeholder="Name, student code, grade, or section"
              className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm normal-case tracking-normal text-ink outline-none ring-primary placeholder:text-muted/80 focus:ring-2"
            />
          </label>
        </div>
        {searchedStudents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            {rosterStudents.length === 0
              ? activeRosterSectionId
                ? "No students are assigned to this section yet."
                : "Create a section to view its roster."
              : `No students match “${rosterQuery.trim()}”.`}
          </p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {rosterGroups.map((group) => (
              <div key={group.key} className="rounded-2xl border border-line bg-canvas/40 p-3">
                <div className="mb-2 flex items-center justify-between border-b border-line pb-1">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{group.label}</h3>
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">{group.students.length}</span>
                </div>
                <ul className="divide-y divide-line">
                  {group.students.map((s) => (
                    <li key={s.id} className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <span>
                        <span className="font-medium">{s.name}</span>
                        <span className="block text-xs text-muted">
                          Grade {s.grade} {s.section} · {s.code} · parent linked: {s.parentId ? "yes" : "no"}
                        </span>
                      </span>
                      <span className="flex flex-wrap items-center gap-2">
                        {s.gender ? (
                          <span className="rounded-full bg-sky-soft px-2.5 py-1 text-xs font-semibold text-primary">
                            {genderLabel(s.gender)}
                          </span>
                        ) : (
                          <label className="flex items-center gap-2 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
                            <span>Set gender</span>
                            <select
                              value=""
                              aria-label={`Set gender for ${s.name}`}
                              className="bg-transparent text-xs text-ink outline-none"
                              onChange={(event) => {
                                const next = event.target.value;
                                if (next === "male" || next === "female") {
                                  const result = setStudentGender(s.id, next);
                                  if ("error" in result) {
                                    setNotice(result.error);
                                  }
                                }
                              }}
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </label>
                        )}
                        {s.descriptors.length === 0 ? (
                          <Button variant="outline" className="min-h-10 text-xs" onClick={() => setEnrollId(s.id)}>
                            Enroll face
                          </Button>
                        ) : (
                          <span className="rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">
                            Face enrolled
                          </span>
                        )}
                        <Button variant="ghost" className="min-h-10 text-xs" onClick={() => removeStudent(s.id)}>
                          Remove
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {enrollId ? (
          <div className="mt-4 max-w-sm">
            <p className="mb-2 text-sm text-muted">
              Capture 3–5 samples in different light. Written permission first.
            </p>
            <FaceCapture
              variant="paper"
              onCapture={(descriptor) => {
                const result = enrollFace(enrollId, descriptor);
                if ("error" in result) setNotice(result.error);
                else setNotice(`Saved face sample (${result.count} total).`);
              }}
            />
            <Button variant="ghost" className="mt-2" onClick={() => setEnrollId(null)}>
              Close camera
            </Button>
          </div>
        ) : null}
      </section>
      ) : null}

      {officeSearch.view === "settings" ? (
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Automatic Parent Alerts</h2>
        <p className="mt-1 text-sm text-muted">
          Choose which attendance events trigger a parent alert. Delivery credentials are stored on the server, not in this browser.
        </p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onNotify}>
          <fieldset className="grid gap-2 rounded-2xl border p-4 sm:col-span-2">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted">Notify Parents</legend>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="notifyCheckIn" defaultChecked={school.notify?.checkIn ?? true} /> Student checks in (on time or late)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="notifyCheckOut" defaultChecked={school.notify?.checkOut ?? false} /> Student checks out</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="notifyAbsence" defaultChecked={school.notify?.absence ?? false} /> Student is marked absent</label>
          </fieldset>
          <p className="rounded-xl bg-canvas p-3 text-sm text-muted sm:col-span-2">
            Email and SMS service credentials are configured as private server environment variables. This app never asks for or stores those secrets in browser storage.
          </p>
          <div className="sm:col-span-2">
            <Button type="submit">Save alert settings</Button>
          </div>
        </form>
      </section>
      ) : null}

      {officeSearch.view === "settings" ? (
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Data and Records</h2>
        <p className="mt-1 text-sm text-muted">Save a backup before moving this office data to another device.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportBackup}>Save backup</Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>Restore backup</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Clear students, parents, and attendance on this laptop? The office password stays.")) {
                clearRecords();
                setNotice("Records cleared.");
              }
            }}
          >
            Clear records
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              void onImportFile(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </div>
      </section>
      ) : null}

      {officeSearch.view === "settings" ? (
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Class Hours</h2>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onHours}>
          <Field name="schoolName" label="School name" defaultValue={school.name} />
          <Field name="campus" label="Campus" defaultValue={school.campus} />
          <Field name="arrivalStart" label="Arrival start" type="time" defaultValue={school.arrivalStart} />
          <Field name="arrivalEnd" label="Arrival end" type="time" defaultValue={school.arrivalEnd} />
          <Field name="absentCutoff" label="No-arrival cutoff" type="time" defaultValue={school.absentCutoff} />
          <Field name="dismissStart" label="Dismissal" type="time" defaultValue={school.dismissStart} />
          <div className="sm:col-span-2">
            <Button type="submit" variant="outline">
              Save hours
            </Button>
          </div>
        </form>
      </section>
      ) : null}

      {officeSearch.view === "settings" ? (
      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <h2 className="font-display text-xl font-semibold">Alerts Sent to Parents</h2>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Alerts appear after a gate scan or a missing-arrival mark.</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {alerts.slice(0, 12).map((a) => (
              <li key={a.id} className="rounded-2xl bg-canvas px-4 py-3 text-sm">
                {a.text}
                <span className="mt-1 block text-xs text-muted">{new Date(a.createdAt).toLocaleString()}</span>
                <span className="mt-1 block text-xs text-muted">
                  Email: {a.emailStatus}
                  {a.emailDetail ? ` — ${a.emailDetail}` : ""} · SMS: {a.smsStatus}
                  {a.smsDetail ? ` — ${a.smsDetail}` : ""}
                </span>
                <button
                  type="button"
                  disabled={a.emailStatus === "sent" && a.smsStatus === "sent" || a.emailStatus === "sending" || a.smsStatus === "sending"}
                  className="mt-2 text-xs font-medium text-primary"
                  onClick={() => void pushNotice(a.id)}
                >
                  Retry undelivered channels
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      ) : null}
      </div>
    </div>
  );
}

function SectionRosterBoard({
  sections,
  students,
  attendance,
  date,
  onDateChange,
}: {
  sections: ReturnType<typeof sortSections>;
  students: ReturnType<typeof useSchool.getState>["students"];
  attendance: ReturnType<typeof useSchool.getState>["attendance"];
  date: string;
  onDateChange: (date: string) => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [historyEnd, setHistoryEnd] = useState(todayISO());
  const [historyStart, setHistoryStart] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return todayISO(start);
  });
  const [historySectionId, setHistorySectionId] = useState(sections[0]?.id ?? "");
  const dayEvents = attendance.filter((event) => event.date === date);
  const historyEvents = attendance
    .filter((event) => event.date >= historyStart && event.date <= historyEnd)
    .filter((event) => {
      if (!historySectionId) return false;
      const student = students.find((item) => item.id === event.studentId);
      return student?.sectionId === historySectionId;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  function exportHistory() {
    const header = ["Date", "Time", "Student", "Code", "Grade", "Section", "Direction", "Method", "Result"];
    const rows = historyEvents.map((event) => {
      const student = students.find((item) => item.id === event.studentId);
      return [
        event.date,
        new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        student?.name ?? "Removed student",
        student?.code ?? "",
        student?.grade ?? "",
        student?.section ?? "",
        event.direction,
        event.method,
        STATUS_LABEL[event.status],
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",");
    });
    downloadText(
      `scn-attendance-history-${historyStart}-to-${historyEnd}.csv`,
      [header.join(","), ...rows].join("\n"),
      "text/csv;charset=utf-8",
    );
  }

  return (
    <div className="grid gap-4">
      <section className="flex flex-wrap items-end justify-between gap-3 rounded-3xl bg-paper p-5 shadow-border">
        <div>
          <h2 className="font-display text-xl font-semibold">Attendance History by Section</h2>
          <p className="mt-1 text-sm text-muted">
            Choose a date to inspect each section’s recorded attendance. Click "View attendance" to see the students and their status for that date.
          </p>
        </div>
        <label className="text-xs uppercase tracking-wider text-muted">
          Attendance date
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            className="mt-1 min-h-11 rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
          />
        </label>
      </section>

      {sections.length === 0 ? (
        <section className="rounded-3xl bg-paper p-6 text-sm text-muted shadow-border">
          No sections yet. Create one in the Rosters tab to get started.
        </section>
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const roster = studentsInSection(students, section.id);
            const sectionAttendance = roster.map((student) => {
              const events = dayEvents.filter((event) => event.studentId === student.id);
              return {
                student,
                hasArrived: events.some((event) => event.direction === "in"),
                hasAbsence: events.some((event) => event.status === "absent"),
              };
            });
            const presentCount = sectionAttendance.filter((item) => item.hasArrived).length;
            const absentCount = sectionAttendance.filter((item) => !item.hasArrived && item.hasAbsence).length;
            const notCheckedInCount = roster.length - presentCount - absentCount;
            const maleCount = roster.filter((student) => student.gender === "male").length;
            const femaleCount = roster.filter((student) => student.gender === "female").length;
            const groupedAttendance = groupRosterByGender(sortRosterStudents(roster, "name"));
            return (
              <section key={section.id} className="overflow-hidden rounded-3xl bg-paper shadow-border">
                <header className="border-b border-line bg-canvas/70 px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">Grade {section.grade}</p>
                      <h3 className="font-display text-lg font-semibold">{section.name}</h3>
                      {section.adviser ? <p className="text-xs text-muted">{section.adviser}</p> : null}
                    </div>
                    <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted">
                      {presentCount}/{roster.length} present
                    </span>
                  </div>
                </header>
                <div className="grid grid-cols-3 gap-2 px-4 pt-4" aria-label={`Attendance summary for Grade ${section.grade} ${section.name}`}>
                  <SectionAttendanceStat label="Present" value={presentCount} tone="text-ok" />
                  <SectionAttendanceStat label="Absent marked" value={absentCount} tone="text-rose" />
                  <SectionAttendanceStat label="Not checked in" value={notCheckedInCount} tone="text-muted" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 px-4 pb-4">
                  <div className="rounded-2xl bg-sky-soft/70 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted">Male</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{maleCount}</p>
                  </div>
                  <div className="rounded-2xl bg-canvas px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted">Female</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{femaleCount}</p>
                  </div>
                </div>
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    aria-expanded={Boolean(openSections[section.id])}
                    onClick={() =>
                      setOpenSections((current) => ({
                        ...current,
                        [section.id]: !current[section.id],
                      }))
                    }
                  >
                    {openSections[section.id] ? "Hide attendance" : "View attendance"}
                  </Button>
                </div>
                {openSections[section.id] ? (
                  roster.length === 0 ? (
                    <p className="border-t border-line px-4 py-4 text-sm text-muted">
                      No students assigned to this section yet.
                    </p>
                  ) : (
                    <div className="border-t border-line px-4 py-4">
                      <div className="space-y-3">
                        {groupedAttendance.map((group) => (
                          <div key={group.key} className="rounded-2xl border border-line bg-canvas/40 p-3">
                            <div className="mb-2 flex items-center justify-between border-b border-line pb-1">
                              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted">{group.label}</h4>
                              <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] text-muted">{group.students.length}</span>
                            </div>
                            <ul className="divide-y divide-line">
                              {group.students.map((student) => {
                                const events = dayEvents
                                  .filter((event) => event.studentId === student.id)
                                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                                const checkedInEvent = events.find((event) => event.direction === "in");
                                const absentEvent = events.find((event) => event.status === "absent");
                                const latestEvent = events[0];
                                const status = checkedInEvent
                                  ? latestEvent?.direction === "out"
                                    ? "Checked out"
                                    : "Checked in"
                                  : absentEvent
                                    ? "Absent recorded"
                                    : "Not checked in";
                                const tone = checkedInEvent
                                  ? "bg-ok-soft text-ok"
                                  : absentEvent
                                    ? "bg-rose-soft text-rose"
                                    : "bg-canvas text-muted";
                                return (
                                  <li key={student.id} className="flex items-center justify-between gap-2 py-3">
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-sm font-medium">{student.name}</span>
                                      <span className="text-xs text-muted">
                                        {student.gender ? `${genderLabel(student.gender)} · ` : ""}{student.code}
                                      </span>
                                    </span>
                                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
                                      {status}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      <section className="rounded-3xl bg-paper p-5 shadow-border">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Attendance history</h2>
            <p className="mt-1 text-sm text-muted">
              Review recorded check-ins, check-outs, and absences by date and section.
            </p>
          </div>
          <Button variant="outline" disabled={historyEvents.length === 0} onClick={exportHistory}>
            Export filtered history
          </Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-xs uppercase tracking-wider text-muted">
            From
            <input
              type="date"
              value={historyStart}
              max={historyEnd}
              onChange={(event) => {
                const nextStart = event.target.value;
                setHistoryStart(nextStart);
                if (nextStart > historyEnd) setHistoryEnd(nextStart);
              }}
              className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted">
            To
            <input
              type="date"
              value={historyEnd}
              min={historyStart}
              max={todayISO()}
              onChange={(event) => {
                const nextEnd = event.target.value;
                setHistoryEnd(nextEnd);
                if (nextEnd < historyStart) setHistoryStart(nextEnd);
              }}
              className="mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted">
            Section
            <SectionPicker
              sections={sections}
              value={historySectionId}
              onChange={setHistorySectionId}
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">
          {historySectionId
            ? `${historyEvents.length} attendance record${historyEvents.length === 1 ? "" : "s"} · ${historyStart} to ${historyEnd}`
            : "Choose a section to view its attendance history."}
        </p>
        {historyEvents.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-canvas/70 px-4 py-4 text-sm text-muted">
            {historySectionId
              ? "No attendance records match this date range for the selected section."
              : sections.length
                ? "Select a section above to see its attendance records."
                : "Create a section to start viewing attendance history."}
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[38rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 font-medium">Date / time</th>
                  <th className="py-2 font-medium">Student</th>
                  <th className="py-2 font-medium">Section</th>
                  <th className="py-2 font-medium">Event</th>
                  <th className="py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {historyEvents.map((event) => {
                  const student = students.find((item) => item.id === event.studentId);
                  const genderText = student?.gender ? genderLabel(student.gender) : "Gender unset";
                  return (
                    <tr key={event.id} className="border-t border-line">
                      <td className="py-2.5 tabular-nums">
                        {event.date} · {new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-2.5">
                        <div className="font-medium">{student?.name ?? "Removed student"}</div>
                        <div className="text-xs text-muted">{genderText}</div>
                      </td>
                      <td className="py-2.5">{student ? `Grade ${student.grade} ${student.section}` : "—"}</td>
                      <td className="py-2.5 capitalize">{event.direction === "none" ? "absence" : event.direction} · {event.method}</td>
                      <td className="py-2.5"><StatusBadge status={event.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SectionAttendanceStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-canvas/80 px-2 py-2 text-center">
      <p className={`font-display text-xl font-semibold tabular-nums ${tone}`}>{value}</p>
      <p className="text-[10px] leading-tight text-muted sm:text-xs">{label}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-paper px-4 py-4 shadow-border">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
