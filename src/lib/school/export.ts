import { genderLabel, sortRosterStudents } from "./gender";
import { STATUS_LABEL } from "./rules";
import { sectionLabel } from "./sections";
import type { SchoolState } from "./types";

export function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const CSV_HEADER = [
  "Date",
  "Time",
  "Student",
  "Code",
  "Grade",
  "Section",
  "Gender",
  "Direction",
  "Method",
  "Result",
];

function csvCell(value: unknown) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function attendanceCsv(state: SchoolState) {
  const rows = state.attendance.map((row) => {
    const student = state.students.find((s) => s.id === row.studentId);
    const when = new Date(row.createdAt);
    return [
      row.date,
      when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      student?.name ?? "",
      student?.code ?? "",
      student?.grade ?? "",
      student?.section ?? "",
      genderLabel(student?.gender ?? null),
      row.direction,
      row.method,
      STATUS_LABEL[row.status],
    ]
      .map(csvCell)
      .join(",");
  });
  return [CSV_HEADER.join(","), ...rows].join("\n");
}

/**
 * Class list for printing or filing: male block first, then female, then any
 * student still missing a gender, each block in alphabetical order.
 */
export function rosterCsv(state: SchoolState) {
  const header = [
    "Grade",
    "Section",
    "Gender",
    "Student",
    "Student code",
    "Parent linked",
  ];
  const rows: string[] = [];
  const sections = [...state.sections].sort((a, b) => {
    const grade = Number(a.grade) - Number(b.grade);
    return Number.isNaN(grade) || grade === 0
      ? a.name.localeCompare(b.name)
      : grade;
  });
  for (const section of sections) {
    const roster = sortRosterStudents(
      state.students.filter((student) => student.sectionId === section.id),
    );
    if (roster.length === 0) continue;
    rows.push([sectionLabel(section), "", "", "", "", ""].map(csvCell).join(","));
    for (const student of roster) {
      rows.push(
        [
          student.grade,
          student.section,
          genderLabel(student.gender),
          student.name,
          student.code,
          student.parentId ? "yes" : "no",
        ]
          .map(csvCell)
          .join(","),
      );
    }
  }
  return [header.join(","), ...rows].join("\n");
}

export function backupPayload(state: SchoolState) {
  return {
    school: state.school,
    officePasswordHash: state.officePasswordHash,
    sections: state.sections,
    students: state.students,
    parents: state.parents,
    attendance: state.attendance,
    alerts: state.alerts,
  };
}
