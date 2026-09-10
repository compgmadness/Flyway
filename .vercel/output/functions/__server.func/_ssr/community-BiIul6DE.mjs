import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-CIT8-xkv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-BiIul6DE.js
var FLYWAYS = [
	"pacific",
	"central",
	"mississippi",
	"atlantic"
];
function clean(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function parseFlyway(value) {
	if (typeof value === "string" && FLYWAYS.includes(value)) return value;
	throw new Error("Unknown flyway");
}
function parseHandle(value) {
	const handle = clean(value, 20).toLowerCase();
	if (!/^[a-z0-9_]{3,20}$/.test(handle)) throw new Error("Handle must be 3–20 letters, numbers, or underscores.");
	return handle;
}
var listReports_createServerFn_handler = createServerRpc({
	id: "8362918a5a19e3ab3a5946f1c46c4509752426586acb1aa76f7f09bd2b21df33",
	name: "listReports",
	filename: "src/lib/flyway/community.ts"
}, (opts) => listReports.__executeServer(opts));
var listReports = createServerFn({ method: "POST" }).validator((input) => {
	const o = input ?? {};
	return {
		flyway: parseFlyway(o.flyway),
		state: clean(o.state, 8).toUpperCase(),
		city: clean(o.city, 48)
	};
}).handler(listReports_createServerFn_handler, async ({ data }) => {
	return (await import("./community-db.server-Babv8bjy.mjs")).fetchReports(data);
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "1cc2c623df8466285a8cd790bf6ea84db42951134c4c132707649bbf913a5d15",
	name: "getMyProfile",
	filename: "src/lib/flyway/community.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return (await import("./community-db.server-Babv8bjy.mjs")).fetchProfile(context.userId);
});
var saveProfile_createServerFn_handler = createServerRpc({
	id: "04bb0a6347fc6cd85d629f60d725fb042646896c5f29247f0163961c29665fe0",
	name: "saveProfile",
	filename: "src/lib/flyway/community.ts"
}, (opts) => saveProfile.__executeServer(opts));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = input ?? {};
	const displayName = clean(o.displayName, 32);
	if (displayName.length < 2) throw new Error("Give a name the lodge can call you.");
	const homeCity = clean(o.homeCity, 48);
	if (homeCity.length < 2) throw new Error("City is required.");
	const homeState = clean(o.homeState, 8).toUpperCase();
	if (homeState.length !== 2) throw new Error("Pick a state.");
	return {
		handle: parseHandle(o.handle),
		displayName,
		homeFlyway: parseFlyway(o.homeFlyway),
		homeState,
		homeCity,
		bio: clean(o.bio, 160)
	};
}).handler(saveProfile_createServerFn_handler, async ({ context, data }) => {
	return (await import("./community-db.server-Babv8bjy.mjs")).upsertProfile(context.userId, data);
});
var createReport_createServerFn_handler = createServerRpc({
	id: "c973b615e1d05f70701a2b0825ae571ddf34277eb3fb3b165021c5e4a21f829d",
	name: "createReport",
	filename: "src/lib/flyway/community.ts"
}, (opts) => createReport.__executeServer(opts));
var createReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = input ?? {};
	const city = clean(o.city, 48);
	if (city.length < 2) throw new Error("City is required.");
	const state = clean(o.state, 8).toUpperCase();
	if (state.length !== 2) throw new Error("Pick a state.");
	const body = clean(o.body, 500);
	if (body.length < 8) throw new Error("Tell the lodge a little more.");
	return {
		flyway: parseFlyway(o.flyway),
		state,
		city,
		species: clean(o.species, 40),
		body
	};
}).handler(createReport_createServerFn_handler, async ({ context, data }) => {
	return (await import("./community-db.server-Babv8bjy.mjs")).insertReport(context.userId, data);
});
var deleteReport_createServerFn_handler = createServerRpc({
	id: "beb4909c5136d07a4c4f0d534a60146c93e67fd7fff53c0ffd158d5f086f75b0",
	name: "deleteReport",
	filename: "src/lib/flyway/community.ts"
}, (opts) => deleteReport.__executeServer(opts));
var deleteReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = typeof input === "number" ? input : Number(input?.id);
	if (!Number.isInteger(id) || id < 1) throw new Error("Missing report");
	return id;
}).handler(deleteReport_createServerFn_handler, async ({ context, data: id }) => {
	await (await import("./community-db.server-Babv8bjy.mjs")).removeReport(context.userId, id);
	return { ok: true };
});
//#endregion
export { createReport_createServerFn_handler, deleteReport_createServerFn_handler, getMyProfile_createServerFn_handler, listReports_createServerFn_handler, saveProfile_createServerFn_handler };
