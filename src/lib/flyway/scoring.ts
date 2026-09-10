import { detectFlyway, FLYWAY_META, milesBetween } from "./places";
import { migrationSeason, seasonalTimingScore, speciesForLocation } from "./species";
import type {
  DayForecast,
  HuntBrief,
  HuntRating,
  HuntWindow,
  OpenMeteoForecast,
  Place,
  PushLevel,
  ScoreFactor,
  StationSnap,
  WeatherNow,
} from "./types";
import {
  addMinutes,
  cardinalFromDeg,
  dateLabel,
  dayOfYear,
  formatClock,
  hpaToInHg,
  hoursAgoIndex,
  isNortherly,
  isSoutherly,
  longDate,
  metersToMiles,
  weatherLabel,
  weekday,
} from "./weather";

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

function moonInfo(isoDate: string): HuntBrief["moon"] {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d, 12));
  const synodic = 29.53058867;
  const known = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - known) / 86400000;
  const age = ((days % synodic) + synodic) % synodic;
  const illumination = (1 - Math.cos((2 * Math.PI * age) / synodic)) / 2;
  let phase = "Waxing crescent";
  if (age < 1.8) phase = "New moon";
  else if (age < 6.2) phase = "Waxing crescent";
  else if (age < 9.6) phase = "First quarter";
  else if (age < 13.1) phase = "Waxing gibbous";
  else if (age < 16.6) phase = "Full moon";
  else if (age < 20.1) phase = "Waning gibbous";
  else if (age < 23.6) phase = "Last quarter";
  else if (age < 27.7) phase = "Waning crescent";
  else phase = "New moon";

  let huntingNote = "A quiet moon. Morning flights should be honest.";
  if (illumination >= 0.85) {
    huntingNote =
      "Bright moon — birds may feed at night and sit later. Plan a patient, late morning.";
  } else if (illumination <= 0.15) {
    huntingNote = "Dark moon. Dawn flights tend to be concentrated and short.";
  }
  return { phase, illumination, huntingNote };
}

function isFall(day: number): boolean {
  return day >= 213 || day < 50;
}

function pressureScore(change24: number, change48: number): { score: number; detail: string } {
  const priorFall = change48 <= -5 && change24 >= 1;

  if (priorFall) {
    return {
      score: 22,
      detail: `Post-frontal: the glass fell ${Math.abs(change48).toFixed(0)} hPa over two days and is rising. Birds that rode the front are on the water.`,
    };
  }
  if (change24 <= -12) {
    return {
      score: 24,
      detail: `A hard drop in the glass (${change24.toFixed(1)} hPa / 24h). This is classic flight weather.`,
    };
  }
  if (change24 <= -8) {
    return {
      score: 20,
      detail: `Pressure down ${Math.abs(change24).toFixed(1)} hPa since yesterday. A front is in the machinery.`,
    };
  }
  if (change24 <= -4) {
    return {
      score: 16,
      detail: `The glass is easing off (${change24.toFixed(1)} hPa). Birds get restless on a falling barometer.`,
    };
  }
  if (change24 >= 3) {
    return {
      score: 8,
      detail: `Rising pressure (${change24.toFixed(1)} hPa). Stable air — birds that are here will sit unless the wind works.`,
    };
  }
  return {
    score: 10,
    detail: "Steady barometer. Look to wind and sky more than a front today.",
  };
}

function windScore(mph: number, dir: number, fall: boolean): { score: number; detail: string } {
  let score = 4;
  if (mph >= 8 && mph <= 16) score = 16;
  else if (mph >= 5 && mph < 8) score = 11;
  else if (mph > 16 && mph <= 22) score = 13;
  else if (mph > 22 && mph <= 28) score = 8;
  else if (mph > 28) score = 4;
  else score = 5;

  const follow = fall ? isNortherly(dir) : isSoutherly(dir);
  const against = fall ? isSoutherly(dir) : isNortherly(dir);
  if (follow) score = Math.min(16, score + 2);
  if (against) score = Math.max(3, score - 2);

  const card = cardinalFromDeg(dir);
  let detail = `${mph.toFixed(0)} mph ${card}.`;
  if (mph >= 8 && mph <= 18 && follow) {
    detail = `${mph.toFixed(0)} mph ${card} — following wind in the migration. Decoys will work.`;
  } else if (mph < 5) {
    detail = "Nearly calm. Bluebird risk if the sky is clear — birds sky-up and lock down.";
  } else if (mph > 25) {
    detail = `A gale at ${mph.toFixed(0)} mph ${card}. Birds hug cover; hunt the lee.`;
  } else if (against) {
    detail = `${mph.toFixed(0)} mph ${card} is in their face. Migration stalls; hunt birds already in.`;
  } else {
    detail = `${mph.toFixed(0)} mph ${card}. Enough air to move decoys.`;
  }
  return { score, detail };
}

