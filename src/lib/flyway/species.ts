import type { FlywayId, SpeciesCard, SpeciesGroup, SpeciesStatus } from "./types";

type SpeciesDef = {
  id: string;
  name: string;
  group: SpeciesGroup;
  windowStart: number;
  peakStart: number;
  peakEnd: number;
  windowEnd: number;
  flyways: FlywayId[] | "all";
  weatherSensitive: number;
  note: string;
  resident?: boolean;
};

const SPECIES: SpeciesDef[] = [
  {
    id: "bwte",
    name: "Blue-winged teal",
    group: "dabbler",
    windowStart: 227,
    peakStart: 244,
    peakEnd: 273,
    windowEnd: 295,
    flyways: "all",
    weatherSensitive: 0.7,
    note: "First ducks of fall. Ride early cold snaps and are often gone before mallards arrive.",
  },
  {
    id: "cite",
    name: "Cinnamon teal",
    group: "dabbler",
    windowStart: 220,
    peakStart: 248,
    peakEnd: 275,
    windowEnd: 295,
    flyways: ["pacific", "central"],
    weatherSensitive: 0.55,
    note: "Western nesters. Still on Colorado marshes in early September, then slide south with the blue-wings.",
  },
  {
    id: "gwte",
    name: "Green-winged teal",
    group: "dabbler",
    windowStart: 244,
    peakStart: 274,
    peakEnd: 320,
    windowEnd: 350,
    flyways: "all",
    weatherSensitive: 0.65,
    note: "Linger longer than blue-wings. Work small water and sheet water after a rain.",
  },
  {
    id: "nopi",
    name: "Northern pintail",
    group: "dabbler",
    windowStart: 250,
    peakStart: 274,
    peakEnd: 315,
    windowEnd: 345,
    flyways: "all",
    weatherSensitive: 0.85,
    note: "Classic cold-front travelers. A north wind on the prairies puts pintails in the air overnight.",
  },
  {
    id: "gadw",
    name: "Gadwall",
    group: "dabbler",
    windowStart: 265,
    peakStart: 288,
    peakEnd: 350,
    windowEnd: 20,
    flyways: "all",
    weatherSensitive: 0.55,
    note: "Gray ducks stack on reservoirs and river oxbows once nights turn cold.",
  },
  {
    id: "amwi",
    name: "American wigeon",
    group: "dabbler",
    windowStart: 260,
    peakStart: 288,
    peakEnd: 340,
    windowEnd: 15,
    flyways: "all",
    weatherSensitive: 0.6,
    note: "Follows coots and pondweed. Pacific and Central birds show early; later flocks ride harder weather.",
  },
  {
    id: "mall",
    name: "Mallard",
    group: "dabbler",
    windowStart: 280,
    peakStart: 310,
    peakEnd: 355,
    windowEnd: 40,
    flyways: "all",
    weatherSensitive: 0.9,
    resident: true,
    note: "Year-round locals here. Migrant greenheads sit on the prairies until freeze-up, then come in waves.",
  },
  {
    id: "nsho",
    name: "Northern shoveler",
    group: "dabbler",
    windowStart: 250,
    peakStart: 274,
    peakEnd: 320,
    windowEnd: 340,
    flyways: "all",
    weatherSensitive: 0.5,
    note: "Spoonbills work shallow, dirty water. Strong on the early-season mix.",
  },
  {
    id: "canvas",
    name: "Canvasback",
    group: "diver",
    windowStart: 280,
    peakStart: 300,
    peakEnd: 335,
    windowEnd: 355,
    flyways: "all",
    weatherSensitive: 0.75,
    note: "Need open, big water. A freeze north of you concentrates cans on remaining ice-free reservoirs.",
  },
  {
    id: "redhead",
    name: "Redhead",
    group: "diver",
    windowStart: 275,
    peakStart: 295,
    peakEnd: 335,
    windowEnd: 355,
    flyways: ["pacific", "central", "mississippi"],
    weatherSensitive: 0.7,
    note: "Prairie divers. Watch the big lakes after a north blow.",
  },
  {
    id: "scaup",
    name: "Lesser scaup",
    group: "diver",
    windowStart: 285,
    peakStart: 310,
    peakEnd: 355,
    windowEnd: 30,
    flyways: "all",
    weatherSensitive: 0.65,
    note: "Bluebills trade along large reservoirs well into winter.",
  },
  {
    id: "ringneck",
    name: "Ring-necked duck",
    group: "diver",
    windowStart: 274,
    peakStart: 295,
    peakEnd: 340,
    windowEnd: 20,
    flyways: "all",
    weatherSensitive: 0.55,
    note: "Timber and marsh divers. Often with mallards on smaller water.",
  },
  {
    id: "cago",
    name: "Canada goose",
    group: "goose",
    windowStart: 250,
    peakStart: 288,
    peakEnd: 40,
    windowEnd: 70,
    flyways: "all",
    weatherSensitive: 0.8,
    resident: true,
    note: "Resident flocks plus migrants. Hard freezes and snow cover up north send the big flocks.",
  },
  {
    id: "gwfgo",
    name: "Greater white-fronted goose",
    group: "goose",
    windowStart: 265,
    peakStart: 288,
    peakEnd: 335,
    windowEnd: 20,
    flyways: ["pacific", "central", "mississippi"],
    weatherSensitive: 0.75,
    note: "Specklebellies move with the first real cold. Rice and wheat country hold them south.",
  },
  {
    id: "snago",
    name: "Snow goose",
    group: "goose",
    windowStart: 280,
    peakStart: 310,
    peakEnd: 50,
    windowEnd: 80,
    flyways: "all",
    weatherSensitive: 0.95,
    note: "Weather birds. A brutal prairie storm can dump tens of thousands overnight.",
  },
];

