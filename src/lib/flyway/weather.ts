import type { OpenMeteoForecast } from "./types";

const FORECAST_VARS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "visibility",
  "is_day",
].join(",");

const HOURLY_VARS = [
  "temperature_2m",
  "precipitation_probability",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "visibility",
  "is_day",
].join(",");

const DAILY_VARS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_direction_10m_dominant",
  "wind_gusts_10m_max",
  "sunrise",
  "sunset",
  "cloud_cover_mean",
].join(",");

export function cardinalFromDeg(deg: number): string {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16] ?? "N";
}

export function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorms";
  return "Mixed";
}

export function hpaToInHg(hpa: number): number {
  return hpa * 0.02953;
}

export function isNortherly(deg: number): boolean {
  const d = ((deg % 360) + 360) % 360;
  return d >= 292.5 || d <= 67.5;
}

export function isSoutherly(deg: number): boolean {
  const d = ((deg % 360) + 360) % 360;
  return d >= 112.5 && d <= 247.5;
}

export async function fetchForecast(lat: number, lon: number): Promise<OpenMeteoForecast> {
  const rows = await fetchForecasts([{ lat, lon }]);
  const first = rows[0];
  if (!first) throw new Error("Weather service returned no data");
  return first;
}

export async function fetchForecasts(
  points: { lat: number; lon: number }[],
): Promise<OpenMeteoForecast[]> {
  if (points.length === 0) return [];
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", points.map((p) => p.lat.toFixed(4)).join(","));
  url.searchParams.set("longitude", points.map((p) => p.lon.toFixed(4)).join(","));
  url.searchParams.set("current", FORECAST_VARS);
  url.searchParams.set("hourly", HOURLY_VARS);
  url.searchParams.set("daily", DAILY_VARS);
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("past_days", "2");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");

  const json = await fetchJsonWithRetry(url);
  if (Array.isArray(json)) return json as OpenMeteoForecast[];
  return [json as OpenMeteoForecast];
}

async function fetchJsonWithRetry(url: URL): Promise<unknown> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url.toString(), {
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
      });
      if (res.status === 429) {
        lastError = new Error("Weather desk is busy — try again in a moment.");
        await sleep(2000 * (attempt + 1));
        continue;
      }
      if (!res.ok) {
        throw new Error(`Weather service returned ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        lastError = new Error("Weather request timed out");
      } else if (err instanceof Error) {
        lastError = err;
      } else {
        lastError = new Error("Weather fetch failed");
      }
      if (attempt === 2) break;
      await sleep(800 * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError ?? new Error("Weather fetch failed");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function hoursAgoIndex(times: string[], currentIso: string, hours: number): number {
  const t = Date.parse(currentIso) - hours * 3600_000;
  let best = 0;
  let bestDelta = Infinity;
  for (let i = 0; i < times.length; i++) {
    const delta = Math.abs(Date.parse(times[i] ?? currentIso) - t);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  return best;
}

export function formatClock(iso: string): string {
  const raw = iso.slice(11, 16);
  const [hStr, min] = raw.split(":");
  const h = Number(hStr);
  const am = h < 12;
  const h12 = h % 12 || 12;
  return `${h12}:${min} ${am ? "a.m." : "p.m."}`;
}

export function addMinutes(iso: string, minutes: number): string {
  const [date, timePart] = iso.split("T");
  const [hStr, minStr] = (timePart ?? "00:00").slice(0, 5).split(":");
  const dayMins = 24 * 60;
  let total = Number(hStr) * 60 + Number(minStr) + minutes;
  total = ((total % dayMins) + dayMins) % dayMins;
  const hour = Math.floor(total / 60);
  const mm = total % 60;
  return `${date}T${String(hour).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function dateLabel(isoDate: string, todayIso: string): string {
  if (isoDate === todayIso) return "Today";
  const t = Date.parse(`${isoDate}T12:00:00`);
  const n = Date.parse(`${todayIso}T12:00:00`);
  if (t - n === 86400000) return "Tomorrow";
  return weekday(isoDate);
}

export function weekday(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function longDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function dayOfYear(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d);
  const start = new Date(y, 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

export function metersToMiles(m: number): number {
  return m / 1609.344;
}