function skyScore(
  cloud: number,
  code: number,
  precipIn: number,
): { score: number; detail: string } {
  const fog = code === 45 || code === 48;
  const heavy = (code >= 65 && code <= 67) || code >= 81 || code >= 95;
  const lightPrecip =
    (code >= 51 && code <= 63) || (code >= 71 && code <= 77) || code === 80;
  let score = 6;
  if (fog) score = 10;
  else if (heavy) score = 3;
  else if (lightPrecip) score = 11;
  else if (cloud >= 70) score = 12;
  else if (cloud >= 40) score = 9;
  else if (cloud < 20) score = 4;
  else score = 7;

  let detail = `${cloud.toFixed(0)}% cover.`;
  if (fog) detail = "Fog on the water. Birds crawl in; keep the spread tight.";
  else if (heavy) detail = "Hard precip. Most birds will sit this out.";
  else if (lightPrecip) detail = "Light rain or snow. Excellent working weather.";
  else if (cloud >= 70) detail = "Overcast keeps birds moving past sunrise.";
  else if (cloud < 20) detail = "Bluebird sky. Expect a short dawn flight, then lock-down.";
  if (precipIn >= 0.15 && !heavy) detail += " Ground is wet — sheet water is in play.";
  return { score, detail };
}

function tempScore(
  tempF: number,
  drop24: number,
  minF: number,
): { score: number; detail: string } {
  let score = 6;
  if (drop24 >= 12) score = 14;
  else if (drop24 >= 7) score = 12;
  else if (drop24 >= 4) score = 10;
  else if (tempF >= 20 && tempF <= 42) score = 9;
  else if (tempF > 62) score = 3;
  else if (tempF < 10) score = 7;
  else score = 6;

  if (minF <= 28) score = Math.min(14, score + 1);

  let detail = `${tempF.toFixed(0)}° now.`;
  if (drop24 >= 8) {
    detail = `Down ${drop24.toFixed(0)}° in 24 hours. Cold air is the switch that moves ducks.`;
  } else if (minF <= 28) {
    detail = `Overnight low near ${minF.toFixed(0)}°. Ice will start to steal water; birds concentrate.`;
  } else if (tempF > 62) {
    detail = "Warm for waterfowl. Migration stalls and birds loaf.";
  } else {
    detail = `${tempF.toFixed(0)}° — workable, but nothing dramatic on the thermometer.`;
  }
  return { score, detail };
}

function upstreamScore(
  stations: StationSnap[],
  fall: boolean,
): { score: number; level: PushLevel; detail: string } {
  if (stations.length === 0) {
    return {
      score: 4,
      level: "trickle",
      detail: "You’re near the top of this flyway. Birds are staging here or already south.",
    };
  }
  const nearest = stations[stations.length - 1];
  const farthest = stations[0];
  const freezeCount = stations.filter((s) => s.freezing).length;
  const northWind = stations.filter((s) =>
    fall ? isNortherly(s.windDir) : isSoutherly(s.windDir),
  ).length;
  const fallingGlass = stations.filter((s) => s.pressureChange24h <= -4).length;
  const coldest = Math.min(...stations.map((s) => s.tempF));

  let score = 3;
  if (freezeCount >= 2) score += 5;
  else if (freezeCount === 1) score += 3;
  if (northWind >= 2) score += 3;
  if (fallingGlass >= 1) score += 2;
  if (coldest <= 20) score += 2;
  score = clamp(score, 0, 12);

  let level: PushLevel = "trickle";
  if (score >= 11) level = "exodus";
  else if (score >= 8) level = "push";
  else if (score >= 5) level = "moving";
  else if (score >= 3) level = "trickle";
  else level = "stalled";

  const freezeBit =
    freezeCount > 0
      ? `${freezeCount} station${freezeCount > 1 ? "s" : ""} already at freezing.`
      : coldest > 55
        ? "The prairies are still warm — no freeze line yet."
        : `${farthest.name} sits at ${farthest.tempF.toFixed(0)}°.`;
  const windBit =
    northWind >= 2
      ? "Following wind is in the pipeline."
      : nearest
        ? `${nearest.windCardinal} wind at the next station upflyway.`
        : "";

  const detail = `${freezeBit} ${windBit}`.trim();
  return { score, level, detail };
}

