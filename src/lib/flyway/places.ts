import type { FlywayId, Place } from "./types";

export type { Place };

export const DEFAULT_PLACE: Place = {
  name: "Denver",
  lat: 39.7392,
  lon: -104.9903,
  region: "Colorado",
};

export function placeFromSearch(search: string): Place | null {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const latRaw = q.get("lat");
  const lonRaw = q.get("lon");
  if (latRaw == null || lonRaw == null || latRaw === "" || lonRaw === "") return null;
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  const nameRaw = q.get("name")?.trim() ?? "";
  const regionRaw = q.get("region")?.trim() ?? "";
  return {
    name: nameRaw ? nameRaw.slice(0, 80) : "Pinned location",
    lat,
    lon,
    region: regionRaw ? regionRaw.slice(0, 80) : undefined,
  };
}

export function placeSearch(place: Place): string {
  const q = new URLSearchParams();
  q.set("lat", place.lat.toFixed(4));
  q.set("lon", place.lon.toFixed(4));
  q.set("name", place.name);
  if (place.region) q.set("region", place.region);
  return `?${q.toString()}`;
}

export function placeShareUrl(place: Place): string {
  if (typeof window === "undefined") return placeSearch(place);
  return `${window.location.origin}/${placeSearch(place)}`;
}

export const FEATURED_SPOTS: Place[] = [
  // Pacific
  { name: "Palmer Hay Flats", lat: 61.54, lon: -149.2, region: "Alaska" },
  { name: "Puget Sound", lat: 47.61, lon: -122.33, region: "Washington" },
  { name: "Columbia Basin", lat: 46.9, lon: -119.5, region: "Washington" },
  { name: "Klamath Basin", lat: 42.22, lon: -121.78, region: "Oregon" },
  { name: "Summer Lake", lat: 42.97, lon: -120.78, region: "Oregon" },
  { name: "Sacramento Valley", lat: 39.2, lon: -121.9, region: "California" },
  { name: "Suisun Marsh", lat: 38.17, lon: -121.98, region: "California" },
  { name: "San Joaquin Grasslands", lat: 37.18, lon: -120.8, region: "California" },
  { name: "Salton Sea", lat: 33.3, lon: -115.8, region: "California" },
  { name: "Great Salt Lake", lat: 41.1, lon: -112.5, region: "Utah" },
  { name: "Stillwater NWR", lat: 39.5, lon: -118.53, region: "Nevada" },
  { name: "Willcox Playa", lat: 32.14, lon: -109.83, region: "Arizona" },
  // Central
  { name: "Bowdoin NWR", lat: 48.4, lon: -107.67, region: "Montana" },
  { name: "Devils Lake", lat: 48.11, lon: -98.86, region: "North Dakota" },
  { name: "Sand Lake NWR", lat: 45.75, lon: -98.15, region: "South Dakota" },
  { name: "Rainwater Basin", lat: 40.52, lon: -98.37, region: "Nebraska" },
  { name: "Cheyenne Bottoms", lat: 38.47, lon: -98.66, region: "Kansas" },
  { name: "Barr Lake", lat: 39.94, lon: -104.75, region: "Colorado" },
  { name: "Pueblo Reservoir", lat: 38.27, lon: -104.73, region: "Colorado" },
  { name: "John Martin Reservoir", lat: 38.07, lon: -102.94, region: "Colorado" },
  { name: "Bosque del Apache", lat: 33.8, lon: -106.89, region: "New Mexico" },
  { name: "Washita NWR", lat: 35.61, lon: -99.25, region: "Oklahoma" },
  { name: "Buffalo Lake", lat: 34.9, lon: -102.08, region: "Texas" },
  { name: "Anahuac NWR", lat: 29.67, lon: -94.55, region: "Texas" },
  // Mississippi
  { name: "Agassiz NWR", lat: 48.35, lon: -95.95, region: "Minnesota" },
  { name: "Horicon Marsh", lat: 43.5, lon: -88.63, region: "Wisconsin" },
  { name: "Upper Mississippi Pool 9", lat: 43.28, lon: -91.08, region: "Iowa" },
  { name: "Loess Bluffs NWR", lat: 40.08, lon: -95.23, region: "Missouri" },
  { name: "Rend Lake", lat: 38.1, lon: -88.97, region: "Illinois" },
  { name: "Hovey Lake", lat: 37.83, lon: -87.95, region: "Indiana" },
  { name: "Reelfoot Lake", lat: 36.38, lon: -89.4, region: "Tennessee" },
  { name: "Stuttgart", lat: 34.5, lon: -91.55, region: "Arkansas" },
  { name: "Catahoula Lake", lat: 31.52, lon: -92.0, region: "Louisiana" },
  { name: "Sabine NWR", lat: 29.9, lon: -93.4, region: "Louisiana" },
  { name: "Wheeler NWR", lat: 34.55, lon: -86.95, region: "Alabama" },
  // Atlantic
  { name: "Merrymeeting Bay", lat: 44.0, lon: -69.85, region: "Maine" },
  { name: "Montezuma", lat: 42.97, lon: -76.7, region: "New York" },
  { name: "Edwin B. Forsythe", lat: 39.53, lon: -74.33, region: "New Jersey" },
  { name: "Bombay Hook", lat: 39.22, lon: -75.47, region: "Delaware" },
  { name: "Chesapeake Bay", lat: 38.8, lon: -76.4, region: "Maryland" },
  { name: "Back Bay", lat: 36.67, lon: -75.92, region: "Virginia" },
  { name: "Mattamuskeet", lat: 35.51, lon: -76.2, region: "North Carolina" },
  { name: "Santee NWR", lat: 33.48, lon: -80.48, region: "South Carolina" },
  { name: "Savannah NWR", lat: 32.19, lon: -81.12, region: "Georgia" },
  { name: "Lake Okeechobee", lat: 26.93, lon: -80.8, region: "Florida" },
];