const STATUS_LABEL: Record<SpeciesStatus, string> = {
  not_yet: "Still north",
  arriving: "Arriving",
  peak: "Peak push",
  holding: "Holding",
  past: "Passed through",
  local: "Local birds",
};

function wrapsYear(end: number, start: number): boolean {
  return end < start;
}

function inSpan(day: number, start: number, end: number): boolean {
  if (wrapsYear(end, start)) return day >= start || day <= end;
  return day >= start && day <= end;
}

/** Days after `from` to `to` walking forward around the year. */
function daysForward(from: number, to: number): number {
  return (to - from + 365) % 365;
}

/**
 * Windows that wrap Jan 1 (mallards, geese) used to treat all of summer as
 * "passed through". Outside a wrapping window, the nearer edge wins:
 * just after the close → past; heading into the next open → still north.
 */
function isPastWindow(day: number, start: number, end: number): boolean {
  if (!wrapsYear(end, start)) return day > end;
  return daysForward(end, day) < daysForward(day, start);
}

function statusFor(day: number, spec: SpeciesDef): SpeciesStatus {
  const { windowStart, peakStart, peakEnd, windowEnd, group, resident } = spec;
  if (inSpan(day, peakStart, peakEnd)) return "peak";
  if (inSpan(day, windowStart, windowEnd)) {
    const beforePeak = wrapsYear(peakStart, windowStart)
      ? day >= windowStart || day < peakStart
      : day >= windowStart && day < peakStart;
    if (beforePeak) return "arriving";
    if (group === "goose" || resident) return "local";
    return "holding";
  }
  if (resident) return "local";
  return isPastWindow(day, windowStart, windowEnd) ? "past" : "not_yet";
}

export function speciesForLocation(args: {
  flyway: FlywayId;
  lat: number;
  dayOfYear: number;
}): SpeciesCard[] {
  const shift = Math.round((45 - args.lat) * 3.4);
  const day = ((args.dayOfYear - shift) % 365 + 365) % 365;

  return SPECIES.filter(
    (s) => s.flyways === "all" || s.flyways.includes(args.flyway),
  ).map((s) => {
    const status = statusFor(day, s);
    return {
      id: s.id,
      name: s.name,
      group: s.group,
      status,
      statusLabel: STATUS_LABEL[status],
      note: s.note,
      inPlay: status === "arriving" || status === "peak" || status === "holding" || status === "local",
    };
  });
}

export function migrationSeason(day: number): string {
  if (day >= 213 && day < 274) return "Early teal";
  if (day >= 274 && day < 305) return "October push";
  if (day >= 305 && day <= 365) return "Late mallards";
  if (day >= 1 && day < 50) return "Winter holdovers";
  if (day >= 50 && day < 151) return "Spring return";
  return "Summer locals";
}

export function seasonalTimingScore(species: SpeciesCard[]): { score: number; detail: string } {
  const peak = species.filter((s) => s.status === "peak").length;
  const arriving = species.filter((s) => s.status === "arriving").length;
  const holding = species.filter((s) => s.status === "holding" || s.status === "local").length;
  const inPlay = species.filter((s) => s.inPlay).length;

  let score = 4;
  score += Math.min(12, peak * 3);
  score += Math.min(6, arriving * 2);
  score += Math.min(4, holding);
  score = Math.min(22, score);

  let detail = "Between pulses — mostly local birds.";
  if (peak >= 3) detail = `${peak} species in their peak window at this latitude.`;
  else if (arriving >= 1) {
    detail = `${arriving} species arriving now — the first waves of the season are due.`;
  } else if (inPlay >= 4) detail = `${inPlay} species still in play, with birds holding after the main push.`;
  else if (inPlay === 0) detail = "Outside the main fall migration at this latitude.";

  return { score, detail };
}