function pushHeadline(level: PushLevel): string {
  switch (level) {
    case "exodus":
      return "A hard push is in the air";
    case "push":
      return "Birds should be riding this weather";
    case "moving":
      return "Some movement down the flyway";
    case "trickle":
      return "A trickle, not a dump";
    default:
      return "Migration looks stalled";
  }
}

function headlineFor(score: number, rating: HuntRating, level: PushLevel): string {
  if (score >= 80) return "As good as a weather hunt gets";
  if (rating === "Prime" && (level === "push" || level === "exodus")) {
    return "Cold air, falling glass, birds coming";
  }
  if (rating === "Prime") return "Prime morning if they’re in";
  if (rating === "Good") return "Weather is in the mix";
  if (rating === "Fair") return "Workable, not a pile";
  return "A tough sit unless you know a hole";
}

function buildNow(wx: OpenMeteoForecast): WeatherNow {
  const c = wx.current;
  const idx24 = hoursAgoIndex(wx.hourly.time, c.time, 24);
  const p24 = wx.hourly.pressure_msl[idx24] ?? c.pressure_msl;
  return {
    time: c.time,
    tempF: c.temperature_2m,
    feelsF: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    precipIn: c.precipitation,
    weatherCode: c.weather_code,
    weatherLabel: weatherLabel(c.weather_code),
    cloudCover: c.cloud_cover,
    pressureHpa: c.pressure_msl,
    pressureInHg: hpaToInHg(c.pressure_msl),
    pressureChange24h: c.pressure_msl - p24,
    windMph: c.wind_speed_10m,
    windGustMph: c.wind_gusts_10m,
    windDir: c.wind_direction_10m,
    windCardinal: cardinalFromDeg(c.wind_direction_10m),
    visibilityMi: metersToMiles(c.visibility),
    isDay: c.is_day === 1,
  };
}

function stationSnap(place: Place, from: Place, wx: OpenMeteoForecast): StationSnap {
  const now = wx.current;
  const idx24 = hoursAgoIndex(wx.hourly.time, now.time, 24);
  const p24 = wx.hourly.pressure_msl[idx24] ?? now.pressure_msl;
  const minToday =
    wx.daily.temperature_2m_min[wx.daily.time.indexOf(now.time.slice(0, 10))] ??
    now.temperature_2m;
  return {
    name: place.name,
    lat: place.lat,
    lon: place.lon,
    distanceMi: milesBetween(from, place),
    tempF: now.temperature_2m,
    windMph: now.wind_speed_10m,
    windDir: now.wind_direction_10m,
    windCardinal: cardinalFromDeg(now.wind_direction_10m),
    weatherLabel: weatherLabel(now.weather_code),
    freezing: minToday <= 32 || now.temperature_2m <= 32,
    precipIn: now.precipitation,
    pressureChange24h: now.pressure_msl - p24,
  };
}

function morningHourFor(wx: OpenMeteoForecast, date: string): number {
  const sunrise = wx.daily.sunrise[wx.daily.time.indexOf(date)];
  const target = sunrise ?? `${date}T07:00`;
  const stamp = target.slice(0, 13);
  const idx = wx.hourly.time.findIndex((t) => t.startsWith(stamp));
  if (idx >= 0) return idx;
  const fallback = wx.hourly.time.findIndex((t) => t.startsWith(date));
  return fallback >= 0 ? fallback : 0;
}

