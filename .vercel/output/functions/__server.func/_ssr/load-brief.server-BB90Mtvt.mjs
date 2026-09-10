import { i as detectFlyway, l as upstreamStations } from "./places-CS7nVL2c.mjs";
import { n as fetchForecasts, t as buildBrief } from "./scoring-B1AhrkeL.mjs";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/load-brief.server-BB90Mtvt.js
var memory = /* @__PURE__ */ new Map();
var TTL_MS = 18e5;
var DISK_TTL_MS = 216e5;
var DISK_DIR = "/tmp/flyway-wx";
function cacheKey(place) {
	const hour = (/* @__PURE__ */ new Date()).toISOString().slice(0, 13);
	return `${place.lat.toFixed(2)},${place.lon.toFixed(2)}:${hour}`;
}
function diskName(place) {
	return `${place.lat.toFixed(2)}_${place.lon.toFixed(2)}.json`;
}
async function readDisk(place) {
	try {
		const raw = await readFile(join(DISK_DIR, diskName(place)), "utf8");
		const parsed = JSON.parse(raw);
		if (!parsed?.brief || typeof parsed.at !== "number") return null;
		if (Date.now() - parsed.at > DISK_TTL_MS) return null;
		return parsed;
	} catch {
		return null;
	}
}
async function writeDisk(place, brief) {
	try {
		await mkdir(DISK_DIR, { recursive: true });
		const entry = {
			at: Date.now(),
			brief
		};
		await writeFile(join(DISK_DIR, diskName(place)), JSON.stringify(entry));
	} catch {}
}
async function loadBrief(place) {
	const key = cacheKey(place);
	const hit = memory.get(key);
	if (hit && Date.now() - hit.at < TTL_MS) return hit.brief;
	const disk = await readDisk(place);
	if (disk && Date.now() - disk.at < TTL_MS) {
		memory.set(key, disk);
		return disk.brief;
	}
	const flyway = detectFlyway(place.lon);
	const north = upstreamStations(place, flyway);
	try {
		const forecasts = await fetchForecasts([place, ...north]);
		const local = forecasts[0];
		if (!local) throw new Error("Weather service returned no data");
		const up = north.map((station, i) => ({
			place: station,
			wx: forecasts[i + 1] ?? local
		})).filter((row) => row.wx);
		const brief = buildBrief(place, local, up);
		const entry = {
			at: Date.now(),
			brief
		};
		memory.set(key, entry);
		writeDisk(place, brief);
		return brief;
	} catch (err) {
		if (hit) return hit.brief;
		if (disk) return disk.brief;
		throw err;
	}
}
//#endregion
export { loadBrief };
