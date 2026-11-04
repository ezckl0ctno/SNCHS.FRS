import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as todayISO, c as genderLabel, f as parseGender, g as studentsInSection, h as sortSections, i as STATUS_LABEL, l as groupRosterByGender, m as sortRosterStudents, n as Button, o as currentAttendanceEvents, p as sectionLabel, r as ClientReady, t as AppShell, u as isBeforeDismissal, v as useSchool } from "./app-shell-DQRKUXmS.mjs";
import { t as FaceCapture } from "./face-capture-6OZaEGJP.mjs";
import { n as Route$3 } from "./router-GP3dJUXq.mjs";
import { n as SectionPicker, t as Field } from "./section-picker-CJ_hYGnM.mjs";
import { t as StatusBadge } from "./status-badge-DRB5YNTi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/office-DAuSOwrI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function downloadText(filename, text, type) {
	const blob = new Blob([text], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
var CSV_HEADER = [
	"Date",
	"Time",
	"Student",
	"Code",
	"Grade",
	"Section",
	"Gender",
	"Direction",
	"Method",
	"Result"
];
function csvCell(value) {
	return `"${String(value).replaceAll("\"", "\"\"")}"`;
}
function attendanceCsv(state) {
	const rows = state.attendance.map((row) => {
		const student = state.students.find((s) => s.id === row.studentId);
		const when = new Date(row.createdAt);
		return [
			row.date,
			when.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}),
			student?.name ?? "",
			student?.code ?? "",
			student?.grade ?? "",
			student?.section ?? "",
			genderLabel(student?.gender ?? null),
			row.direction,
			row.method,
			STATUS_LABEL[row.status]
		].map(csvCell).join(",");
	});
	return [CSV_HEADER.join(","), ...rows].join("\n");
}
function backupPayload(state) {
	return {
		school: state.school,
		officePasswordHash: state.officePasswordHash,
		sections: state.sections,
		students: state.students,
		parents: state.parents,
		attendance: state.attendance,
		alerts: state.alerts
	};
}
var CLASS_TEMPLATE = `student_name,grade,section,gender,pin,parent_name,parent_email,parent_phone
Ana Dela Cruz,7,Rizal,Female,1701,Rosa Dela Cruz,rosa.delacruz@email.com,09171234501
Carlo Mendoza,7,Bonifacio,Male,1702,Ramon Mendoza,ramon.mendoza@email.com,09171234502
Jasmine Reyes,8,Mabini,Female,1801,Elena Reyes,elena.reyes@email.com,09171234503
Miguel Santos,10,Rizal,Male,1001,Teresa Santos,teresa.santos@email.com,09171234504
Sofia Ramirez,11,STEM,Female,1101,Andres Ramirez,andres.ramirez@email.com,09171234505
Diego Villanueva,12,ABM,Male,1201,Lorna Villanueva,lorna.villanueva@email.com,09171234506
`;
var DEMO = [
	[
		"Ana Dela Cruz",
		"7",
		"Rizal",
		"Female",
		"Rosa Dela Cruz"
	],
	[
		"Paolo Gutierrez",
		"7",
		"Rizal",
		"Male",
		"Marites Gutierrez"
	],
	[
		"Carlo Mendoza",
		"7",
		"Bonifacio",
		"Male",
		"Ramon Mendoza"
	],
	[
		"Hannah Cruz",
		"7",
		"Bonifacio",
		"Female",
		"Roberto Cruz"
	],
	[
		"Jasmine Reyes",
		"7",
		"Mabini",
		"Female",
		"Elena Reyes"
	],
	[
		"Rafael Bautista",
		"8",
		"Rizal",
		"Male",
		"Cecilia Bautista"
	],
	[
		"Camille Flores",
		"8",
		"Bonifacio",
		"Female",
		"Antonio Flores"
	],
	[
		"Enzo Magno",
		"8",
		"Mabini",
		"Male",
		"Gloria Magno"
	],
	[
		"Bianca Torres",
		"8",
		"Luna",
		"Female",
		"Manuel Torres"
	],
	[
		"Luis Fernandez",
		"9",
		"Rizal",
		"Male",
		"Alicia Fernandez"
	],
	[
		"Andrea Lim",
		"9",
		"Bonifacio",
		"Female",
		"Francis Lim"
	],
	[
		"Marco Castillo",
		"9",
		"Mabini",
		"Male",
		"Imelda Castillo"
	],
	[
		"Miguel Santos",
		"10",
		"Rizal",
		"Male",
		"Teresa Santos"
	],
	[
		"Sofia Ramirez",
		"10",
		"Rizal",
		"Female",
		"Andres Ramirez"
	],
	[
		"Diego Villanueva",
		"10",
		"Bonifacio",
		"Male",
		"Lorna Villanueva"
	],
	[
		"Liza Navarro",
		"10",
		"Luna",
		"Female",
		"Pedro Navarro"
	],
	[
		"Patricia Gomez",
		"11",
		"STEM",
		"Female",
		"Ricardo Gomez"
	],
	[
		"Nico Salazar",
		"11",
		"ABM",
		"Male",
		"Josefa Salazar"
	],
	[
		"Katrina Tan",
		"11",
		"HUMSS",
		"Female",
		"Eduardo Tan"
	],
	[
		"Joshua Morales",
		"12",
		"STEM",
		"Male",
		"Lydia Morales"
	],
	[
		"Lara Villanueva",
		"12",
		"ABM",
		"Female",
		"Cora Villanueva"
	],
	[
		"Ian Mercado",
		"12",
		"HUMSS",
		"Male",
		"Helen Mercado"
	]
];
function starterClass() {
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
			parentPassword: `scn${n}`
		};
	});
}
function splitCsvLine(line) {
	const out = [];
	let cur = "";
	let quoted = false;
	for (const ch of line) {
		if (ch === "\"") {
			quoted = !quoted;
			continue;
		}
		if ((ch === "," || ch === "	") && !quoted) {
			out.push(cur.trim());
			cur = "";
			continue;
		}
		cur += ch;
	}
	out.push(cur.trim());
	return out;
}
var HEADER_ALIASES = {
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
	password: "parentPassword"
};
/** Column order used when a class list has no header row. */
var LEGACY_ORDER = [
	"name",
	"grade",
	"section",
	"pin",
	"parentName",
	"parentEmail",
	"parentPhone",
	"parentPassword"
];
function headerMapping(cols) {
	const first = (cols[0] ?? "").trim().toLowerCase();
	if (first !== "student_name" && first !== "name" && first !== "student") return null;
	const rest = cols.slice(1).map((col) => HEADER_ALIASES[col.trim().toLowerCase()] ?? null);
	if (rest.every((field) => field === null)) return null;
	return [HEADER_ALIASES[first] ?? "name", ...rest];
}
function emptyRow() {
	return {
		name: "",
		grade: "10",
		section: "Rizal",
		pin: "",
		gender: null,
		parentName: "",
		parentEmail: "",
		parentPhone: "",
		parentPassword: ""
	};
}
function assignColumn(row, field, value) {
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
function parseClassCsv(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	if (lines.length === 0) return { error: "The file is empty." };
	const rows = [];
	let mapping = null;
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
/** Rank current students by distinct dates recorded absent, highest first. */
function rankMostAbsent(students, attendance, limit = 10) {
	const datesByStudent = /* @__PURE__ */ new Map();
	for (const event of attendance) {
		if (event.status !== "absent") continue;
		const dates = datesByStudent.get(event.studentId) ?? /* @__PURE__ */ new Set();
		dates.add(event.date);
		datesByStudent.set(event.studentId, dates);
	}
	return students.map((student) => ({
		student,
		daysAbsent: datesByStudent.get(student.id)?.size ?? 0
	})).filter((row) => row.daysAbsent > 0).sort((a, b) => b.daysAbsent - a.daysAbsent || a.student.name.localeCompare(b.student.name, "en", { sensitivity: "base" }) || a.student.code.localeCompare(b.student.code, "en", { numeric: true })).slice(0, Math.max(0, limit));
}
function OfficePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Office Dashboard",
		kicker: "Sta Catalina National High School",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientReady, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeGate, {}) })
	});
}
function OfficeGate() {
	const session = useSchool((s) => s.session);
	if (!Boolean(useSchool((s) => s.officePasswordHash))) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: [
			"Create the office password on the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-primary underline",
				children: "home page"
			}),
			" first."
		]
	});
	if (session.role !== "office") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: [
			"Sign in as office on the ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-primary underline",
				children: "home page"
			}),
			"."
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeBody, {});
}
function OfficeBody() {
	const officeSearch = Route$3.useSearch();
	const navigate = Route$3.useNavigate();
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
	const [notice, setNotice] = (0, import_react.useState)("");
	const [enrollId, setEnrollId] = (0, import_react.useState)(null);
	const [historyDate, setHistoryDate] = (0, import_react.useState)(todayISO());
	const [filterSection, setFilterSection] = (0, import_react.useState)(sections[0]?.id ?? "");
	const [rosterSectionId, setRosterSectionId] = (0, import_react.useState)(sections[0]?.id ?? "");
	const [rosterQuery, setRosterQuery] = (0, import_react.useState)("");
	const [addSectionId, setAddSectionId] = (0, import_react.useState)(sections[0]?.id ?? "");
	const fileRef = (0, import_react.useRef)(null);
	const classFileRef = (0, import_react.useRef)(null);
	const currentDate = todayISO();
	const canMarkAbsencesForDate = isBeforeDismissal(school);
	const today = currentAttendanceEvents(attendance, school);
	const activeRosterSectionId = sections.some((section) => section.id === rosterSectionId) ? rosterSectionId : sections[0]?.id ?? "";
	const activeRosterSection = sections.find((section) => section.id === activeRosterSectionId);
	const activeLogSectionId = sections.some((section) => section.id === filterSection) ? filterSection : sections[0]?.id ?? "";
	const rosterStudents = activeRosterSectionId ? studentsInSection(students, activeRosterSectionId) : [];
	const normalizedRosterQuery = rosterQuery.trim().toLocaleLowerCase();
	const searchedStudents = normalizedRosterQuery ? rosterStudents.filter((student) => [
		student.name,
		student.code,
		student.grade,
		student.section
	].some((value) => value.toLocaleLowerCase().includes(normalizedRosterQuery))) : rosterStudents;
	const rosterGroups = groupRosterByGender(sortRosterStudents(searchedStudents, "name"));
	const absenceCards = sortSections(sections).map((section) => ({
		section,
		students: rankMostAbsent(studentsInSection(students, section.id), attendance)
	}));
	const visibleToday = activeLogSectionId ? today.filter((a) => {
		return students.find((s) => s.id === a.studentId)?.sectionId === activeLogSectionId;
	}) : [];
	const loggedInToday = visibleToday.filter((event) => event.direction === "in").map((event) => ({
		event,
		student: students.find((student) => student.id === event.studentId)
	})).sort((a, b) => (a.student?.name ?? "").localeCompare(b.student?.name ?? "", "en", { sensitivity: "base" }));
	const stats = (0, import_react.useMemo)(() => ({
		events: visibleToday.length,
		onTime: visibleToday.filter((a) => a.status === "on_time").length,
		late: visibleToday.filter((a) => a.status === "late").length,
		absent: visibleToday.filter((a) => a.status === "absent").length
	}), [visibleToday]);
	function onAddStudent(e) {
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
			gender
		});
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`${result.name} saved in Grade ${result.grade} — ${result.section}. Student ID ${result.code}. PIN ${result.pin}.`);
		form.reset();
	}
	async function onAddParent(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const result = await addParent({
			name: String(data.get("pname") || ""),
			email: String(data.get("email") || ""),
			phone: String(data.get("phone") || ""),
			password: String(data.get("ppass") || "")
		});
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`${result.name} can be reached at ${result.email || result.phone}. Give them their password in person.`);
		form.reset();
	}
	function onAddSection(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const result = addSection({
			grade: String(data.get("sgrade") || ""),
			name: String(data.get("sname") || ""),
			adviser: String(data.get("sadviser") || "")
		});
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`${sectionLabel(result)} is open.`);
		setAddSectionId(result.id);
		form.reset();
	}
	function onHours(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		updateHours({
			name: String(data.get("schoolName") || school.name).trim() || school.name,
			campus: String(data.get("campus") || school.campus).trim(),
			arrivalStart: String(data.get("arrivalStart") || school.arrivalStart),
			arrivalEnd: String(data.get("arrivalEnd") || school.arrivalEnd),
			absentCutoff: String(data.get("absentCutoff") || school.absentCutoff),
			dismissStart: String(data.get("dismissStart") || school.dismissStart)
		});
		setNotice("School hours and name saved.");
	}
	function exportLog() {
		downloadText(`scn-attendance-${currentDate}-${activeLogSectionId}.csv`, attendanceCsv({
			...useSchool.getState(),
			attendance: visibleToday
		}), "text/csv;charset=utf-8");
		setNotice("Attendance CSV downloaded.");
	}
	function exportBackup() {
		downloadText(`scn-gate-backup-${todayISO()}.json`, JSON.stringify(backupPayload(useSchool.getState()), null, 2), "application/json");
		setNotice("Backup saved. Keep that file on this laptop.");
	}
	async function onImportFile(file) {
		if (!file) return;
		try {
			const raw = JSON.parse(await file.text());
			const result = importBackup(raw);
			setNotice("ok" in result ? "Backup restored on this laptop." : result.error);
		} catch {
			setNotice("That file could not be read.");
		}
	}
	async function loadRows(rows) {
		const result = await importClass(rows);
		if ("error" in result) {
			setNotice(result.error);
			return;
		}
		setNotice(`Loaded ${result.added} student${result.added === 1 ? "" : "s"} across ${result.sections} new section${result.sections === 1 ? "" : "s"} and ${result.parents} parent contact${result.parents === 1 ? "" : "s"}.`);
	}
	async function onClassFile(file) {
		if (!file) return;
		const parsed = parseClassCsv(await file.text());
		if ("error" in parsed) {
			setNotice(parsed.error);
			return;
		}
		await loadRows(parsed);
	}
	function onNotify(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		updateNotify({
			checkIn: data.get("notifyCheckIn") === "on",
			checkOut: data.get("notifyCheckOut") === "on",
			absence: data.get("notifyAbsence") === "on"
		});
		setNotice("Parent alert preferences saved. Delivery uses the school’s protected server configuration.");
	}
	const orderedSections = sortSections(sections);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 border-b border-line pb-3 sm:grid-cols-5",
				role: "tablist",
				"aria-label": "Office views",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: officeSearch.view === "dashboard" ? "primary" : "outline",
						role: "tab",
						"aria-selected": officeSearch.view === "dashboard",
						onClick: () => void navigate({ search: { view: "dashboard" } }),
						children: "Overview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: officeSearch.view === "roster" ? "primary" : "outline",
						role: "tab",
						"aria-selected": officeSearch.view === "roster",
						onClick: () => void navigate({ search: { view: "roster" } }),
						children: "Rosters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: officeSearch.view === "sections" ? "primary" : "outline",
						role: "tab",
						"aria-selected": officeSearch.view === "sections",
						onClick: () => void navigate({ search: { view: "sections" } }),
						children: "Gate History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: officeSearch.view === "history" ? "primary" : "outline",
						role: "tab",
						"aria-selected": officeSearch.view === "history",
						onClick: () => void navigate({ search: { view: "history" } }),
						children: "Sections and Attendance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: officeSearch.view === "settings" ? "primary" : "outline",
						role: "tab",
						"aria-selected": officeSearch.view === "settings",
						onClick: () => void navigate({ search: { view: "settings" } }),
						children: "Settings"
					})
				]
			}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok",
				role: "status",
				children: notice
			}) : null,
			officeSearch.view === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionRosterBoard, {
				sections: orderedSections,
				students,
				attendance,
				date: historyDate,
				onDateChange: setHistoryDate
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [
					officeSearch.view === "dashboard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: "Office"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-2xl font-semibold",
								children: "School Office"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-2xl text-sm text-muted",
								children: "Your sections, student rosters, daily attendance, and school settings are organized into separate views. Choose a workspace above to get started."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Sections",
										value: sections.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Students",
										value: students.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Today’s gate events",
										value: today.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Alerts",
										value: alerts.length
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "mt-6",
								"aria-labelledby": "absence-ranking-title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex flex-wrap items-end justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										id: "absence-ranking-title",
										className: "font-display text-lg font-semibold",
										children: "Most absences by section"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: "Students are ranked by distinct dates marked absent."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted",
										children: [absenceCards.length, " sections"]
									})]
								}), absenceCards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-2xl border border-line bg-canvas/50 p-4 text-sm text-muted",
									children: "Create sections and record attendance to see absence rankings."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
									children: absenceCards.map(({ section, students: absentees }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: "rounded-2xl border border-line bg-canvas/50 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
											className: "flex items-start justify-between gap-2 border-b border-line pb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] font-semibold uppercase tracking-wider text-muted",
												children: ["Grade ", section.grade]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-display text-base font-semibold",
												children: section.name
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-paper px-2.5 py-1 text-[10px] font-semibold text-muted",
												children: [studentsInSection(students, section.id).length, " students"]
											})]
										}), absentees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "pt-3 text-xs text-muted",
											children: "No absences recorded."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
											className: "divide-y divide-line",
											children: absentees.slice(0, 3).map(({ student, daysAbsent }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center justify-between gap-2 py-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "min-w-0",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mr-2 inline-flex size-5 items-center justify-center rounded-full bg-paper text-[10px] font-semibold text-primary",
															children: index + 1
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-sm font-medium",
															children: student.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "block pl-7 text-[10px] text-muted",
															children: student.code
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "shrink-0 rounded-full bg-rose-soft px-2 py-1 text-[10px] font-semibold text-rose",
													children: [
														daysAbsent,
														" ",
														daysAbsent === 1 ? "day" : "days"
													]
												})]
											}, student.id))
										})]
									}, section.id))
								})]
							})
						]
					}) : null,
					officeSearch.view === "sections" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl bg-paper p-5 shadow-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-end justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-semibold",
									children: "Gate History by Section"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "Choose a section to identify its students’ gate events."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: currentDate
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
								children: orderedSections.map((section) => {
									const sectionEvents = today.filter((event) => {
										return students.find((item) => item.id === event.studentId)?.sectionId === section.id;
									});
									const selected = activeLogSectionId === section.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": selected,
										onClick: () => setFilterSection(section.id),
										className: `min-h-14 rounded-xl px-3 py-2 text-left text-sm transition-colors ${selected ? "bg-navy text-primary-fg" : "bg-canvas/80 text-ink hover:bg-sky-soft/60"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block font-medium",
											children: [
												"Grade ",
												section.grade,
												" · ",
												section.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-xs ${selected ? "text-primary-fg/80" : "text-muted"}`,
											children: [
												sectionEvents.length,
												" event",
												sectionEvents.length === 1 ? "" : "s"
											]
										})]
									}, section.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "This date",
									value: stats.events
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "On time",
									value: stats.onTime
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Late",
									value: stats.late
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "No arrival",
									value: stats.absent
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "primary",
									disabled: !canMarkAbsencesForDate || !activeLogSectionId,
									onClick: () => {
										const scope = sections.find((section) => section.id === activeLogSectionId);
										const scopeLabel = scope ? sectionLabel(scope) : "the selected section";
										if (!confirm(`Record missing arrivals for ${scopeLabel} on ${currentDate}? Students who already checked in or already have an absence record will be left unchanged. This may also send attendance alerts to linked parents.`)) return;
										(async () => {
											const n = await markAbsences(activeLogSectionId || void 0);
											setNotice(n ? `Recorded ${n} missing arrival${n === 1 ? "" : "s"}${scope ? ` in ${sectionLabel(scope)}` : ""}.` : "Every student in this view already has a check-in or an absence today.");
										})();
									},
									children: "Mark today’s missing arrivals"
								}),
								!canMarkAbsencesForDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "self-center text-sm text-muted",
									children: `Missing arrivals close at dismissal (${school.dismissStart}); the current attendance cycle has already reset.`
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: exportLog,
									children: "Download CSV"
								})
							]
						})
					] }) : null,
					officeSearch.view === "roster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Sections"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "The school can run many sections at once. Students may only sign in and check in under the section they belong to. Add extra strands or rooms as needed."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid gap-3 sm:grid-cols-4",
								onSubmit: onAddSection,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "sgrade",
										label: "Grade",
										placeholder: "12",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "sname",
										label: "Section name",
										placeholder: "Add your Section",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "sadviser",
										label: "Adviser",
										placeholder: "Optional"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "w-full",
											children: "Add section"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 grid gap-2 sm:grid-cols-2",
								children: orderedSections.map((sec) => {
									const count = studentsInSection(students, sec.id).length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between gap-2 rounded-2xl bg-canvas/80 px-4 py-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: sectionLabel(sec)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-xs text-muted",
											children: [
												count,
												" student",
												count === 1 ? "" : "s",
												sec.adviser ? ` · ${sec.adviser}` : ""
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											className: "min-h-10 text-xs",
											onClick: () => {
												const result = removeSection(sec.id);
												setNotice("error" in result ? result.error : `${sectionLabel(sec)} removed.`);
											},
											children: "Remove"
										})]
									}, sec.id);
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Class List"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "CSV columns include grade and section, so one file can load the whole school. Download the template, replace the sample rows, then import it."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => downloadText("scn-class-template.csv", CLASS_TEMPLATE, "text/csv;charset=utf-8"),
										children: "Download template"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => classFileRef.current?.click(),
										children: "Import CSV"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => {
											if (students.length && !confirm("Add the multi-section starter roster to the current list?")) return;
											loadRows(starterClass());
										},
										children: "Load sample school"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: classFileRef,
										type: "file",
										accept: ".csv,text/csv",
										className: "hidden",
										onChange: (e) => {
											onClassFile(e.target.files?.[0]);
											e.currentTarget.value = "";
										}
									})
								]
							})
						]
					})] }) : null,
					officeSearch.view === "sections" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-3 print:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Gate History"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										sectionLabel(sections.find((section) => section.id === activeLogSectionId) ?? {
											grade: "",
											name: "Section"
										}),
										" · ",
										currentDate
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									disabled: loggedInToday.length === 0,
									onClick: () => window.print(),
									children: "Print logged-in list"
								})]
							})]
						}), visibleToday.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "No check-ins on this date in this view."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[32rem] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-xs uppercase tracking-wider text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Student"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Section"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "In/Out"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "How"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Result"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visibleToday.map((row) => {
									const student = students.find((s) => s.id === row.studentId);
									const genderLabelText = student?.gender ? genderLabel(student.gender) : "Gender unset";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-line",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 tabular-nums",
												children: new Date(row.createdAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: student?.name ?? "—"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted",
													children: genderLabelText
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5",
												children: student ? `G${student.grade} ${student.section}` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 capitalize",
												children: row.direction
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5",
												children: row.method
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })
											})
										]
									}, row.id);
								}) })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "print-attendance",
						"aria-label": "Printable logged-in student list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: school.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Students Logged In" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								sectionLabel(sections.find((section) => section.id === activeLogSectionId) ?? {
									grade: "",
									name: "Section"
								}),
								" · ",
								currentDate
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Total checked in: ", loggedInToday.length] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "#" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student name" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Gender" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Check-in time" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loggedInToday.map(({ event, student }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: index + 1 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: student?.name ?? "Removed student" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: student?.gender ? genderLabel(student.gender) : "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: student?.code ?? "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: new Date(event.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								}) })
							] }, event.id)) })] })
						]
					})] }) : null,
					officeSearch.view === "roster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl bg-paper p-5 shadow-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Add student"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid gap-3",
								onSubmit: onAddStudent,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "name",
										label: "Name",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs uppercase tracking-wider text-muted",
										children: ["Section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPicker, {
											sections,
											value: addSectionId,
											onChange: setAddSectionId
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs uppercase tracking-wider text-muted",
										children: ["Gender", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											name: "gender",
											required: true,
											defaultValue: "male",
											className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "male",
												children: "Male"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "female",
												children: "Female"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "pin",
										label: "PIN",
										placeholder: "Leave blank to auto-assign"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs uppercase tracking-wider text-muted",
										children: ["Parent", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											name: "parentId",
											className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "None yet"
											}), parents.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: p.id,
												children: [
													p.name,
													" (",
													p.email,
													")"
												]
											}, p.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										children: "Save student"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl bg-paper p-5 shadow-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Add parent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid gap-3",
								onSubmit: onAddParent,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "pname",
										label: "Name",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "email",
										label: "Email",
										type: "email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "phone",
										label: "Mobile",
										placeholder: "0917…"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "ppass",
										label: "Password",
										type: "password",
										placeholder: "At least 6 characters, or leave blank"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										variant: "outline",
										children: "Save parent"
									})
								]
							})]
						})]
					}) : null,
					officeSearch.view === "roster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-end justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl font-semibold",
											children: "Roster by Section"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: "Choose a section to show only its students."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: "PINs and face data are hidden from the roster view. Share a student PIN privately, and enroll faces only with consent."
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [sections.length, " sections"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
									children: orderedSections.map((section) => {
										const count = studentsInSection(students, section.id).length;
										const selected = activeRosterSectionId === section.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"aria-pressed": selected,
											onClick: () => setRosterSectionId(section.id),
											className: `min-h-14 rounded-xl px-3 py-2 text-left text-sm transition-colors ${selected ? "bg-primary text-primary-fg" : "bg-canvas/80 text-ink hover:bg-sky-soft/60"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block font-medium",
												children: [
													"Grade ",
													section.grade,
													" · ",
													section.name
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `text-xs ${selected ? "text-primary-fg/80" : "text-muted"}`,
												children: [
													count,
													" student",
													count === 1 ? "" : "s",
													section.adviser ? ` · ${section.adviser}` : ""
												]
											})]
										}, section.id);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-semibold",
										children: activeRosterSection ? `Roster — ${sectionLabel(activeRosterSection)}` : "Roster"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-muted",
										children: [
											"Showing ",
											searchedStudents.length,
											" of ",
											rosterStudents.length,
											" student",
											rosterStudents.length === 1 ? "" : "s",
											" in this section."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: "Section, parent, and face enrollment are permanent after enrollment."
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "w-full text-xs uppercase tracking-wider text-muted sm:max-w-sm",
									children: ["Search Student", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "search",
										value: rosterQuery,
										onChange: (event) => setRosterQuery(event.target.value),
										placeholder: "Name, student code, grade, or section",
										className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm normal-case tracking-normal text-ink outline-none ring-primary placeholder:text-muted/80 focus:ring-2"
									})]
								})]
							}),
							searchedStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: rosterStudents.length === 0 ? activeRosterSectionId ? "No students are assigned to this section yet." : "Create a section to view its roster." : `No students match “${rosterQuery.trim()}”.`
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-4 lg:grid-cols-2",
								children: rosterGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-line bg-canvas/40 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between border-b border-line pb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold uppercase tracking-wider text-muted",
											children: group.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-canvas px-2 py-0.5 text-xs text-muted",
											children: group.students.length
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y divide-line",
										children: group.students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block text-xs text-muted",
												children: [
													"Grade ",
													s.grade,
													" ",
													s.section,
													" · ",
													s.code,
													" · parent linked: ",
													s.parentId ? "yes" : "no"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													s.gender ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-sky-soft px-2.5 py-1 text-xs font-semibold text-primary",
														children: genderLabel(s.gender)
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "flex items-center gap-2 rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Set gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
															value: "",
															"aria-label": `Set gender for ${s.name}`,
															className: "bg-transparent text-xs text-ink outline-none",
															onChange: (event) => {
																const next = event.target.value;
																if (next === "male" || next === "female") {
																	const result = setStudentGender(s.id, next);
																	if ("error" in result) setNotice(result.error);
																}
															},
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "",
																	children: "Select"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "male",
																	children: "Male"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "female",
																	children: "Female"
																})
															]
														})]
													}),
													s.descriptors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "outline",
														className: "min-h-10 text-xs",
														onClick: () => setEnrollId(s.id),
														children: "Enroll face"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok",
														children: "Face enrolled"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														className: "min-h-10 text-xs",
														onClick: () => removeStudent(s.id),
														children: "Remove"
													})
												]
											})]
										}, s.id))
									})]
								}, group.key))
							}),
							enrollId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 max-w-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-sm text-muted",
										children: "Capture 3–5 samples in different light. Written permission first."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceCapture, {
										variant: "paper",
										onCapture: (descriptor) => {
											const result = enrollFace(enrollId, descriptor);
											if ("error" in result) setNotice(result.error);
											else setNotice(`Saved face sample (${result.count} total).`);
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "mt-2",
										onClick: () => setEnrollId(null),
										children: "Close camera"
									})
								]
							}) : null
						]
					}) : null,
					officeSearch.view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Automatic Parent Alerts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Choose which attendance events trigger a parent alert. Delivery credentials are stored on the server, not in this browser."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								onSubmit: onNotify,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
										className: "grid gap-2 rounded-2xl border p-4 sm:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
												className: "px-1 text-xs font-semibold uppercase tracking-wider text-muted",
												children: "Notify Parents"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													name: "notifyCheckIn",
													defaultChecked: school.notify?.checkIn ?? true
												}), " Student checks in (on time or late)"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													name: "notifyCheckOut",
													defaultChecked: school.notify?.checkOut ?? false
												}), " Student checks out"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													name: "notifyAbsence",
													defaultChecked: school.notify?.absence ?? false
												}), " Student is marked absent"]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-xl bg-canvas p-3 text-sm text-muted sm:col-span-2",
										children: "Email and SMS service credentials are configured as private server environment variables. This app never asks for or stores those secrets in browser storage."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											children: "Save alert settings"
										})
									})
								]
							})
						]
					}) : null,
					officeSearch.view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Data and Records"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Save a backup before moving this office data to another device."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: exportBackup,
										children: "Save backup"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => fileRef.current?.click(),
										children: "Restore backup"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "danger",
										onClick: () => {
											if (confirm("Clear students, parents, and attendance on this laptop? The office password stays.")) {
												clearRecords();
												setNotice("Records cleared.");
											}
										},
										children: "Clear records"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "application/json",
										className: "hidden",
										onChange: (event) => {
											onImportFile(event.target.files?.[0]);
											event.currentTarget.value = "";
										}
									})
								]
							})
						]
					}) : null,
					officeSearch.view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Class Hours"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 grid gap-3 sm:grid-cols-2",
							onSubmit: onHours,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "schoolName",
									label: "School name",
									defaultValue: school.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "campus",
									label: "Campus",
									defaultValue: school.campus
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "arrivalStart",
									label: "Arrival start",
									type: "time",
									defaultValue: school.arrivalStart
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "arrivalEnd",
									label: "Arrival end",
									type: "time",
									defaultValue: school.arrivalEnd
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "absentCutoff",
									label: "No-arrival cutoff",
									type: "time",
									defaultValue: school.absentCutoff
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "dismissStart",
									label: "Dismissal",
									type: "time",
									defaultValue: school.dismissStart
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										variant: "outline",
										children: "Save hours"
									})
								})
							]
						})]
					}) : null,
					officeSearch.view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Alerts Sent to Parents"
						}), alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Alerts appear after a gate scan or a missing-arrival mark."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid gap-3",
							children: alerts.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-2xl bg-canvas px-4 py-3 text-sm",
								children: [
									a.text,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-muted",
										children: new Date(a.createdAt).toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block text-xs text-muted",
										children: [
											"Email: ",
											a.emailStatus,
											a.emailDetail ? ` — ${a.emailDetail}` : "",
											" · SMS: ",
											a.smsStatus,
											a.smsDetail ? ` — ${a.smsDetail}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: a.emailStatus === "sent" && a.smsStatus === "sent" || a.emailStatus === "sending" || a.smsStatus === "sending",
										className: "mt-2 text-xs font-medium text-primary",
										onClick: () => void pushNotice(a.id),
										children: "Retry undelivered channels"
									})
								]
							}, a.id))
						})]
					}) : null
				]
			})
		]
	});
}
function SectionRosterBoard({ sections, students, attendance, date, onDateChange }) {
	const [openSections, setOpenSections] = (0, import_react.useState)({});
	const [historyEnd, setHistoryEnd] = (0, import_react.useState)(todayISO());
	const [historyStart, setHistoryStart] = (0, import_react.useState)(() => {
		const start = /* @__PURE__ */ new Date();
		start.setDate(start.getDate() - 6);
		return todayISO(start);
	});
	const [historySectionId, setHistorySectionId] = (0, import_react.useState)(sections[0]?.id ?? "");
	const dayEvents = attendance.filter((event) => event.date === date);
	const historyEvents = attendance.filter((event) => event.date >= historyStart && event.date <= historyEnd).filter((event) => {
		if (!historySectionId) return false;
		return students.find((item) => item.id === event.studentId)?.sectionId === historySectionId;
	}).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
	function exportHistory() {
		const header = [
			"Date",
			"Time",
			"Student",
			"Code",
			"Grade",
			"Section",
			"Direction",
			"Method",
			"Result"
		];
		const rows = historyEvents.map((event) => {
			const student = students.find((item) => item.id === event.studentId);
			return [
				event.date,
				new Date(event.createdAt).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				student?.name ?? "Removed student",
				student?.code ?? "",
				student?.grade ?? "",
				student?.section ?? "",
				event.direction,
				event.method,
				STATUS_LABEL[event.status]
			].map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(",");
		});
		downloadText(`scn-attendance-history-${historyStart}-to-${historyEnd}.csv`, [header.join(","), ...rows].join("\n"), "text/csv;charset=utf-8");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-wrap items-end justify-between gap-3 rounded-3xl bg-paper p-5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Attendance History by Section"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Choose a date to inspect each section’s recorded attendance. Click \"View attendance\" to see the students and their status for that date."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs uppercase tracking-wider text-muted",
					children: ["Attendance date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: date,
						onChange: (event) => onDateChange(event.target.value),
						className: "mt-1 min-h-11 rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
					})]
				})]
			}),
			sections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-3xl bg-paper p-6 text-sm text-muted shadow-border",
				children: "No sections yet. Create one in the Rosters tab to get started."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: sections.map((section) => {
					const roster = studentsInSection(students, section.id);
					const sectionAttendance = roster.map((student) => {
						const events = dayEvents.filter((event) => event.studentId === student.id);
						return {
							student,
							hasArrived: events.some((event) => event.direction === "in"),
							hasAbsence: events.some((event) => event.status === "absent")
						};
					});
					const presentCount = sectionAttendance.filter((item) => item.hasArrived).length;
					const absentCount = sectionAttendance.filter((item) => !item.hasArrived && item.hasAbsence).length;
					const notCheckedInCount = roster.length - presentCount - absentCount;
					const maleCount = roster.filter((student) => student.gender === "male").length;
					const femaleCount = roster.filter((student) => student.gender === "female").length;
					const groupedAttendance = groupRosterByGender(sortRosterStudents(roster, "name"));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "overflow-hidden rounded-3xl bg-paper shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
								className: "border-b border-line bg-canvas/70 px-4 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs uppercase tracking-wider text-muted",
											children: ["Grade ", section.grade]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-semibold",
											children: section.name
										}),
										section.adviser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: section.adviser
										}) : null
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-paper px-2.5 py-1 text-xs text-muted",
										children: [
											presentCount,
											"/",
											roster.length,
											" present"
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 px-4 pt-4",
								"aria-label": `Attendance summary for Grade ${section.grade} ${section.name}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionAttendanceStat, {
										label: "Present",
										value: presentCount,
										tone: "text-ok"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionAttendanceStat, {
										label: "Absent marked",
										value: absentCount,
										tone: "text-rose"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionAttendanceStat, {
										label: "Not checked in",
										value: notCheckedInCount,
										tone: "text-muted"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2 px-4 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-sky-soft/70 px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted",
										children: "Male"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-semibold text-primary",
										children: maleCount
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-canvas px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted",
										children: "Female"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-semibold text-primary",
										children: femaleCount
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "w-full",
									"aria-expanded": Boolean(openSections[section.id]),
									onClick: () => setOpenSections((current) => ({
										...current,
										[section.id]: !current[section.id]
									})),
									children: openSections[section.id] ? "Hide attendance" : "View attendance"
								})
							}),
							openSections[section.id] ? roster.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-t border-line px-4 py-4 text-sm text-muted",
								children: "No students assigned to this section yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-line px-4 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: groupedAttendance.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-canvas/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-2 flex items-center justify-between border-b border-line pb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-[10px] font-semibold uppercase tracking-wider text-muted",
												children: group.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-canvas px-2 py-0.5 text-[10px] text-muted",
												children: group.students.length
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "divide-y divide-line",
											children: group.students.map((student) => {
												const events = dayEvents.filter((event) => event.studentId === student.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
												const checkedInEvent = events.find((event) => event.direction === "in");
												const absentEvent = events.find((event) => event.status === "absent");
												const latestEvent = events[0];
												const status = checkedInEvent ? latestEvent?.direction === "out" ? "Checked out" : "Checked in" : absentEvent ? "Absent recorded" : "Not checked in";
												const tone = checkedInEvent ? "bg-ok-soft text-ok" : absentEvent ? "bg-rose-soft text-rose" : "bg-canvas text-muted";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center justify-between gap-2 py-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "block text-sm font-medium",
															children: student.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-xs text-muted",
															children: [student.gender ? `${genderLabel(student.gender)} · ` : "", student.code]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`,
														children: status
													})]
												}, student.id);
											})
										})]
									}, group.key))
								})
							}) : null
						]
					}, section.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-paper p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Attendance history"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Review recorded check-ins, check-outs, and absences by date and section."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: historyEvents.length === 0,
							onClick: exportHistory,
							children: "Export filtered history"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: historyStart,
									max: historyEnd,
									onChange: (event) => {
										const nextStart = event.target.value;
										setHistoryStart(nextStart);
										if (nextStart > historyEnd) setHistoryEnd(nextStart);
									},
									className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: historyEnd,
									min: historyStart,
									max: todayISO(),
									onChange: (event) => {
										const nextEnd = event.target.value;
										setHistoryEnd(nextEnd);
										if (nextEnd < historyStart) setHistoryStart(nextEnd);
									},
									className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: ["Section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPicker, {
									sections,
									value: historySectionId,
									onChange: setHistorySectionId
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: historySectionId ? `${historyEvents.length} attendance record${historyEvents.length === 1 ? "" : "s"} · ${historyStart} to ${historyEnd}` : "Choose a section to view its attendance history."
					}),
					historyEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-2xl bg-canvas/70 px-4 py-4 text-sm text-muted",
						children: historySectionId ? "No attendance records match this date range for the selected section." : sections.length ? "Select a section above to see its attendance records." : "Create a section to start viewing attendance history."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[38rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-xs uppercase tracking-wider text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Date / time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Student"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Section"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Event"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Result"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: historyEvents.map((event) => {
								const student = students.find((item) => item.id === event.studentId);
								const genderText = student?.gender ? genderLabel(student.gender) : "Gender unset";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 tabular-nums",
											children: [
												event.date,
												" · ",
												new Date(event.createdAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: student?.name ?? "Removed student"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted",
												children: genderText
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5",
											children: student ? `Grade ${student.grade} ${student.section}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 capitalize",
											children: [
												event.direction === "none" ? "absence" : event.direction,
												" · ",
												event.method
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: event.status })
										})
									]
								}, event.id);
							}) })]
						})
					})
				]
			})
		]
	});
}
function SectionAttendanceStat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 rounded-xl bg-canvas/80 px-2 py-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `font-display text-xl font-semibold tabular-nums ${tone}`,
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] leading-tight text-muted sm:text-xs",
			children: label
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-paper px-4 py-4 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wider text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl font-semibold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { OfficePage as component };