function scoreSlice(args: {
  windMph: number;
  windDir: number;
  cloud: number;
  code: number;
  precipIn: number;
  tempF: number;
  drop24: number;
  minF: number;
  change24: number;
  change48: number;
  fall: boolean;
  seasonal: number;
  upstream: number;
}): { value: number; factors: ScoreFactor[] } {
  const front = pressureScore(args.change24, args.change48);
  const wind = windScore(args.windMph, args.windDir, args.fall);
  const sky = skyScore(args.cloud, args.code, args.precipIn);
  const temp = tempScore(args.tempF, args.drop24, args.minF);
  const raw =
    front.score + wind.score + sky.score + temp.score + args.seasonal + args.upstream;
  const value = clamp(Math.round(raw), 0, 100);
  const factors: ScoreFactor[] = [
    { id: "front", label: "Front / glass", score: front.score, max: 24, detail: front.detail },
    { id: "wind", label: "Wind", score: wind.score, max: 16, detail: wind.detail },
    { id: "sky", label: "Sky & precip", score: sky.score, max: 12, detail: sky.detail },
    { id: "temp", label: "Temperature", score: temp.score, max: 14, detail: temp.detail },
    { id: "season", label: "Season timing", score: args.seasonal, max: 22, detail: "" },
    { id: "north", label: "Upflyway weather", score: args.upstream, max: 12, detail: "" },
  ];
  return { value, factors };
}

