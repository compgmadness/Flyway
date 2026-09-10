import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Smartphone, l as Shield, u as Share2, v as Download } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppChrome } from "./app-chrome-D89wH6B7.mjs";
import { o as placeFromSearch, s as placeSearch } from "./places-CS7nVL2c.mjs";
import { t as shareApp } from "./share-app-s2MtjDV9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/get-BN82tIzc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GetAppPage() {
	const [note, setNote] = (0, import_react.useState)(null);
	const place = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return null;
		return placeFromSearch(window.location.search);
	}, []);
	async function onShare() {
		const result = await shareApp(place ?? void 0);
		if (result === "shared-file") setNote("Pick a chat — Flyway.apk is attached");
		if (result === "shared-link") setNote("Install link sent");
		if (result === "copied") setNote("Install link copied");
		if (result !== "cancelled") window.setTimeout(() => setNote(null), 3200);
	}
	const briefHref = place ? `/${placeSearch(place)}` : "/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppChrome, { page: "get" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-subtle uppercase",
						children: "Send this to testers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl leading-tight text-fg sm:text-4xl",
						children: "Get Flyway on your phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted sm:text-base",
						children: ["Android install is a download, not the Play Store. Tap below, then allow the install.", place ? ` This link is pinned to ${place.name}.` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/flyway.apk",
						download: "Flyway.apk",
						className: "mt-6 flex min-h-12 items-center justify-center gap-2 rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Flyway.apk"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						className: "mt-3 w-full",
						onClick: () => void onShare(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {}), "Share the app"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: briefHref,
						className: "mt-3 flex min-h-11 items-center justify-center rounded-md text-sm text-sage hover:underline",
						children: "Open the live brief in this browser"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-8 space-y-3 text-sm leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg",
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download the file. If Chrome says it’s uncommon, choose Download anyway." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg",
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Flyway.apk. Allow your browser to install unknown apps if Android asks." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg",
									children: "3"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Install, then open Flyway. Use Brief and Bag ID from the tabs under the title." })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-3 rounded-md bg-elevated px-3 py-3 text-xs leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mt-0.5 size-4 shrink-0 text-sage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sideloaded build, signed so Android will install it. Network for weather. Location is optional for pinning a marsh." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex items-center gap-2 text-xs text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-3.5" }), "Android 7 and newer"]
					})
				]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-4 z-50 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md bg-elevated px-4 py-2 text-sm text-fg shadow-border",
					children: note
				})
			}) : null
		]
	});
}
var SplitComponent = GetAppPage;
//#endregion
export { SplitComponent as component };
