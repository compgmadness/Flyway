import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { detectFlyway, upstreamStations } from "./places";
import { buildBrief } from "./scoring";
import type { HuntBrief, Place } from "./types";
import { fetchForecasts } from "./weather";

type CacheEntry = { at: number; brief: HuntBrief };
const memory = new Map<string, CacheEntry>();
const TTL_MS = 30 * 60 * 1000;
const DISK_TTL_MS = 6 * 60 * 60 * 1000;
const DISK_DIR = "/tmp/flyway-wx";

function cacheKey(place: Place): string {
  const hour = new Date().toISOString().slice(0, 13);
  return `p3:${place.lat.toFixed(2)},${place.lon.toFixed(2)}:${hour}`;
}

function diskName(place: Place): string {
  return `p3_${place.lat.toFixed(2)}_${place.lon.toFixed(2)}.json`;
}

async function readDisk(place: Place): Promise<CacheEntry | null> {
  try {
    const raw = await readFile(join(DISK_DIR, diskName(place)), "utf8");
    const parsed = JSON.parse(raw) as CacheEntry;
    if (!parsed?.brief || typeof parsed.at !== "number") return null;
    if (Date.now() - parsed.at > DISK_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeDisk(place: Place, brief: HuntBrief): Promise<void> {
  try {
    await mkdir(DISK_DIR, { recursive: true });
    const entry: CacheEntry = { at: Date.now(), brief };
    await writeFile(join(DISK_DIR, diskName(place)), JSON.stringify(entry));
  } catch {
    /* ignore */
  }
}

export async function loadBrief(place: Place): Promise<HuntBrief> {
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
    const up = north
      .map((station, i) => ({
        place: station,
        wx: forecasts[i + 1] ?? local,
      }))
      .filter((row) => row.wx);

    const brief = buildBrief(place, local, up);
    const entry = { at: Date.now(), brief };
    memory.set(key, entry);
    void writeDisk(place, brief);
    return brief;
  } catch (err) {
    if (hit) return hit.brief;
    if (disk) return disk.brief;
    throw err;
  }
}
