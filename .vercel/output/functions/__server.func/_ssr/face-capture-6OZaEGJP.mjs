import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as loadFaceEngine, n as Button, s as descriptorFromVideo } from "./app-shell-DQRKUXmS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/face-capture-6OZaEGJP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FaceCapture({ onCapture, autoScan = false, variant = "dark" }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [hint, setHint] = (0, import_react.useState)("Starting camera…");
	const [ready, setReady] = (0, import_react.useState)(false);
	const scanningRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				await loadFaceEngine();
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "user",
						width: { ideal: 640 },
						height: { ideal: 480 }
					},
					audio: false
				});
				if (cancelled) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play();
				}
				setReady(true);
				setHint(autoScan ? "Camera is scanning automatically…" : "Face the camera, then capture.");
			} catch {
				setHint("Camera is not available here. Use PIN at the gate instead.");
			}
		})();
		return () => {
			cancelled = true;
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, [autoScan]);
	(0, import_react.useEffect)(() => {
		if (!autoScan || !ready) return;
		const timer = window.setInterval(async () => {
			if (scanningRef.current || !videoRef.current) return;
			scanningRef.current = true;
			try {
				const descriptor = await descriptorFromVideo(videoRef.current);
				if (descriptor) onCapture(descriptor);
			} catch {
				setHint("Camera scan paused briefly. Trying again…");
			} finally {
				scanningRef.current = false;
			}
		}, 1400);
		return () => window.clearInterval(timer);
	}, [
		autoScan,
		onCapture,
		ready
	]);
	async function capture() {
		if (!videoRef.current) return;
		setHint("Looking for a face…");
		const descriptor = await descriptorFromVideo(videoRef.current);
		if (!descriptor) {
			setHint("No face found. Come closer, even light, look straight.");
			return;
		}
		onCapture(descriptor);
		setHint("Face captured.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl bg-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "aspect-[4/3] w-full object-cover",
					muted: true,
					playsInline: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: variant === "dark" ? "text-sm text-sky-soft" : "text-sm text-muted",
				children: hint
			}),
			!autoScan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: variant === "dark" ? "sky" : "primary",
				disabled: !ready,
				onClick: capture,
				children: "Capture face"
			}) : null
		]
	});
}
//#endregion
export { FaceCapture as t };