type CorridorStation = Place & { flyway: FlywayId };

const CORRIDOR: CorridorStation[] = [
  // Pacific
  { name: "Anchorage, AK", lat: 61.2181, lon: -149.9003, flyway: "pacific" },
  { name: "Juneau, AK", lat: 58.3019, lon: -134.4197, flyway: "pacific" },
  { name: "Prince George, BC", lat: 53.9171, lon: -122.7497, flyway: "pacific" },
  { name: "Vancouver, BC", lat: 49.2827, lon: -123.1207, flyway: "pacific" },
  { name: "Puget Sound, WA", lat: 47.6062, lon: -122.3321, flyway: "pacific" },
  { name: "Columbia River, OR", lat: 45.6307, lon: -121.178, flyway: "pacific" },
  { name: "Klamath Basin, OR", lat: 42.2249, lon: -121.7817, flyway: "pacific" },
  { name: "Sacramento Valley, CA", lat: 39.2, lon: -121.9, flyway: "pacific" },
  { name: "San Joaquin, CA", lat: 36.7783, lon: -120.43, flyway: "pacific" },
  { name: "Salton Sea, CA", lat: 33.3, lon: -115.8, flyway: "pacific" },
  // Central
  { name: "Saskatoon, SK", lat: 52.1579, lon: -106.6702, flyway: "central" },
  { name: "Regina, SK", lat: 50.4452, lon: -104.6189, flyway: "central" },
  { name: "Minot, ND", lat: 48.2325, lon: -101.2963, flyway: "central" },
  { name: "Bismarck, ND", lat: 46.8083, lon: -100.7837, flyway: "central" },
  { name: "Pierre, SD", lat: 44.3683, lon: -100.351, flyway: "central" },
  { name: "Valentine, NE", lat: 42.8728, lon: -100.5501, flyway: "central" },
  { name: "North Platte, NE", lat: 41.1403, lon: -100.7601, flyway: "central" },
  { name: "Sterling, CO", lat: 40.6255, lon: -103.2077, flyway: "central" },
  { name: "Denver, CO", lat: 39.7392, lon: -104.9903, flyway: "central" },
  { name: "Pueblo, CO", lat: 38.2544, lon: -104.6091, flyway: "central" },
  { name: "Clayton, NM", lat: 36.4517, lon: -103.1841, flyway: "central" },
  { name: "Amarillo, TX", lat: 35.222, lon: -101.8313, flyway: "central" },
  { name: "Lubbock, TX", lat: 33.5779, lon: -101.8552, flyway: "central" },
  { name: "Midland, TX", lat: 31.9973, lon: -102.0779, flyway: "central" },
  // Mississippi
  { name: "Winnipeg, MB", lat: 49.8951, lon: -97.1384, flyway: "mississippi" },
  { name: "Fargo, ND", lat: 46.8772, lon: -96.7898, flyway: "mississippi" },
  { name: "Minneapolis, MN", lat: 44.9778, lon: -93.265, flyway: "mississippi" },
  { name: "Des Moines, IA", lat: 41.5868, lon: -93.625, flyway: "mississippi" },
  { name: "St. Louis, MO", lat: 38.627, lon: -90.1994, flyway: "mississippi" },
  { name: "Cairo, IL", lat: 37.0051, lon: -89.1765, flyway: "mississippi" },
  { name: "Memphis, TN", lat: 35.1495, lon: -90.049, flyway: "mississippi" },
  { name: "Stuttgart, AR", lat: 34.5004, lon: -91.5526, flyway: "mississippi" },
  { name: "Monroe, LA", lat: 32.5093, lon: -92.1193, flyway: "mississippi" },
  { name: "Lafayette, LA", lat: 30.2241, lon: -92.0198, flyway: "mississippi" },
  // Atlantic
  { name: "Quebec City, QC", lat: 46.8139, lon: -71.208, flyway: "atlantic" },
  { name: "Montreal, QC", lat: 45.5017, lon: -73.5673, flyway: "atlantic" },
  { name: "Montezuma, NY", lat: 42.9723, lon: -76.7033, flyway: "atlantic" },
  { name: "Delaware Bay, NJ", lat: 39.2, lon: -75.25, flyway: "atlantic" },
  { name: "Chesapeake Bay, MD", lat: 38.8, lon: -76.4, flyway: "atlantic" },
  { name: "Mattamuskeet, NC", lat: 35.51, lon: -76.2, flyway: "atlantic" },
  { name: "Santee, SC", lat: 33.4854, lon: -80.4754, flyway: "atlantic" },
  { name: "Okefenokee, GA", lat: 30.7403, lon: -82.3332, flyway: "atlantic" },
  { name: "Lake Okeechobee, FL", lat: 26.9342, lon: -80.8029, flyway: "atlantic" },
];

