import { t as GROK_PROVIDERS } from "./server-B4Bs5QLe.mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { signIn } from "./client-C1eM2Sg8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BdhtQ1o5.js
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-svh place-items-center bg-canvas px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md rounded-3xl bg-paper p-7 shadow-border sm:p-9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/scnhs-logo.png?v=20260929",
						alt: "SCNHS seal",
						className: "size-12 rounded-lg object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.16em] text-muted",
						children: "Sta Catalina National High School"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-sky-dark",
					children: "Office access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl font-semibold tracking-tight",
					children: "Sign in to your school account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-6 text-muted",
					children: "Use the same authorized office account on each gate device to keep attendance and parent contacts in sync."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signIn(provider.providerId, { callbackURL: "/" }),
						className: "min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg transition-colors hover:bg-primary-dark",
						children: ["Continue with ", provider.label]
					}, provider.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs leading-5 text-muted",
					children: "Only the school’s authorized office account should be used here. Parent alerts are sent to each student’s linked contacts."
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
