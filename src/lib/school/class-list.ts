import { parseGender } from "./gender";
import type { ClassRow } from "./types";

export const CLASS_TEMPLATE = `student_name,grade,section,gender,pin,parent_name,parent_email,parent_phone
Ana Dela Cruz,7,Rizal,Female,1701,Rosa Dela Cruz,rosa.delacruz@email.com,09171234501
Carlo Mendoza,7,Bonifacio,Male,1702,Ramon Mendoza,ramon.mendoza@email.com,09171234502
Jasmine Reyes,8,Mabini,Female,1801,Elena Reyes,elena.reyes@email.com,09171234503
Miguel Santos,10,Rizal,Male,1001,Teresa Santos,teresa.santos@email.com,09171234504
Sofia Ramirez,11,STEM,Female,1101,Andres Ramirez,andres.ramirez@email.com,09171234505
Diego Villanueva,12,ABM,Male,1201,Lorna Villanueva,lorna.villanueva@email.com,09171234506
`;

type DemoRow = [
  name: string,
  grade: string,
  section: string,
  gender: string,
  parentName: string,
];

const DEMO: DemoRow[] = [
  ["Ana Dela Cruz", "7", "Rizal", "Female", "Rosa Dela Cruz"],
  ["Paolo Gutierrez", "7", "Rizal", "Male", "Marites Gutierrez"],
  ["Carlo Mendoza", "7", "Bonifacio", "Male", "Ramon Mendoza"],
  ["Hannah Cruz", "7", "Bonifacio", "Female", "Roberto Cruz"],
  ["Jasmine Reyes", "7", "Mabini", "Female", "Elena Reyes"],
  ["Rafael Bautista", "8", "Rizal", "Male", "Cecilia Bautista"],
  ["Camille Flores", "8", "Bonifacio", "Female", "Antonio Flores"],
  ["Enzo Magno", "8", "Mabini", "Male", "Gloria Magno"],
  ["Bianca Torres", "8", "Luna", "Female", "Manuel Torres"],
  ["Luis Fernandez", "9", "Rizal", "Male", "Alicia Fernandez"],
  ["Andrea Lim", "9", "Bonifacio", "Female", "Francis Lim"],
  ["Marco Castillo", "9", "Mabini", "Male", "Imelda Castillo"],
  ["Miguel Santos", "10", "Rizal", "Male", "Teresa Santos"],
  ["Sofia Ramirez", "10", "Rizal", "Female", "Andres Ramirez"],
  ["Diego Villanueva", "10", "Bonifacio", "Male", "Lorna Villanueva"],
  ["Liza Navarro", "10", "Luna", "Female", "Pedro Navarro"],
  ["Patricia Gomez", "11", "STEM", "Female", "Ricardo Gomez"],
  ["Nico Salazar", "11", "ABM", "Male", "Josefa Salazar"],
  ["Katrina Tan", "11", "HUMSS", "Female", "Eduardo Tan"],
  ["Joshua Morales", "12", "STEM", "Male", "Lydia Morales"],
  ["Lara Villanueva", "12", "ABM", "Female", "Cora Villanueva"],
  ["Ian Mercado", "12", "HUMSS", "Male", "Helen Mercado"],
];

export function starterClass(): ClassRow[] {
  return DEMO.map(([name, grade, section, gender, parentName], i) => {
    const n = 1001 + i;
    return {
      name,
      grade,
      section,
      pin: String(n),
      gender: parseGender(gender),
      parentName,
      parentEmail: "",
      parentPhone: "",
      parentPassword: `scn${n}`,
    };
  });
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if ((ch === "," || ch === "\t") && !quoted) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const HEADER_ALIASES: Record<string, keyof ClassRow> = {
  student_name: "name",
  student: "name",
  name: "name",
  grade: "grade",
  grade_level: "grade",
  level: "grade",
  section: "section",
  gender: "gender",
  sex: "gender",
  pin: "pin",
  parent_name: "parentName",
  guardian: "parentName",
  guardian_name: "parentName",
  parent_email: "parentEmail",
  email: "parentEmail",
  parent_phone: "parentPhone",
  phone: "parentPhone",
  mobile: "parentPhone",
  parent_password: "parentPassword",
  password: "parentPassword",
};

/** Column order used when a class list has no header row. */
const LEGACY_ORDER: Array<keyof ClassRow> = [
  "name",
  "grade",
  "section",
  "pin",
  "parentName",
  "parentEmail",
  "parentPhone",
  "parentPassword",
];

function headerMapping(cols: string[]): Array<keyof ClassRow | null> | null {
  const first = (cols[0] ?? "").trim().toLowerCase();
  if (first !== "student_name" && first !== "name" && first !== "student") return null;
  const rest = cols.slice(1).map((col) => HEADER_ALIASES[col.trim().toLowerCase()] ?? null);
  if (rest.every((field) => field === null)) return null;
  return [HEADER_ALIASES[first] ?? "name", ...rest];
}

function emptyRow(): ClassRow {
  return {
    name: "",
    grade: "10",
    section: "Rizal",
    pin: "",
    gender: null,
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentPassword: "",
  };
}

function assignColumn(row: ClassRow, field: keyof ClassRow, value: string) {
  switch (field) {
    case "name":
      row.name = value;
      return;
    case "grade":
      row.grade = value || "10";
      return;
    case "section":
      row.section = value || "Rizal";
      return;
    case "pin":
      row.pin = value;
      return;
    case "gender":
      row.gender = parseGender(value);
      return;
    case "parentName":
      row.parentName = value;
      return;
    case "parentEmail":
      row.parentEmail = value;
      return;
    case "parentPhone":
      row.parentPhone = value;
      return;
    case "parentPassword":
      row.parentPassword = value;
      return;
  }
}

export function parseClassCsv(text: string): ClassRow[] | { error: string } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { error: "The file is empty." };
  const rows: ClassRow[] = [];
  let mapping: Array<keyof ClassRow | null> | null = null;
  for (const line of lines) {
    const cols = splitCsvLine(line);
    if (mapping === null) {
      const detected = headerMapping(cols);
      if (detected) {
        mapping = detected;
        continue;
      }
      mapping = LEGACY_ORDER;
    }
    const row = emptyRow();
    mapping.forEach((field, index) => {
      if (!field) return;
      assignColumn(row, field, (cols[index] ?? "").trim());
    });
    if (!row.name) continue;
    rows.push(row);
  }
  if (rows.length === 0) return { error: "No student rows found." };
  return rows;
}
