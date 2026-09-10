import { detectFlyway, upstreamStations } from "./places";
import { buildBrief } from "./scoring";
import type { HuntBrief, Place } from "./types";
import { fetchForecasts } from "./weather";

type CacheEntry = { at: number; brief: HuntBrief };

const memory = new Map<string, CacheEntry>();
const TTL_MS = 30 * 60 * 1000;
const DISK_TTL_MS = 6 * 60 * 60 * 1000;
const LS_KEY = "flyway:wx-cache:p3";

function cacheKey(place: Place): string {
  const hour = new Date().toISOString().slice(0, 13);
  return `p3:${place.lat.toFixed(2)},${place.lon.toFixed(2)}:${hour}`;
}

function placeKey(place: Place): string {
  return `${place.lat.toFixed(2)}_${place.lon.toFixed(2)}`;
}

function readLocal(place: Place): CacheEntry | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, CacheEntry>;
    const hit = parsed[placeKey(place)];
    if (!hit?.brief || typeof hit.at !== "number") return null;
    if (Date.now() - hit.at > DISK_TTL_MS) return null;
    return hit;
  } catch {
    return null;
  }
}

function writeLocal(place: Place, brief: HuntBrief) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, CacheEntry>) : {};
    parsed[placeKey(place)] = { at: Date.now(), brief };
    localStorage.setItem(LS_KEY, JSON.stringify(parsed));
  } catch {
    /* quota */
  }
}

export async function loadBrief(place: Place): Promise<HuntBrief> {
  const key = cacheKey(place);
  const hit = memory.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.brief;

  const stored = readLocal(place);
  if (stored && Date.now() - stored.at < TTL_MS) {
    memory.set(key, stored);
    return stored.brief;
  }

  const flyway = detectFlyway(place.lon);
  const north = upstreamStations(place, flyway);

  try {
    const forecasts = await fetchForecasts([place, ...north]);
    const local = forecasts[0];
    if (!local) throw new Error("Weather service returned no data");
    const up = north
      .map((station, i) => ({
        place: station,
        wx: forecasts[i + 1] ?? local,
      }))
      .filter((row) => row.wx);

    const brief = buildBrief(place, local, up);
    const entry = { at: Date.now(), brief };
    memory.set(key, entry);
    writeLocal(place, brief);
    return brief;
  } catch (err) {
    if (hit) return hit.brief;
    if (stored) return stored.brief;
    throw err;
  }
}
