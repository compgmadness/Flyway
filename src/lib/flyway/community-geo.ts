import type { FlywayId } from "./types";

export const FLYWAY_OPTIONS: { id: FlywayId; label: string }[] = [
  { id: "pacific", label: "Pacific" },
  { id: "central", label: "Central" },
  { id: "mississippi", label: "Mississippi" },
  { id: "atlantic", label: "Atlantic" },
];

export const STATES_BY_FLYWAY: Record<FlywayId, { code: string; name: string }[]> = {
  pacific: [
    { code: "AK", name: "Alaska" },
    { code: "WA", name: "Washington" },
    { code: "OR", name: "Oregon" },
    { code: "CA", name: "California" },
    { code: "ID", name: "Idaho" },
    { code: "NV", name: "Nevada" },
    { code: "UT", name: "Utah" },
    { code: "AZ", name: "Arizona" },
  ],
  central: [
    { code: "MT", name: "Montana" },
    { code: "WY", name: "Wyoming" },
    { code: "CO", name: "Colorado" },
    { code: "NM", name: "New Mexico" },
    { code: "ND", name: "North Dakota" },
    { code: "SD", name: "South Dakota" },
    { code: "NE", name: "Nebraska" },
    { code: "KS", name: "Kansas" },
    { code: "OK", name: "Oklahoma" },
    { code: "TX", name: "Texas" },
  ],
  mississippi: [
    { code: "MN", name: "Minnesota" },
    { code: "WI", name: "Wisconsin" },
    { code: "IA", name: "Iowa" },
    { code: "MO", name: "Missouri" },
    { code: "AR", name: "Arkansas" },
    { code: "LA", name: "Louisiana" },
    { code: "MS", name: "Mississippi" },
    { code: "AL", name: "Alabama" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "KY", name: "Kentucky" },
    { code: "TN", name: "Tennessee" },
    { code: "MI", name: "Michigan" },
    { code: "OH", name: "Ohio" },
  ],
  atlantic: [
    { code: "ME", name: "Maine" },
    { code: "NH", name: "New Hampshire" },
    { code: "VT", name: "Vermont" },
    { code: "MA", name: "Massachusetts" },
    { code: "NY", name: "New York" },
    { code: "NJ", name: "New Jersey" },
    { code: "PA", name: "Pennsylvania" },
    { code: "DE", name: "Delaware" },
    { code: "MD", name: "Maryland" },
    { code: "VA", name: "Virginia" },
    { code: "NC", name: "North Carolina" },
    { code: "SC", name: "South Carolina" },
    { code: "GA", name: "Georgia" },
    { code: "FL", name: "Florida" },
    { code: "WV", name: "West Virginia" },
  ],
};

export const CITIES_BY_STATE: Record<string, string[]> = {
  CO: ["Denver", "Pueblo", "Sterling", "Fort Morgan", "Alamosa", "Lamar"],
  ND: ["Bismarck", "Minot", "Devils Lake", "Fargo"],
  SD: ["Pierre", "Aberdeen", "Sand Lake"],
  NE: ["North Platte", "Valentine", "Kearney"],
  TX: ["Amarillo", "Lubbock", "Midland", "Anahuac"],
  AR: ["Stuttgart", "St. Charles"],
  LA: ["Lafayette", "Monroe", "Gueydan"],
  MN: ["Minneapolis", "Thief River Falls"],
  WI: ["Horicon", "Green Bay"],
  MO: ["Squaw Creek", "St. Louis"],
  IA: ["Des Moines", "Forney Lake"],
  CA: ["Sacramento", "Los Banos", "Klamath"],
  OR: ["Klamath Falls", "Columbia River"],
  WA: ["Puget Sound", "Othello"],
  UT: ["Great Salt Lake", "Delta"],
  MD: ["Chesapeake Bay", "Eastern Shore"],
  NC: ["Mattamuskeet", "Currituck"],
  NY: ["Montezuma", "Long Island"],
  FL: ["Lake Okeechobee", "Tampa Bay"],
};

export const REPORT_SPECIES = [
  "Mallard",
  "Gadwall",
  "Wigeon",
  "Pintail",
  "Shoveler",
  "Blue-winged teal",
  "Green-winged teal",
  "Canvasback",
  "Redhead",
  "Scaup",
  "Canada goose",
  "Snow goose",
  "White-front",
  "Mixed bag",
  "Other",
] as const;

export function stateName(code: string): string {
  for (const list of Object.values(STATES_BY_FLYWAY)) {
    const hit = list.find((s) => s.code === code);
    if (hit) return hit.name;
  }
  return code;
}
