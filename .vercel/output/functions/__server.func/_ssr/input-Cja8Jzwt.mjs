import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./app-chrome-D89wH6B7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-Cja8Jzwt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border outline-none transition-shadow duration-150 placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/70", className),
	ref,
	...props
}));
Input.displayName = "Input";
//#endregion
export { Input as t };
