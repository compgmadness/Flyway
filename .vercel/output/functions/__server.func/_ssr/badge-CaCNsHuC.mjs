import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./app-chrome-D89wH6B7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CaCNsHuC.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		muted: "bg-elevated text-muted",
		sage: "bg-sage/15 text-sage",
		fair: "bg-hunt-fair/15 text-hunt-fair",
		poor: "bg-hunt-poor/15 text-hunt-poor",
		good: "bg-hunt-good/15 text-hunt-good"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
//#endregion
export { Badge as t };
