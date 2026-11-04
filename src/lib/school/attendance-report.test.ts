import assert from "node:assert/strict";
import test from "node:test";
import { rankMostAbsent } from "./attendance-report.ts";
import type { AttendanceEvent, Student } from "./types.ts";

function student(id: string, name: string): Student {
  return {
    id,
    name,
    grade: "10",
    section: "Rizal",
    sectionId: "rizal",
    code: `STUDENTS-${id}`,
    pin: "0000",
    parentId: null,
    gender: null,
    descriptors: [],
  };
}

function event(studentId: string, date: string, status: AttendanceEvent["status"]): AttendanceEvent {
  return {
    id: `${studentId}-${date}-${status}`,
    studentId,
    date,
    direction: status === "absent" ? "none" : "in",
    status,
    method: status === "absent" ? "sweep" : "pin",
    createdAt: `${date}T08:00:00.000Z`,
  };
}

test("ranks students by distinct absent dates and ignores other attendance statuses", () => {
  const students = [student("1", "Mia"), student("2", "Ana"), student("3", "No absences")];
  const attendance = [
    event("1", "2026-10-01", "absent"),
    event("1", "2026-10-01", "absent"),
    event("1", "2026-10-02", "absent"),
    event("2", "2026-10-01", "absent"),
    event("2", "2026-10-02", "on_time"),
  ];

  assert.deepEqual(
    rankMostAbsent(students, attendance).map(({ student: item, daysAbsent }) => [item.name, daysAbsent]),
    [["Mia", 2], ["Ana", 1]],
  );
});

test("uses alphabetical order for ties and respects the result limit", () => {
  const students = [student("1", "Zara"), student("2", "Ana"), student("3", "Bea")];
  const attendance = students.map((item) => event(item.id, "2026-10-01", "absent"));

  assert.deepEqual(
    rankMostAbsent(students, attendance, 2).map(({ student: item }) => item.name),
    ["Ana", "Bea"],
  );
});