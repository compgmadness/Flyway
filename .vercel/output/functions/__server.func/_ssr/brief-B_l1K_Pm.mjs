import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brief-B_l1K_Pm.js
function parsePlace(input) {
	const o = input;
	if (typeof o?.lat !== "number" || typeof o?.lon !== "number") throw new Error("lat and lon required");
	if (!Number.isFinite(o.lat) || !Number.isFinite(o.lon)) throw new Error("invalid coordinates");
	if (o.lat < -90 || o.lat > 90 || o.lon < -180 || o.lon > 180) throw new Error("coordinates out of range");
	return {
		lat: o.lat,
		lon: o.lon,
		name: typeof o.name === "string" && o.name.trim() ? o.name.trim().slice(0, 80) : "Pinned location",
		region: typeof o.region === "string" ? o.region.slice(0, 80) : void 0
	};
}
var getHuntBrief_createServerFn_handler = createServerRpc({
	id: "9e34ef1942c2c728c4aaf635e5406c451847ee6831927bf889a0cf8dd6a720a0",
	name: "getHuntBrief",
	filename: "src/lib/flyway/brief.ts"
}, (opts) => getHuntBrief.__executeServer(opts));
var getHuntBrief = createServerFn({ method: "POST" }).validator((input) => parsePlace(input)).handler(getHuntBrief_createServerFn_handler, async ({ data }) => {
	try {
		const { loadBrief } = await import("./load-brief.server-BB90Mtvt.mjs");
		return await loadBrief(data);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Weather fetch failed";
		console.error("[flyway] brief failed", err);
		throw new Error(message);
	}
});
var reports = /* @__PURE__ */ new Map();
var TTL_MS = 12e5;
var writeScoutReport_createServerFn_handler = createServerRpc({
	id: "0441062ac7f6f3d77fa58ba404b8dada76c8f559070cd6d732719d7d122a3c82",
	name: "writeScoutReport",
	filename: "src/lib/flyway/brief.ts"
}, (opts) => writeScoutReport.__executeServer(opts));
var writeScoutReport = createServerFn({ method: "POST" }).validator((input) => {
	const o = input;
	if (!o?.brief || typeof o.brief !== "object") throw new Error("brief required");
	return { brief: o.brief };
}).handler(writeScoutReport_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Scout reports are unavailable in this environment."
	};
	const b = data.brief;
	const key = `${b.location.lat.toFixed(2)},${b.location.lon.toFixed(2)}:${b.generatedAt.slice(0, 13)}`;
	const hit = reports.get(key);
	if (hit && Date.now() - hit.at < TTL_MS) return {
		ok: true,
		text: hit.text
	};
	const payload = {
		place: b.location,
		flyway: b.flyway.name,
		season: b.season.name,
		score: b.score,
		now: b.now,
		incoming: b.incoming,
		species: b.species.filter((s) => s.inPlay).map((s) => `${s.name} (${s.statusLabel})`),
		moon: b.moon,
		nextDays: b.days.slice(0, 4).map((d) => ({
			label: d.label,
			score: d.score,
			rating: d.rating,
			weather: d.weatherLabel,
			wind: `${d.windCardinal} ${d.windMph.toFixed(0)}`,
			legal: d.legalAm
		}))
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 380,
			temperature: .5,
			messages: [{
				role: "system",
				content: "You are a veteran waterfowl guide writing a short morning scout report. Use only the provided weather and migration data. No bag limits, no legal advice, no guarantees. Three short paragraphs: (1) what is moving and from where, (2) how today's weather will hunt, (3) the best sit in the next few days. Plain, field-journal voice. No emoji. No bullet lists."
			}, {
				role: "user",
				content: JSON.stringify(payload)
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Scout desk returned ${res.status}.`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim();
	if (!text) return {
		ok: false,
		error: "Empty report."
	};
	reports.set(key, {
		at: Date.now(),
		text
	});
	return {
		ok: true,
		text
	};
});
//#endregion
export { getHuntBrief_createServerFn_handler, writeScoutReport_createServerFn_handler };
