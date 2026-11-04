import type { Gender, Student } from "./types";

/** Roster gender order: male block first, then female, then unassigned last. */
export const GENDERS: readonly Gender[] = ["male", "female"] as const;

export const GENDER_LABEL: Record<Gender, string> = {
  male: "Male",
  female: "Female",
};

export const UNASSIGNED_GENDER_LABEL = "Gender not set";

export type GenderFilter = Gender | "all";

export const GENDER_FILTERS: readonly { value: GenderFilter; label: string }[] = [
  { value: "all", label: "All students" },
  { value: "male", label: GENDER_LABEL.male },
  { value: "female", label: GENDER_LABEL.female },
];

export type RosterSortMode = "name" | "surname";

export const ROSTER_SORT_MODES: readonly { value: RosterSortMode; label: string }[] = [
  { value: "name", label: "Alphabetical (A–Z)" },
  { value: "surname", label: "Surname (A–Z)" },
];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const OTHER_INITIAL = "#";

const GENDER_RANK: Record<string, number> = { male: 0, female: 1 };

const GENDER_ALIASES: Record<Gender, readonly string[]> = {
  male: ["male", "m", "boy", "lalaki"],
  female: ["female", "f", "girl", "babae"],
};

/** Reads a gender from CSV text or stored data. Unknown values become null. */
export function parseGender(value: unknown): Gender | null {
  if (value === null || value === undefined) return null;
  const key = String(value).trim().toLowerCase();
  if (!key) return null;
  if (GENDER_ALIASES.male.includes(key)) return "male";
  if (GENDER_ALIASES.female.includes(key)) return "female";
  return null;
}

export function genderLabel(gender: Gender | null): string {
  return gender ? GENDER_LABEL[gender] : UNASSIGNED_GENDER_LABEL;
}

export function genderRank(gender: Gender | null): number {
  return gender ? GENDER_RANK[gender] : GENDERS.length;
}

/** First letter of the written name, or "#" when it is not A–Z. */
export function nameInitial(name: string): string {
  const letter = name.trim().charAt(0).toLocaleUpperCase();
  return ALPHABET.includes(letter) ? letter : OTHER_INITIAL;
}

function nameTokens(name: string) {
  return name.trim().split(/\s+/).filter(Boolean);
}

function sortKey(name: string, mode: RosterSortMode) {
  const tokens = nameTokens(name);
  if (mode === "surname" && tokens.length > 1) {
    return `${tokens[tokens.length - 1]} ${tokens.slice(0, -1).join(" ")}`;
  }
  return tokens.join(" ");
}

function compareText(a: string, b: string) {
  return a.localeCompare(b, "en", { sensitivity: "base", numeric: true });
}

/**
 * Gender block first, then alphabetical order inside the block. Ties fall back
 * to the student code so the order never changes between renders.
 */
export function compareRosterStudents(
  a: Pick<Student, "name" | "code" | "gender">,
  b: Pick<Student, "name" | "code" | "gender">,
  mode: RosterSortMode,
): number {
  const byGender = genderRank(a.gender) - genderRank(b.gender);
  if (byGender !== 0) return byGender;
  const byName = compareText(sortKey(a.name, mode), sortKey(b.name, mode));
  if (byName !== 0) return byName;
  return compareText(a.code, b.code);
}

export function sortRosterStudents<T extends Pick<Student, "name" | "code" | "gender">>(
  students: T[],
  mode: RosterSortMode = "name",
): T[] {
  return [...students].sort((a, b) => compareRosterStudents(a, b, mode));
}

export type RosterGroup = {
  key: string;
  gender: Gender | null;
  label: string;
  students: Student[];
};

/** Splits a section roster into gender blocks, each in alphabetical order. */
export function groupRosterByGender(
  students: Student[],
  mode: RosterSortMode = "name",
): RosterGroup[] {
  const sorted = sortRosterStudents(students, mode);
  const groups: RosterGroup[] = [];
  for (const gender of [...GENDERS, null] as (Gender | null)[]) {
    const block = sorted.filter((student) => student.gender === gender);
    if (block.length === 0) continue;
    groups.push({
      key: gender ?? "unassigned",
      gender,
      label: genderLabel(gender),
      students: block,
    });
  }
  return groups;
}

export function filterRosterByGender(students: Student[], filter: GenderFilter): Student[] {
  return filter === "all" ? students : students.filter((s) => s.gender === filter);
}

export function filterRosterByInitial(students: Student[], initial: string | null): Student[] {
  if (!initial) return students;
  return students.filter((s) => nameInitial(s.name) === initial);
}

/** Initials actually used by a roster, in A–Z order so the index stays tidy. */
export function initialsInRoster(students: Pick<Student, "name">[]): string[] {
  const used = new Set(students.map((s) => nameInitial(s.name)));
  const letters = ALPHABET.filter((letter) => used.has(letter));
  return used.has(OTHER_INITIAL) ? [...letters, OTHER_INITIAL] : letters;
}

export function countByGender(students: Student[]) {
  return {
    male: students.filter((s) => s.gender === "male").length,
    female: students.filter((s) => s.gender === "female").length,
    unassigned: students.filter((s) => !s.gender).length,
  };
}