export function buildBrief(
  place: Place,
  local: OpenMeteoForecast,
  upstreamWx: { place: Place; wx: OpenMeteoForecast }[],
): HuntBrief {
  const flywayId = detectFlyway(place.lon);
  const flyway = {
    id: flywayId,
    name: FLYWAY_META[flywayId].name,
    blurb: FLYWAY_META[flywayId].blurb,
  };
  const now = buildNow(local);
  const today = now.time.slice(0, 10);
  const doy = dayOfYear(today);
  const fall = isFall(doy);
  const species = speciesForLocation({ flyway: flywayId, lat: place.lat, dayOfYear: doy });
  const seasonal = seasonalTimingScore(species);

  const idx48 = hoursAgoIndex(local.hourly.time, now.time, 48);
  const idx24 = hoursAgoIndex(local.hourly.time, now.time, 24);
  const change48 = now.pressureHpa - (local.hourly.pressure_msl[idx48] ?? now.pressureHpa);
  const drop24 = (local.hourly.temperature_2m[idx24] ?? now.tempF) - now.tempF;
  const todayIdx = local.daily.time.indexOf(today);
  const minF = local.daily.temperature_2m_min[todayIdx] ?? now.tempF;

  const stations = upstreamWx.map((u) => stationSnap(u.place, place, u.wx));
  const up = upstreamScore(stations, fall);

  const slice = scoreSlice({
    windMph: now.windMph,
    windDir: now.windDir,
    cloud: now.cloudCover,
    code: now.weatherCode,
    precipIn: now.precipIn,
    tempF: now.tempF,
    drop24,
    minF,
    change24: now.pressureChange24h,
    change48,
    fall,
    seasonal: seasonal.score,
    upstream: up.score,
  });
  slice.factors = slice.factors.map((f) => {
    if (f.id === "season") return { ...f, detail: seasonal.detail };
    if (f.id === "north") return { ...f, detail: up.detail };
    return f;
  });

  const moon = moonInfo(today);
  let value = slice.value;
  if (moon.illumination >= 0.85) value = clamp(value - 3, 0, 100);
  if (moon.illumination <= 0.15) value = clamp(value + 2, 0, 100);
  const rating = ratingFor(value);

  const headline = headlineFor(value, rating, up.level);
  const frontFactor = slice.factors.find((f) => f.id === "front");
  const summary = [seasonal.detail, frontFactor?.detail, up.detail]
    .filter(Boolean)
    .join(" ");

  const days: DayForecast[] = [];
  for (let i = 0; i < local.daily.time.length; i++) {
    const date = local.daily.time[i];
    if (!date || date < today) continue;
    const morn = morningHourFor(local, date);
    const windMph =
      local.hourly.wind_speed_10m[morn] ?? local.daily.wind_speed_10m_max[i] ?? 0;
    const windDir =
      local.hourly.wind_direction_10m[morn] ??
      local.daily.wind_direction_10m_dominant[i] ??
      0;
    const cloud = local.hourly.cloud_cover[morn] ?? local.daily.cloud_cover_mean[i] ?? 50;
    const code = local.hourly.weather_code[morn] ?? local.daily.weather_code[i] ?? 2;
    const precipIn = local.hourly.precipitation[morn] ?? 0;
    const tempF = local.hourly.temperature_2m[morn] ?? local.daily.temperature_2m_min[i] ?? 40;
    const pNow = local.hourly.pressure_msl[morn] ?? now.pressureHpa;
    const pY = local.hourly.pressure_msl[Math.max(0, morn - 24)] ?? pNow;
    const p2 = local.hourly.pressure_msl[Math.max(0, morn - 48)] ?? pNow;
    const tY = local.hourly.temperature_2m[Math.max(0, morn - 24)] ?? tempF;
    const daySlice = scoreSlice({
      windMph,
      windDir,
      cloud,
      code,
      precipIn,
      tempF,
      drop24: tY - tempF,
      minF: local.daily.temperature_2m_min[i] ?? tempF,
      change24: pNow - pY,
      change48: pNow - p2,
      fall,
      seasonal: seasonal.score,
      upstream: up.score,
    });
    const sunrise = local.daily.sunrise[i] ?? `${date}T07:00`;
    const sunset = local.daily.sunset[i] ?? `${date}T18:00`;
    const dayRating = ratingFor(daySlice.value);
    days.push({
      date,
      weekday: weekday(date),
      label: dateLabel(date, today),
      score: daySlice.value,
      rating: dayRating,
      tempMax: local.daily.temperature_2m_max[i] ?? tempF,
      tempMin: local.daily.temperature_2m_min[i] ?? tempF,
      windMph,
      windCardinal: cardinalFromDeg(windDir),
      precipChance: local.daily.precipitation_probability_max[i] ?? 0,
      weatherLabel: weatherLabel(code),
      sunrise: formatClock(sunrise),
      sunset: formatClock(sunset),
      legalAm: formatClock(addMinutes(sunrise, -30)),
      legalPm: formatClock(sunset),
      morningNote: daySlice.factors.find((f) => f.id === "front")?.detail ?? dayRating,
    });
    if (days.length >= 7) break;
  }

  const windows: HuntWindow[] = [];
  for (const day of days.slice(0, 3)) {
    windows.push({
      when: `${day.label} · ${day.legalAm}`,
      kind: "dawn",
      score: day.score,
      note: `${day.weatherLabel}, ${day.windCardinal} ${day.windMph.toFixed(0)} mph. Legal light ${day.legalAm}.`,
    });
    const duskScore = clamp(day.score - (day.weatherLabel === "Clear" ? 8 : 2), 0, 100);
    windows.push({
      when: `${day.label} · ${day.legalPm}`,
      kind: "dusk",
      score: duskScore,
      note: `Evening flight to ${day.legalPm}. ${day.weatherLabel}.`,
    });
  }

  let incomingDetail = up.detail;
  if (stations[0] && !up.detail.includes(stations[0].name)) {
    incomingDetail = `${stations[0].name} is ${stations[0].tempF.toFixed(0)}° with ${stations[0].windCardinal} wind. ${up.detail}`;
  }

  return {
    generatedAt: now.time,
    location: place,
    flyway,
    now,
    score: {
      value,
      rating,
      headline,
      summary,
      factors: slice.factors,
    },
    incoming: {
      level: up.level,
      headline: pushHeadline(up.level),
      detail: incomingDetail,
      stations,
    },
    days,
    species,
    windows,
    moon,
    season: { name: migrationSeason(doy), dayOfYear: doy },
  };
}

export function isIdealNorthPush(level: PushLevel): boolean {
  return level === "push" || level === "exodus";
}

export function scoreTone(rating: HuntRating): string {
  switch (rating) {
    case "Exceptional":
    case "Prime":
      return "text-hunt-prime";
    case "Good":
      return "text-hunt-good";
    case "Fair":
      return "text-hunt-fair";
    default:
      return "text-hunt-poor";
  }
}

export { longDate, ratingFor, pushHeadline };
