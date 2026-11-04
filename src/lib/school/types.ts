export type GateStatus =
  | "on_time"
  | "late"
  | "early_exit"
  | "dismissed"
  | "absent";

export type Direction = "in" | "out" | "none";

export type DeliveryStatus = "idle" | "sending" | "sent" | "failed" | "skipped";

export type NotifySettings = {
  checkIn: boolean;
  checkOut: boolean;
  absence: boolean;
};

export type SchoolSection = {
  id: string;
  grade: string;
  name: string;
  adviser: string;
};

/** Student gender. Permanent once set at enrollment — never editable again. */
export type Gender = "male" | "female";

export type Student = {
  id: string;
  name: string;
  grade: string;
  section: string;
  sectionId: string;
  code: string;
  pin: string;
  parentId: string | null;
  /** Set once at enrollment, then locked permanently. */
  gender: Gender | null;
  descriptors: number[][];
};

export type ParentAccount = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
};

export type AttendanceEvent = {
  id: string;
  studentId: string;
  date: string;
  direction: Direction;
  status: GateStatus;
  method: "pin" | "face" | "sweep";
  createdAt: string;
};

export type Alert = {
  id: string;
  studentId: string;
  parentId: string;
  status: GateStatus;
  text: string;
  createdAt: string;
  emailStatus: DeliveryStatus;
  smsStatus: DeliveryStatus;
  emailDetail: string;
  smsDetail: string;
};

export type SchoolSettings = {
  name: string;
  campus: string;
  arrivalStart: string;
  arrivalEnd: string;
  absentCutoff: string;
  dismissStart: string;
  notify: NotifySettings;
};

export type Session =
  | { role: "none" }
  | { role: "office" }
  | { role: "parent"; parentId: string }
  | { role: "student"; studentId: string };

export type SchoolState = {
  school: SchoolSettings;
  officePasswordHash: string | null;
  sections: SchoolSection[];
  students: Student[];
  parents: ParentAccount[];
  attendance: AttendanceEvent[];
  alerts: Alert[];
  session: Session;
};

export type ClassRow = {
  name: string;
  grade: string;
  section: string;
  pin: string;
  gender: Gender | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentPassword: string;
};