export const FLYWAY_META: Record<
  FlywayId,
  { name: string; blurb: string }
> = {
  pacific: {
    name: "Pacific Flyway",
    blurb:
      "Alaska and the Pacific coast down through California’s valleys. Pintail, wigeon, and white-fronts own this corridor.",
  },
  central: {
    name: "Central Flyway",
    blurb:
      "Prairie potholes through the plains and Front Range. Mallards, teal, and geese ride cold air down the spine of the continent.",
  },
  mississippi: {
    name: "Mississippi Flyway",
    blurb:
      "The busiest duck highway in North America — potholes to the Arkansas timber, with mallards leading the late push.",
  },
  atlantic: {
    name: "Atlantic Flyway",
    blurb:
      "Boreal Canada down the seaboard marshes. Black ducks, sea ducks, and Canada geese stage on the big bays.",
  },
};

export function detectFlyway(lon: number): FlywayId {
  if (lon <= -109.5) return "pacific";
  if (lon <= -96.5) return "central";
  if (lon <= -84) return "mississippi";
  return "atlantic";
}

export function milesBetween(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const r = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const sin =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(sin)));
}

export function upstreamStations(place: Place, flyway: FlywayId): Place[] {
  const north = CORRIDOR.filter(
    (s) => s.flyway === flyway && s.lat > place.lat + 0.45,
  ).sort((a, b) => a.lat - b.lat);

  const picked: Place[] = [];
  for (const station of north) {
    if (picked.length === 0) {
      picked.push(station);
      continue;
    }
    const last = picked[picked.length - 1];
    if (milesBetween(last, station) >= 140) picked.push(station);
    if (picked.length >= 3) break;
  }

  if (picked.length < 3) {
    const extras = north.filter((s) => !picked.some((p) => p.name === s.name));
    for (const extra of extras) {
      picked.push(extra);
      if (picked.length >= 3) break;
    }
  }

  return picked.slice(0, 3).reverse();
}

type GeoHit = {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
  country_code?: string;
};

export async function searchUsPlaces(q: string): Promise<Place[]> {
  const name = q.trim();
  if (name.length < 2) return [];
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "12");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("countryCode", "US");
  const res = await fetch(url);
  if (!res.ok) return [];
  const body = (await res.json()) as { results?: GeoHit[] };
  return (body.results ?? [])
    .filter((r) => !r.country_code || r.country_code.toUpperCase() === "US")
    .map((r) => ({
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      region: r.admin1 ?? r.country,
    }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<Place> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const res = await fetch(url);
  if (!res.ok) return { name: "My location", lat, lon };
  const body = (await res.json()) as { results?: GeoHit[] };
  const r = body.results?.[0];
  if (!r) return { name: "My location", lat, lon };
  return {
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    region: r.admin1 ?? r.country,
  };
}

export function featuredByFlyway(): { id: FlywayId; label: string; spots: Place[] }[] {
  const groups: Record<FlywayId, Place[]> = {
    pacific: [],
    central: [],
    mississippi: [],
    atlantic: [],
  };
  for (const spot of FEATURED_SPOTS) {
    groups[detectFlyway(spot.lon)].push(spot);
  }
  return (["pacific", "central", "mississippi", "atlantic"] as FlywayId[]).map((id) => ({
    id,
    label: FLYWAY_META[id].name,
    spots: groups[id],
  }));
}
