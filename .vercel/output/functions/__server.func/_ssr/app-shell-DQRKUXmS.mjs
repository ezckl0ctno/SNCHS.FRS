import { o as __toESM } from "../_runtime.mjs";
import { L as string, P as object, k as boolean, z as unknown } from "../_libs/@better-auth/core+[...].mjs";
import { C as require_jsx_runtime, X as require_react, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DHelvfso.mjs";
import { a as House, c as Bell, i as Landmark, o as GraduationCap, s as DoorOpen } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-DQRKUXmS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function subscribe() {
	return () => {};
}
function ClientReady({ children }) {
	if (!(0, import_react.useSyncExternalStore)(subscribe, () => true, () => false)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl bg-paper px-5 py-8 text-muted shadow-border",
		children: "Opening the gate desk…"
	});
	return children;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4", {
	variants: { variant: {
		primary: "bg-navy text-primary-fg hover:bg-navy-dark",
		ink: "bg-ink text-paper hover:bg-ink/90",
		ghost: "bg-transparent text-ink hover:bg-sky-soft",
		outline: "bg-paper text-ink shadow-border hover:shadow-border-hover",
		sky: "bg-sky text-accent-ink hover:bg-sky-dark hover:text-paper",
		danger: "bg-rose-soft text-rose hover:bg-rose-soft/80"
	} },
	defaultVariants: { variant: "primary" }
});
var Button = (0, import_react.forwardRef)(({ className, variant, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({ variant }), className),
	...props
}));
Button.displayName = "Button";
async function hashSecret(secret) {
	const data = new TextEncoder().encode(secret);
	const buf = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var loading = null;
function loadFaceEngine() {
	if (typeof window === "undefined") return Promise.reject(/* @__PURE__ */ new Error("No camera here."));
	if (window.faceapi?.nets) return loading ?? (loading = loadModels());
	if (loading) return loading;
	loading = new Promise((resolve, reject) => {
		const existing = document.querySelector("script[data-face-api=\"1\"]");
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () => reject(/* @__PURE__ */ new Error("Face engine failed to load.")));
			return;
		}
		const script = document.createElement("script");
		script.src = "/vendor/face-api.min.js";
		script.async = true;
		script.dataset.faceApi = "1";
		script.onload = () => resolve();
		script.onerror = () => reject(/* @__PURE__ */ new Error("Face engine failed to load."));
		document.head.appendChild(script);
	}).then(loadModels);
	return loading;
}
async function loadModels() {
	const api = window.faceapi;
	if (!api) throw new Error("Face engine missing.");
	const url = "/models";
	await Promise.all([
		api.nets.tinyFaceDetector.loadFromUri(url),
		api.nets.faceLandmark68Net.loadFromUri(url),
		api.nets.faceRecognitionNet.loadFromUri(url)
	]);
}
async function descriptorFromVideo(video) {
	await loadFaceEngine();
	const api = window.faceapi;
	if (!api) return null;
	const det = await api.detectSingleFace(video, new api.TinyFaceDetectorOptions({
		inputSize: 224,
		scoreThreshold: .5
	})).withFaceLandmarks().withFaceDescriptor();
	if (!det) return null;
	return Array.from(det.descriptor);
}
function distance(a, b) {
	if (a.length !== b.length) return 999;
	let sum = 0;
	for (let i = 0; i < a.length; i++) {
		const d = a[i] - b[i];
		sum += d * d;
	}
	return Math.sqrt(sum);
}
function matchFace(students, descriptor, threshold = .5) {
	let best = null;
	let bestDist = threshold;
	for (const student of students) for (const stored of student.descriptors) {
		const dist = distance(stored, descriptor);
		if (dist < bestDist) {
			bestDist = dist;
			best = student;
		}
	}
	return best ? {
		student: best,
		distance: bestDist
	} : null;
}
/** Roster gender order: male block first, then female, then unassigned last. */
var GENDERS = ["male", "female"];
var GENDER_LABEL = {
	male: "Male",
	female: "Female"
};
var UNASSIGNED_GENDER_LABEL = "Gender not set";
GENDER_LABEL.male, GENDER_LABEL.female;
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var GENDER_RANK = {
	male: 0,
	female: 1
};
var GENDER_ALIASES = {
	male: [
		"male",
		"m",
		"boy",
		"lalaki"
	],
	female: [
		"female",
		"f",
		"girl",
		"babae"
	]
};
/** Reads a gender from CSV text or stored data. Unknown values become null. */
function parseGender(value) {
	if (value === null || value === void 0) return null;
	const key = String(value).trim().toLowerCase();
	if (!key) return null;
	if (GENDER_ALIASES.male.includes(key)) return "male";
	if (GENDER_ALIASES.female.includes(key)) return "female";
	return null;
}
function genderLabel(gender) {
	return gender ? GENDER_LABEL[gender] : UNASSIGNED_GENDER_LABEL;
}
function genderRank(gender) {
	return gender ? GENDER_RANK[gender] : GENDERS.length;
}
function nameTokens(name) {
	return name.trim().split(/\s+/).filter(Boolean);
}
function sortKey(name, mode) {
	const tokens = nameTokens(name);
	if (mode === "surname" && tokens.length > 1) return `${tokens[tokens.length - 1]} ${tokens.slice(0, -1).join(" ")}`;
	return tokens.join(" ");
}
function compareText(a, b) {
	return a.localeCompare(b, "en", {
		sensitivity: "base",
		numeric: true
	});
}
/**
* Gender block first, then alphabetical order inside the block. Ties fall back
* to the student code so the order never changes between renders.
*/
function compareRosterStudents(a, b, mode) {
	const byGender = genderRank(a.gender) - genderRank(b.gender);
	if (byGender !== 0) return byGender;
	const byName = compareText(sortKey(a.name, mode), sortKey(b.name, mode));
	if (byName !== 0) return byName;
	return compareText(a.code, b.code);
}
function sortRosterStudents(students, mode = "name") {
	return [...students].sort((a, b) => compareRosterStudents(a, b, mode));
}
/** Splits a section roster into gender blocks, each in alphabetical order. */
function groupRosterByGender(students, mode = "name") {
	const sorted = sortRosterStudents(students, mode);
	const groups = [];
	for (const gender of [...GENDERS, null]) {
		const block = sorted.filter((student) => student.gender === gender);
		if (block.length === 0) continue;
		groups.push({
			key: gender ?? "unassigned",
			gender,
			label: genderLabel(gender),
			students: block
		});
	}
	return groups;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SaveInput = object({ state: unknown() });
function sharedSchoolSnapshot(state) {
	return {
		school: {
			...state.school,
			notify: {
				checkIn: state.school.notify?.checkIn ?? true,
				checkOut: state.school.notify?.checkOut ?? false,
				absence: state.school.notify?.absence ?? false
			}
		},
		sections: state.sections,
		students: state.students.map((student) => ({
			...student,
			descriptors: []
		})),
		parents: state.parents,
		attendance: state.attendance,
		alerts: state.alerts
	};
}
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ab561e1e8d886af19331e2b312c2087c505291cd9af6eacb116e13b4415bd61b"));
var saveSharedSchoolState = createServerFn({ method: "POST" }).validator((input) => SaveInput.parse(input)).middleware([authMiddleware]).handler(createSsrRpc("504039b5abbd38d15822f29f46538b9446d5c16912edd21925f08a4211b58eff"));
var DeliveryInput = object({
	alertId: string().min(1).max(100),
	sendEmail: boolean(),
	sendSms: boolean()
});
var sendSchoolNotice = createServerFn({ method: "POST" }).validator((input) => DeliveryInput.parse(input)).middleware([authMiddleware]).handler(createSsrRpc("c649b689ffd9a0d4dcbd0f4de5d9c3ac13725ec86d354ab9181d45cb7aae5728"));
var emptyNotify = () => ({
	checkIn: true,
	checkOut: false,
	absence: false
});
function seedState() {
	return {
		school: {
			name: "Sta Catalina National High School",
			campus: "Sta. Catalina",
			arrivalStart: "07:30",
			arrivalEnd: "08:10",
			absentCutoff: "08:30",
			dismissStart: "16:00",
			notify: emptyNotify()
		},
		officePasswordHash: null,
		sections: [],
		parents: [],
		students: [],
		attendance: [],
		alerts: [],
		session: { role: "none" }
	};
}
function sectionKey(grade, name) {
	return `${grade.trim().toLowerCase()}::${name.trim().toLowerCase()}`;
}
function sectionLabel(section) {
	return `Grade ${section.grade} — ${section.name}`;
}
function findSection(sections, grade, name) {
	const key = sectionKey(grade, name);
	return sections.find((s) => sectionKey(s.grade, s.name) === key) ?? null;
}
function studentsInSection(students, sectionId) {
	return students.filter((s) => s.sectionId === sectionId);
}
function sortSections(sections) {
	return [...sections].sort((a, b) => {
		const ga = Number(a.grade);
		const gb = Number(b.grade);
		if (!Number.isNaN(ga) && !Number.isNaN(gb) && ga !== gb) return ga - gb;
		if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
		return a.name.localeCompare(b.name);
	});
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function todayISO(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function minutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}
function isBeforeDismissal(school, date = /* @__PURE__ */ new Date()) {
	return date.getHours() * 60 + date.getMinutes() < minutes(school.dismissStart);
}
function attendanceCycleStart(school, date = /* @__PURE__ */ new Date()) {
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	const dismissal = minutes(school.dismissStart);
	if (!isBeforeDismissal(school, date)) start.setHours(Math.floor(dismissal / 60), dismissal % 60, 0, 0);
	return start;
}
function currentAttendanceEvents(events, school, date = /* @__PURE__ */ new Date()) {
	const cycleStart = attendanceCycleStart(school, date);
	const day = todayISO(date);
	return events.filter((event) => event.date === day && new Date(event.createdAt).getTime() >= cycleStart.getTime());
}
function classifyIn(school, date = /* @__PURE__ */ new Date()) {
	if (date.getHours() * 60 + date.getMinutes() <= minutes(school.arrivalEnd)) return "on_time";
	return "late";
}
function classifyOut(school, date = /* @__PURE__ */ new Date()) {
	if (date.getHours() * 60 + date.getMinutes() < minutes(school.dismissStart)) return "early_exit";
	return "dismissed";
}
var STATUS_LABEL = {
	on_time: "Arrived on time",
	late: "Arrived late",
	early_exit: "Left early",
	dismissed: "Dismissed",
	absent: "No arrival"
};
function parentMessage(school, studentName, status, when) {
	const time = when.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
	const date = when.toLocaleDateString();
	switch (status) {
		case "on_time": return `${studentName} checked in at the school gate at ${time} on ${date}.`;
		case "late": return `${studentName} checked in late at the school gate at ${time} on ${date}.`;
		case "early_exit": return `${studentName} checked out before dismissal at ${time} on ${date}. Please confirm with the office if this was expected.`;
		case "dismissed": return `${studentName} checked out at ${time} on ${date}.`;
		case "absent": return `${studentName} had no gate check-in by ${school.absentCutoff} on ${date}. Please contact the school office.`;
	}
}
function uid() {
	return crypto.randomUUID();
}
function normalizeStudentCode(code) {
	return code.trim().replace(/^STU-(\d+)$/i, "STUDENTS-$1").toUpperCase();
}
function nextStudentNumber(students) {
	const nums = students.map((s) => Number(s.code.replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
	return (nums.length ? Math.max(...nums) : 1e3) + 1;
}
function blankAlert() {
	return {
		emailStatus: "idle",
		smsStatus: "idle",
		emailDetail: "",
		smsDetail: ""
	};
}
function hydrateStudent(raw, sections) {
	const grade = String(raw.grade ?? "").trim() || "10";
	const sectionName = String(raw.section ?? "").trim() || "Rizal";
	const matched = raw.sectionId && sections.find((s) => s.id === raw.sectionId) || findSection(sections, grade, sectionName);
	return {
		id: raw.id || uid(),
		name: raw.name || "",
		grade: matched?.grade ?? grade,
		section: matched?.name ?? sectionName,
		sectionId: matched?.id ?? "",
		code: normalizeStudentCode(raw.code || ""),
		pin: raw.pin || "",
		parentId: raw.parentId ?? null,
		gender: parseGender(raw.gender),
		descriptors: Array.isArray(raw.descriptors) ? raw.descriptors : []
	};
}
function hydrateSections(saved, students) {
	const map = /* @__PURE__ */ new Map();
	for (const s of saved ?? []) {
		if (!s?.grade || !s?.name) continue;
		map.set(sectionKey(s.grade, s.name), {
			id: s.id || uid(),
			grade: String(s.grade).trim(),
			name: String(s.name).trim(),
			adviser: s.adviser ?? ""
		});
	}
	for (const student of students) {
		const grade = String(student.grade ?? "").trim();
		const name = String(student.section ?? "").trim();
		if (!grade || !name) continue;
		const key = sectionKey(grade, name);
		if (!map.has(key)) map.set(key, {
			id: uid(),
			grade,
			name,
			adviser: ""
		});
	}
	return sortSections([...map.values()]);
}
function buildStudent(students, section, input) {
	const n = nextStudentNumber(students);
	return {
		id: uid(),
		name: input.name.trim(),
		grade: section.grade,
		section: section.name,
		sectionId: section.id,
		code: `STUDENTS-${n}`,
		pin: input.pin.trim() || String(n),
		parentId: input.parentId || null,
		gender: input.gender,
		descriptors: []
	};
}
function recordEvent(state, student, direction, status, method, when) {
	const event = {
		id: uid(),
		studentId: student.id,
		date: todayISO(when),
		direction,
		status,
		method,
		createdAt: when.toISOString()
	};
	const alerts = [...state.alerts];
	let alert = null;
	const notify = state.school.notify ?? emptyNotify();
	const shouldNotify = direction === "in" ? notify.checkIn ?? true : direction === "out" ? notify.checkOut ?? false : notify.absence ?? false;
	if (student.parentId && shouldNotify) {
		alert = {
			id: uid(),
			studentId: student.id,
			parentId: student.parentId,
			status,
			text: parentMessage(state.school, student.name, status, when),
			createdAt: when.toISOString(),
			...blankAlert()
		};
		alerts.unshift(alert);
	}
	return {
		event,
		alert,
		attendance: [event, ...state.attendance],
		alerts
	};
}
var useSchool = create()(persist((set, get) => ({
	...seedState(),
	setupOffice: async (password) => {
		if (password.trim().length < 6) return {
			ok: false,
			error: "Use at least 6 characters for the office password."
		};
		if (get().officePasswordHash) return {
			ok: false,
			error: "Office password is already set. Sign in instead."
		};
		set({
			officePasswordHash: await hashSecret(password.trim()),
			session: { role: "office" }
		});
		return { ok: true };
	},
	signInOffice: async (password) => {
		const hash = get().officePasswordHash;
		if (!hash) return {
			ok: false,
			error: "Create the office password first."
		};
		if (await hashSecret(password.trim()) !== hash) return {
			ok: false,
			error: "That office password is not correct."
		};
		set({ session: { role: "office" } });
		return { ok: true };
	},
	signInParent: async (email, password) => {
		const parent = get().parents.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
		if (!parent || !parent.email) return {
			ok: false,
			error: "No parent account uses that email."
		};
		if (await hashSecret(password) !== parent.passwordHash) return {
			ok: false,
			error: "Email or password is not correct."
		};
		set({ session: {
			role: "parent",
			parentId: parent.id
		} });
		return { ok: true };
	},
	signInStudent: async (sectionId, code, pin) => {
		const state = get();
		const section = state.sections.find((s) => s.id === sectionId);
		if (!section) return {
			ok: false,
			error: "Choose your section first."
		};
		const needle = normalizeStudentCode(code);
		const pinTrim = pin.trim();
		const byCode = state.students.find((s) => normalizeStudentCode(s.code) === needle);
		if (!byCode) return {
			ok: false,
			error: "Student code or PIN did not match."
		};
		if (byCode.pin !== pinTrim) return {
			ok: false,
			error: "Student code or PIN did not match."
		};
		if (byCode.sectionId !== section.id) return {
			ok: false,
			error: `${byCode.name} is enrolled in Grade ${byCode.grade} — ${byCode.section}. Choose that section to sign in.`
		};
		set({ session: {
			role: "student",
			studentId: byCode.id
		} });
		return { ok: true };
	},
	signOut: () => set({ session: { role: "none" } }),
	updateHours: (hours) => {
		set({ school: {
			...get().school,
			...hours
		} });
	},
	updateNotify: (notify) => {
		set({ school: {
			...get().school,
			notify: {
				...get().school.notify,
				...notify
			}
		} });
	},
	addSection: ({ grade, name, adviser }) => {
		const g = grade.trim();
		const n = name.trim();
		if (!g || !n) return { error: "Grade and section name are required." };
		const state = get();
		if (findSection(state.sections, g, n)) return { error: `Grade ${g} — ${n} already exists.` };
		const section = {
			id: uid(),
			grade: g,
			name: n,
			adviser: adviser.trim()
		};
		set({ sections: sortSections([...state.sections, section]) });
		return section;
	},
	updateSection: (id, patch) => {
		const state = get();
		const current = state.sections.find((s) => s.id === id);
		if (!current) return { error: "Section not found." };
		const next = {
			...current,
			grade: (patch.grade ?? current.grade).trim(),
			name: (patch.name ?? current.name).trim(),
			adviser: (patch.adviser ?? current.adviser).trim()
		};
		if (!next.grade || !next.name) return { error: "Grade and section name are required." };
		const clash = findSection(state.sections, next.grade, next.name);
		if (clash && clash.id !== id) return { error: `Grade ${next.grade} — ${next.name} already exists.` };
		set({
			sections: sortSections(state.sections.map((s) => s.id === id ? next : s)),
			students: state.students.map((s) => s.sectionId === id ? {
				...s,
				grade: next.grade,
				section: next.name
			} : s)
		});
		return { ok: true };
	},
	removeSection: (id) => {
		const enrolled = get().students.filter((s) => s.sectionId === id).length;
		if (enrolled) return { error: `Move or remove ${enrolled} student${enrolled === 1 ? "" : "s"} first.` };
		set({ sections: get().sections.filter((s) => s.id !== id) });
		return { ok: true };
	},
	checkPin: (sectionId, code, pin, direction) => {
		const state = get();
		const section = state.sections.find((s) => s.id === sectionId);
		if (!section) return {
			ok: false,
			error: "Choose the student’s section first."
		};
		const student = state.students.find((s) => normalizeStudentCode(s.code) === normalizeStudentCode(code) && s.pin === pin.trim());
		if (!student) return {
			ok: false,
			error: "Student code or PIN did not match."
		};
		if (student.sectionId !== section.id) return {
			ok: false,
			error: `${student.name} belongs to Grade ${student.grade} — ${student.section}. Open that section at the gate.`
		};
		const when = /* @__PURE__ */ new Date();
		const recorded = recordEvent(state, student, direction, direction === "in" ? classifyIn(state.school, when) : classifyOut(state.school, when), "pin", when);
		set({
			attendance: recorded.attendance,
			alerts: recorded.alerts
		});
		if (recorded.alert) get().pushNotice(recorded.alert.id);
		return {
			ok: true,
			student,
			event: recorded.event
		};
	},
	checkFace: (descriptor, direction) => {
		const state = get();
		const hit = matchFace(state.students, descriptor);
		if (!hit) return {
			ok: false,
			error: "No enrolled face matched. Ask the office to enroll the student’s face, then try again."
		};
		const when = /* @__PURE__ */ new Date();
		const status = direction === "in" ? classifyIn(state.school, when) : classifyOut(state.school, when);
		const recorded = recordEvent(state, hit.student, direction, status, "face", when);
		set({
			attendance: recorded.attendance,
			alerts: recorded.alerts
		});
		if (recorded.alert) get().pushNotice(recorded.alert.id);
		return {
			ok: true,
			student: hit.student,
			event: recorded.event
		};
	},
	recognizeFace: (descriptor) => {
		const hit = matchFace(get().students, descriptor);
		return hit ? {
			ok: true,
			student: hit.student
		} : {
			ok: false,
			error: "No enrolled face matched yet."
		};
	},
	autoCheckFace: (descriptor) => {
		const state = get();
		const hit = matchFace(state.students, descriptor);
		if (!hit) return {
			ok: false,
			error: "No enrolled face matched yet."
		};
		const studentEvents = currentAttendanceEvents(state.attendance.filter((event) => event.studentId === hit.student.id), state.school);
		const hasIn = studentEvents.some((event) => event.direction === "in");
		const hasAbsence = studentEvents.some((event) => event.status === "absent");
		const latestEvent = [...studentEvents].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
		if (latestEvent && Date.now() - new Date(latestEvent.createdAt).getTime() < 3e4) return {
			ok: false,
			error: `${hit.student.name} was just recorded. Please wait before scanning again.`
		};
		if (hasIn || hasAbsence) return {
			ok: false,
			error: `${hit.student.name} already has an attendance record today.`
		};
		const direction = "in";
		const when = /* @__PURE__ */ new Date();
		const status = classifyIn(state.school, when);
		const recorded = recordEvent(state, hit.student, direction, status, "face", when);
		set({
			attendance: recorded.attendance,
			alerts: recorded.alerts
		});
		if (recorded.alert) get().pushNotice(recorded.alert.id);
		return {
			ok: true,
			student: hit.student,
			event: recorded.event
		};
	},
	markAbsences: async (sectionId) => {
		const state = get();
		const day = todayISO();
		const when = /* @__PURE__ */ new Date();
		let next = state;
		const queued = [];
		let created = 0;
		const pool = sectionId ? state.students.filter((s) => s.sectionId === sectionId) : state.students;
		for (const student of pool) {
			const hasIn = next.attendance.some((a) => a.studentId === student.id && a.date === day && a.direction === "in");
			const already = next.attendance.some((a) => a.studentId === student.id && a.date === day && a.status === "absent");
			if (hasIn || already) continue;
			const recorded = recordEvent(next, student, "none", "absent", "sweep", when);
			next = {
				...next,
				attendance: recorded.attendance,
				alerts: recorded.alerts
			};
			if (recorded.alert) queued.push(recorded.alert.id);
			created += 1;
		}
		set({
			attendance: next.attendance,
			alerts: next.alerts
		});
		for (const id of queued) await get().pushNotice(id);
		return created;
	},
	addStudent: ({ name, sectionId, pin, parentId, gender }) => {
		const state = get();
		if (!name.trim()) return { error: "Student name is required." };
		if (!gender) return { error: "Choose Male or Female before saving. Gender is recorded once at enrollment and can never be changed." };
		const section = state.sections.find((s) => s.id === sectionId);
		if (!section) return { error: "Choose a section for this student." };
		const student = buildStudent(state.students, section, {
			name,
			pin,
			parentId,
			gender
		});
		set({ students: [...state.students, student] });
		return student;
	},
	setStudentGender: (studentId, gender) => {
		const state = get();
		const current = state.students.find((s) => s.id === studentId);
		if (!current) return { error: "That student is no longer on the roster." };
		if (current.gender) return { error: `${current.name} is already recorded as ${genderLabel(current.gender)}. Gender is permanent and cannot be changed.` };
		const student = {
			...current,
			gender
		};
		set({ students: state.students.map((s) => s.id === studentId ? student : s) });
		return {
			ok: true,
			student
		};
	},
	removeStudent: (id) => {
		const session = get().session;
		set({
			students: get().students.filter((s) => s.id !== id),
			session: session.role === "student" && session.studentId === id ? { role: "none" } : session
		});
	},
	moveStudent: (studentId, sectionId) => {
		const section = get().sections.find((s) => s.id === sectionId);
		if (!section) return { error: "That section does not exist." };
		set({ students: get().students.map((s) => s.id === studentId ? {
			...s,
			sectionId: section.id,
			grade: section.grade,
			section: section.name
		} : s) });
		return { ok: true };
	},
	linkParent: (studentId, parentId) => {
		set({ students: get().students.map((s) => s.id === studentId ? {
			...s,
			parentId
		} : s) });
	},
	addParent: async ({ name, email, phone, password }) => {
		if (!name.trim()) return { error: "Parent name is required." };
		if (!email.trim() && !phone.trim()) return { error: "Add an email or a mobile number." };
		const pass = password.trim() || `scn${Math.floor(1e3 + Math.random() * 9e3)}`;
		if (pass.length < 6) return { error: "Parent password needs at least 6 characters." };
		const state = get();
		const emailKey = email.trim().toLowerCase();
		if (emailKey && state.parents.some((p) => p.email && p.email.toLowerCase() === emailKey)) return { error: "That email is already in use." };
		const parent = {
			id: uid(),
			name: name.trim(),
			email: emailKey,
			phone: phone.trim(),
			passwordHash: await hashSecret(pass)
		};
		set({ parents: [...state.parents, parent] });
		return parent;
	},
	enrollFace: (studentId, descriptor) => {
		const students = get().students.map((s) => {
			if (s.id !== studentId) return s;
			const descriptors = [...s.descriptors, descriptor].slice(-8);
			return {
				...s,
				descriptors
			};
		});
		const student = students.find((s) => s.id === studentId);
		if (!student) return { error: "Student not found." };
		set({ students });
		return {
			ok: true,
			count: student.descriptors.length
		};
	},
	importClass: async (rows) => {
		if (rows.length === 0) return { error: "No students to import." };
		let added = 0;
		let parentsCreated = 0;
		let sectionsCreated = 0;
		for (const row of rows) {
			if (!row.name.trim()) continue;
			const grade = row.grade.trim() || "10";
			const name = row.section.trim() || "Rizal";
			let section = findSection(get().sections, grade, name);
			if (!section) {
				const created = get().addSection({
					grade,
					name,
					adviser: ""
				});
				if ("error" in created) return created;
				section = created;
				sectionsCreated += 1;
			}
			let parentId = null;
			if (row.parentName.trim() && (row.parentEmail.trim() || row.parentPhone.trim())) {
				const emailKey = row.parentEmail.trim().toLowerCase();
				const existing = get().parents.find((p) => emailKey && p.email === emailKey || row.parentPhone.trim() && p.phone === row.parentPhone.trim());
				if (existing) parentId = existing.id;
				else {
					const created = await get().addParent({
						name: row.parentName,
						email: row.parentEmail,
						phone: row.parentPhone,
						password: row.parentPassword
					});
					if ("error" in created) return created;
					parentId = created.id;
					parentsCreated += 1;
				}
			}
			const student = buildStudent(get().students, section, {
				name: row.name,
				pin: row.pin,
				parentId,
				gender: row.gender
			});
			set({ students: [...get().students, student] });
			added += 1;
		}
		return {
			added,
			parents: parentsCreated,
			sections: sectionsCreated
		};
	},
	pushNotice: async (alertId) => {
		const state = get();
		const alert = state.alerts.find((a) => a.id === alertId);
		if (!alert) return;
		if (alert.emailStatus === "sending" || alert.smsStatus === "sending") return;
		const sendEmail = alert.emailStatus !== "sent";
		const sendSms = alert.smsStatus !== "sent";
		if (!sendEmail && !sendSms) return;
		const parent = state.parents.find((p) => p.id === alert.parentId);
		const patch = (emailStatus, smsStatus, emailDetail, smsDetail) => {
			set({ alerts: get().alerts.map((a) => a.id === alertId ? {
				...a,
				emailStatus,
				smsStatus,
				emailDetail,
				smsDetail
			} : a) });
		};
		if (!parent) {
			patch("skipped", "skipped", "No parent linked.", "No parent linked.");
			return;
		}
		patch(sendEmail ? "sending" : alert.emailStatus, sendSms ? "sending" : alert.smsStatus, sendEmail ? "Sending…" : alert.emailDetail, sendSms ? "Sending…" : alert.smsDetail);
		try {
			await saveSharedSchoolState({ data: { state: sharedSchoolSnapshot(state) } });
			const result = await sendSchoolNotice({ data: {
				alertId,
				sendEmail,
				sendSms
			} });
			patch(sendEmail ? result.email.status : alert.emailStatus, sendSms ? result.sms.status : alert.smsStatus, sendEmail ? result.email.detail : alert.emailDetail, sendSms ? result.sms.detail : alert.smsDetail);
		} catch (error) {
			const msg = error instanceof Error ? error.message : "Send failed.";
			patch(sendEmail ? "failed" : alert.emailStatus, sendSms ? "failed" : alert.smsStatus, sendEmail ? msg : alert.emailDetail, sendSms ? msg : alert.smsDetail);
		}
	},
	clearRecords: () => {
		const hash = get().officePasswordHash;
		const notify = get().school.notify;
		set({
			...seedState(),
			officePasswordHash: hash,
			session: { role: "office" },
			school: {
				...seedState().school,
				notify
			}
		});
	},
	importBackup: (raw) => {
		if (!raw || typeof raw !== "object") return { error: "That file is not a gate backup." };
		const data = raw;
		if (!data.school || !Array.isArray(data.students) || !Array.isArray(data.parents)) return { error: "That file is missing school, students, or parents." };
		const base = seedState();
		const sections = hydrateSections(data.sections, data.students);
		set({
			school: {
				...base.school,
				...data.school,
				notify: {
					checkIn: data.school.notify?.checkIn ?? true,
					checkOut: data.school.notify?.checkOut ?? false,
					absence: data.school.notify?.absence ?? false
				}
			},
			officePasswordHash: data.officePasswordHash ?? get().officePasswordHash,
			sections,
			students: data.students.map((s) => hydrateStudent(s, sections)),
			parents: data.parents.map((p) => ({
				...p,
				phone: p.phone ?? ""
			})),
			attendance: Array.isArray(data.attendance) ? data.attendance : [],
			alerts: Array.isArray(data.alerts) ? data.alerts.map((a) => ({
				...a,
				emailStatus: a.emailStatus ?? "skipped",
				smsStatus: a.smsStatus ?? "skipped",
				emailDetail: a.emailDetail ?? "",
				smsDetail: a.smsDetail ?? ""
			})) : [],
			session: { role: "office" }
		});
		return { ok: true };
	}
}), {
	name: "scn-gate-v3",
	partialize: (s) => ({
		school: s.school,
		officePasswordHash: s.officePasswordHash,
		sections: s.sections,
		students: s.students,
		parents: s.parents,
		attendance: s.attendance,
		alerts: s.alerts,
		session: s.session
	}),
	merge: (persisted, current) => {
		const p = persisted;
		if (!p) return current;
		const sections = hydrateSections(p.sections, p.students ?? current.students);
		return {
			...current,
			...p,
			school: {
				...current.school,
				...p.school,
				notify: {
					checkIn: p.school?.notify?.checkIn ?? true,
					checkOut: p.school?.notify?.checkOut ?? false,
					absence: p.school?.notify?.absence ?? false
				}
			},
			sections,
			students: (p.students ?? current.students).map((s) => hydrateStudent(s, sections)),
			parents: (p.parents ?? current.parents).map((parent) => ({
				...parent,
				phone: parent.phone ?? ""
			})),
			alerts: (p.alerts ?? current.alerts).map((a) => ({
				...a,
				emailStatus: a.emailStatus ?? "idle",
				smsStatus: a.smsStatus ?? "idle",
				emailDetail: a.emailDetail ?? "",
				smsDetail: a.smsDetail ?? ""
			}))
		};
	}
}));
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/gate",
		label: "Gate",
		icon: DoorOpen
	},
	{
		to: "/office",
		label: "Office",
		icon: Landmark
	},
	{
		to: "/student",
		label: "Student",
		icon: GraduationCap
	},
	{
		to: "/parent",
		label: "Parents",
		icon: Bell
	}
];
function AppShell({ title, kicker, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-line bg-paper/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-h-11 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/scnhs-logo.png?v=20260929",
								alt: "Sta. Catalina National High School seal",
								className: "size-11 rounded-lg bg-white object-contain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-display text-sm font-semibold text-balance",
									children: "Sta Catalina National High School"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted",
									children: "Facial Recognition System"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-auto hidden items-center gap-1 lg:flex",
							children: NAV.map((item) => {
								const active = pathname === item.to;
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm", active ? "bg-sky-soft text-navy-dark" : "text-muted hover:bg-sky-soft/50 hover:text-ink"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4",
										strokeWidth: 1.75
									}), item.label]
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientReady, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionChip, {}) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-6 pb-24 sm:pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
						children: kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]", active ? "text-sky-dark" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: 1.75
							}), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
function SessionChip() {
	const session = useSchool((s) => s.session);
	const parents = useSchool((s) => s.parents);
	const students = useSchool((s) => s.students);
	const signOut = useSchool((s) => s.signOut);
	if (session.role === "none") return null;
	const label = session.role === "office" ? "Office" : session.role === "parent" ? parents.find((p) => p.id === session.parentId)?.name ?? "Parent" : students.find((s) => s.id === session.studentId)?.name ?? "Student";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden max-w-32 truncate text-xs text-muted sm:inline",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			className: "min-h-9 px-3 text-xs",
			onClick: signOut,
			children: "Sign out"
		})]
	});
}
//#endregion
export { todayISO as _, cn as a, genderLabel as c, loadFaceEngine as d, parseGender as f, studentsInSection as g, sortSections as h, STATUS_LABEL as i, groupRosterByGender as l, sortRosterStudents as m, Button as n, currentAttendanceEvents as o, sectionLabel as p, ClientReady as r, descriptorFromVideo as s, AppShell as t, isBeforeDismissal as u, useSchool as v };
