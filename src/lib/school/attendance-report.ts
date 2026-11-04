import type { AttendanceEvent, Student } from "./types";

export type AbsenceRankingRow = {
  student: Student;
  daysAbsent: number;
};

/** Rank current students by distinct dates recorded absent, highest first. */
export function rankMostAbsent(
  students: Student[],
  attendance: Pick<AttendanceEvent, "studentId" | "date" | "status">[],
  limit = 10,
): AbsenceRankingRow[] {
  const datesByStudent = new Map<string, Set<string>>();
  for (const event of attendance) {
    if (event.status !== "absent") continue;
    const dates = datesByStudent.get(event.studentId) ?? new Set<string>();
    dates.add(event.date);
    datesByStudent.set(event.studentId, dates);
  }

  return students
    .map((student) => ({
      student,
      daysAbsent: datesByStudent.get(student.id)?.size ?? 0,
    }))
    .filter((row) => row.daysAbsent > 0)
    .sort(
      (a, b) =>
        b.daysAbsent - a.daysAbsent ||
        a.student.name.localeCompare(b.student.name, "en", { sensitivity: "base" }) ||
        a.student.code.localeCompare(b.student.code, "en", { numeric: true }),
    )
    .slice(0, Math.max(0, limit));
}