import { persistReadJson, persistWriteJson } from "./community-local";
import { detectFlyway, milesBetween } from "./places";
import type { HuntBrief, HuntRating, Place, PushLevel, SpeciesStatus } from "./types";

const KEY = "flyway-harvest-logs";
const EVENT = "flyway-harvest-change";
const MAX_AGE_MS = 72 * 60 * 60 * 1000;
const SPECIES_ALIAS: Record<string, string> = { cinte: "cite" };

export type HarvestSex = "drake" | "hen" | "unknown";
export type HarvestIce = "open" | "skim" | "locked";
export type HarvestFinish = "decoys" | "pass" | "jump" | "loafing";

export type HarvestLog = {
  id: string;
  createdAtMs: number;
  birdId: string;
  birdName: string;
  sex: HarvestSex;
  count: number;
  ice: HarvestIce;
  finish: HarvestFinish;
  note: string;
  place: Place;
};

export type HarvestSighting = HarvestLog & {
  milesNorth: number;
  hoursAgo: number;
  north: boolean;
};

const ICE_LABEL: Record<HarvestIce, string> = {
  open: "open water",
  skim: "skim ice",
  locked: "locked up",
};

const FINISH_LABEL: Record<HarvestFinish, string> = {
  decoys: "finished decoys",
  pass: "pass-shot",
  jump: "jumped",
  loafing: "loafing / sitting",
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function ratingFor(score: number): HuntRating {
  if (score >= 80) return "Exceptional";
  if (score >= 65) return "Prime";
  if (score >= 50) return "Good";
  if (score >= 30) return "Fair";
  return "Poor";
}

function speciesIdFor(birdId: string): string {
  return SPECIES_ALIAS[birdId] ?? birdId;
}

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}

