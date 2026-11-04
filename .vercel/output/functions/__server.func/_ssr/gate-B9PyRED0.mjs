import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LogOut, r as LogIn } from "../_libs/lucide-react.mjs";
import { i as STATUS_LABEL, n as Button, r as ClientReady, t as AppShell, v as useSchool } from "./app-shell-DQRKUXmS.mjs";
import { t as FaceCapture } from "./face-capture-6OZaEGJP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gate-B9PyRED0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GatePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "School Facial Recognition System",
		kicker: "Sta Catalina National High School",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientReady, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateBody, {}) })
	});
}
function GateBody() {
	const checkFace = useSchool((s) => s.checkFace);
	const recognizeFace = useSchool((s) => s.recognizeFace);
	const students = useSchool((s) => s.students);
	const [pendingFace, setPendingFace] = (0, import_react.useState)(null);
	const [recognized, setRecognized] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [last, setLast] = (0, import_react.useState)(null);
	function finish(result) {
		if (!result.ok) {
			setLast(null);
			setError(result.error);
			return;
		}
		setError("");
		setLast({
			student: result.student,
			event: result.event
		});
		setRecognized(null);
	}
	function submit(direction) {
		if (!pendingFace) {
			setError("Face the camera first.");
			return;
		}
		finish(checkFace(pendingFace, direction));
		setPendingFace(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-3xl bg-ink p-5 text-paper shadow-border sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-sky",
					children: "Kiosk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold",
					children: "Face the camera. Attendance is automatic."
				}),
				students.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-sky-soft",
					children: "The office has not added students yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-sky-soft",
						children: [
							students.length,
							" student",
							students.length === 1 ? "" : "s",
							" on the roster. No code, ID, or section entry needed."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceCapture, {
							onCapture: (descriptor) => {
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
							},
							autoScan: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "sky",
							className: "min-h-12",
							disabled: !pendingFace,
							onClick: () => submit("in"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), " Check in"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "min-h-12 bg-transparent text-paper",
							disabled: !pendingFace,
							onClick: () => submit("out"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Check out"]
						})]
					}),
					pendingFace ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-sky",
						children: "Face recognized. Choose check in or check out."
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-xl bg-rose-soft px-3 py-3 text-sm text-rose",
						children: error
					}) : null,
					recognized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok",
						children: [
							"Recognized: ",
							recognized.name,
							" · Grade ",
							recognized.grade,
							" ",
							recognized.section,
							". Choose check in or check out."
						]
					}) : last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 rounded-xl bg-ok-soft px-3 py-3 text-sm text-ok",
						children: [
							last.student.name,
							" · Grade ",
							last.student.grade,
							" ",
							last.student.section,
							": ",
							" ",
							STATUS_LABEL[last.event.status]
						]
					}) : null
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-3xl bg-paper p-5 shadow-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-semibold",
					children: "Face check-in steps"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-3 grid gap-3 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. The office enrolls each student’s face and assigns their section on the roster." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. The camera recognizes the enrolled student and their saved section automatically." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. The student chooses check in or check out." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4. Linked parents see the alert on the Parents desk." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 rounded-xl bg-canvas p-3 text-sm text-muted",
					children: "A face must be enrolled by the office first. Attendance starts fresh each school day while the history remains available to the office."
				})
			]
		})]
	});
}
//#endregion
export { GatePage as component };
