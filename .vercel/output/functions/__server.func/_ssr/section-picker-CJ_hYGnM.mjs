import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as sortSections, p as sectionLabel } from "./app-shell-DQRKUXmS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/section-picker-CJ_hYGnM.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ name, label, placeholder, required, type = "text", defaultValue, autoComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs uppercase tracking-wider text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			id: name,
			type,
			required,
			placeholder,
			defaultValue,
			autoComplete,
			className: "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2"
		})]
	});
}
function SectionPicker({ sections, value, onChange, name, id, includeAll, dark }) {
	const ordered = sortSections(sections);
	const grades = [...new Set(ordered.map((s) => s.grade))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		name,
		id,
		className: dark ? "min-h-12 w-full rounded-xl border-0 bg-navy-dark px-3 text-paper outline-none ring-sky focus:ring-2" : "mt-1 min-h-11 w-full rounded-xl bg-canvas px-3 text-sm text-ink outline-none ring-primary focus:ring-2",
		value,
		onChange: (e) => onChange(e.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: includeAll ? "All sections" : "Choose a section"
		}), grades.map((grade) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
			label: `Grade ${grade}`,
			children: ordered.filter((s) => s.grade === grade).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: s.id,
				children: sectionLabel(s)
			}, s.id))
		}, grade))]
	});
}
//#endregion
export { SectionPicker as n, Field as t };