export function loadHarvests(): HarvestLog[] {
  const rows = persistReadJson<HarvestLog[]>(KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export function addHarvest(input: Omit<HarvestLog, "id" | "createdAtMs">): HarvestLog {
  const row: HarvestLog = {
    ...input,
    id: `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAtMs: Date.now(),
    count: clamp(Math.round(input.count), 1, 8),
    note: input.note.trim().slice(0, 180),
  };
  const next = [row, ...loadHarvests()].slice(0, 80);
  persistWriteJson(KEY, next);
  emit();
  return row;
}

export function removeHarvest(id: string) {
  persistWriteJson(
    KEY,
    loadHarvests().filter((row) => row.id !== id),
  );
  emit();
}

export function subscribeHarvests(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function harvestsForPlace(place: Place, nowMs = Date.now()): HarvestSighting[] {
  const flyway = detectFlyway(place.lon);
  return loadHarvests()
    .filter((row) => nowMs - row.createdAtMs <= MAX_AGE_MS)
    .filter((row) => detectFlyway(row.place.lon) === flyway)
    .map((row) => {
      const milesNorth = milesBetween(place, row.place);
      const north = row.place.lat > place.lat + 0.12;
      return {
        ...row,
        milesNorth,
        hoursAgo: (nowMs - row.createdAtMs) / 3600000,
        north,
      };
    })
    .filter((row) => row.north || row.milesNorth <= 45)
    .sort((a, b) => a.createdAtMs < b.createdAtMs ? 1 : -1);
}

function harvestBoost(rows: HarvestSighting[]): {
  score: number;
  detail: string;
  headline: string;
  levelBump: number;
} {
  const north = rows.filter((r) => r.north);
  const local = rows.filter((r) => !r.north);
  const freshNorth = north.filter((r) => r.hoursAgo <= 18);
  const species = new Set(north.map((r) => r.birdId));
  const locked = north.some((r) => r.ice === "locked");

  let score = 0;
  if (freshNorth.length) score += 3;
  if (north.length >= 2 || species.size >= 2) score += 2;
  else if (north.length === 1) score += 1;
  if (local.length) score += 2;
  if (locked) score += 1;
  score = clamp(score, 0, 8);

  if (rows.length === 0) {
    return {
      score: 0,
      headline: "",
      detail: "No bags logged on this flyway in the last 72 hours. ID a bird and log it — the brief learns.",
      levelBump: 0,
    };
  }

  const lead = (freshNorth[0] ?? north[0] ?? local[0])!;
  const where = lead.north
    ? `${lead.place.name}, ${lead.milesNorth.toFixed(0)} mi north`
    : `on your marsh`;
  const headline = lead.north
    ? `${lead.birdName} showed north of you`
    : `${lead.birdName} already in`;
  const ice = ICE_LABEL[lead.ice];
  const finish = FINISH_LABEL[lead.finish];
  const detail = `${lead.count} ${lead.birdName.toLowerCase()}${lead.count === 1 ? "" : "s"} ${where} — ${ice}, ${finish}. ${
    score >= 5 ? "That bag is in the sit number." : "Logged. Southbound hunters will see it on the brief."
  }`;

  let levelBump = 0;
  if (score >= 6) levelBump = 2;
  else if (score >= 4) levelBump = 1;

  return { score, detail, headline, levelBump };
}

function bumpLevel(level: PushLevel, bump: number): PushLevel {
  const order: PushLevel[] = ["stalled", "trickle", "moving", "push", "exodus"];
  const idx = Math.min(order.length - 1, Math.max(0, order.indexOf(level) + bump));
  return order[idx] ?? level;
}

function statusFromHarvest(current: SpeciesStatus, north: boolean): SpeciesStatus {
  if (!north) {
    if (current === "not_yet") return "arriving";
    return current;
  }
  if (current === "not_yet" || current === "past") return "arriving";
  if (current === "arriving") return "peak";
  return current;
}

export function applyHarvest(brief: HuntBrief, nowMs = Date.now()): HuntBrief {
  const rows = harvestsForPlace(brief.location, nowMs);
  const boost = harvestBoost(rows);
  const value = clamp(brief.score.value + boost.score, 0, 100);
  const rating = ratingFor(value);
  const factors = [
    ...brief.score.factors.filter((f) => f.id !== "bag"),
    {
      id: "bag",
      label: "The bag",
      score: boost.score,
      max: 8,
      detail: boost.detail,
    },
  ];

  const speciesHits = new Map<string, HarvestSighting>();
  for (const row of rows) {
    const id = speciesIdFor(row.birdId);
    if (!speciesHits.has(id)) speciesHits.set(id, row);
  }

  const species = brief.species.map((card) => {
    const hit = speciesHits.get(card.id);
    if (!hit) return card;
    const status = statusFromHarvest(card.status, hit.north);
    const statusLabel =
      status === "arriving"
        ? "Arriving"
        : status === "peak"
          ? "Peak"
          : card.statusLabel;
    const where = hit.north
      ? `${hit.place.name}, ${hit.milesNorth.toFixed(0)} mi north`
      : hit.place.name;
    return {
      ...card,
      status,
      statusLabel,
      inPlay: true,
      note: `Logged ${where} — ${hit.count} in hand. ${card.note}`,
    };
  });

  const incomingLevel = bumpLevel(brief.incoming.level, boost.levelBump);
  const incomingHeadline = boost.score >= 4 && boost.headline ? boost.headline : brief.incoming.headline;
  const incomingDetail =
    boost.score > 0
      ? `${boost.detail} ${brief.incoming.detail}`
      : brief.incoming.detail;

  const headline =
    boost.score >= 4 && boost.headline ? boost.headline : brief.score.headline;
  const summary =
    boost.score > 0 ? `${boost.detail} ${brief.score.summary}` : brief.score.summary;

  return {
    ...brief,
    score: {
      ...brief.score,
      value,
      rating,
      headline,
      summary,
      factors,
    },
    incoming: {
      ...brief.incoming,
      level: incomingLevel,
      headline: incomingHeadline,
      detail: incomingDetail,
    },
    species,
  };
}

export { ICE_LABEL, FINISH_LABEL };
