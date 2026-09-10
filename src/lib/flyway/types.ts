export type FlywayId = "pacific" | "central" | "mississippi" | "atlantic";

export type HuntRating = "Poor" | "Fair" | "Good" | "Prime" | "Exceptional";

export type PushLevel = "stalled" | "trickle" | "moving" | "push" | "exodus";

export type SpeciesStatus = "not_yet" | "arriving" | "peak" | "holding" | "past" | "local";

export type SpeciesGroup = "dabbler" | "diver" | "goose";

export type Place = {
  name: string;
  lat: number;
  lon: number;
  region?: string;
};

export type WeatherNow = {
  time: string;
  tempF: number;
  feelsF: number;
  humidity: number;
  precipIn: number;
  weatherCode: number;
  weatherLabel: string;
  cloudCover: number;
  pressureHpa: number;
  pressureInHg: number;
  pressureChange24h: number;
  windMph: number;
  windGustMph: number;
  windDir: number;
  windCardinal: string;
  visibilityMi: number;
  isDay: boolean;
};

export type StationSnap = {
  name: string;
  lat: number;
  lon: number;
  distanceMi: number;
  tempF: number;
  windMph: number;
  windDir: number;
  windCardinal: string;
  weatherLabel: string;
  freezing: boolean;
  precipIn: number;
  pressureChange24h: number;
};

export type ScoreFactor = {
  id: string;
  label: string;
  score: number;
  max: number;
  detail: string;
};

export type DayForecast = {
  date: string;
  weekday: string;
  label: string;
  score: number;
  rating: HuntRating;
  tempMax: number;
  tempMin: number;
  windMph: number;
  windCardinal: string;
  precipChance: number;
  weatherLabel: string;
  sunrise: string;
  sunset: string;
  legalAm: string;
  legalPm: string;
  morningNote: string;
};

export type SpeciesCard = {
  id: string;
  name: string;
  group: SpeciesGroup;
  status: SpeciesStatus;
  statusLabel: string;
  note: string;
  inPlay: boolean;
};

export type HuntWindow = {
  when: string;
  kind: "dawn" | "dusk";
  score: number;
  note: string;
};

export type HuntBrief = {
  generatedAt: string;
  location: Place;
  flyway: { id: FlywayId; name: string; blurb: string };
  now: WeatherNow;
  score: {
    value: number;
    rating: HuntRating;
    headline: string;
    summary: string;
    factors: ScoreFactor[];
  };
  incoming: {
    level: PushLevel;
    headline: string;
    detail: string;
    stations: StationSnap[];
  };
  days: DayForecast[];
  species: SpeciesCard[];
  windows: HuntWindow[];
  moon: { phase: string; illumination: number; huntingNote: string };
  season: { name: string; dayOfYear: number };
};

export type OpenMeteoForecast = {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    cloud_cover: number[];
    pressure_msl: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
    visibility: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    wind_gusts_10m_max: number[];
    sunrise: string[];
    sunset: string[];
    cloud_cover_mean: number[];
  };
};
