import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as signIn } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-BJkA9smt.mjs";
import { r as FlockMark } from "./app-chrome-D89wH6B7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-mim8N5wR.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlockMark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs font-medium tracking-widest text-subtle uppercase",
				children: "The lodge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl text-fg",
				children: "Sign in to post"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Cut a handle, pin your marsh, and tell the flyway what you saw. Google or X — same desk either way."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-col gap-2",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => signIn(p.providerId, { callbackURL: "/community" }),
					className: "flex h-11 items-center justify-center rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90",
					children: ["Continue with ", p.label]
				}, p.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 text-sm text-sage hover:underline",
				children: "Back to the brief"
			})
		]
	});
}
//#endregion
export { Login as component };
