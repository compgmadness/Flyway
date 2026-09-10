import { isIdealNorthPush, pushHeadline } from "./scoring";
import type { HuntBrief, Place, PushLevel } from "./types";

const WATCH_KEY = "flyway:north-watch";
const COOLDOWN_MS = 8 * 60 * 60 * 1000;

export type NorthWatch = {
  enabled: boolean;
  lastAlertAt: number;
  lastLevel: PushLevel | null;
  lastFingerprint: string;
};

type NativeNotify = {
  enableWatch: (json: string) => void;
  disableWatch: () => void;
  notifyNow: (title: string, body: string) => void;
  markAlerted: (level: string) => void;
};

function nativeBridge(): NativeNotify | null {
  if (typeof window === "undefined") return null;
  const bridge = (window as Window & { FlywayNotify?: NativeNotify }).FlywayNotify;
  if (!bridge || typeof bridge.enableWatch !== "function") return null;
  return bridge;
}

export function loadNorthWatch(): NorthWatch {
  if (typeof window === "undefined") {
    return { enabled: false, lastAlertAt: 0, lastLevel: null, lastFingerprint: "" };
  }
  try {
    const raw = window.localStorage.getItem(WATCH_KEY);
    if (!raw) return { enabled: false, lastAlertAt: 0, lastLevel: null, lastFingerprint: "" };
    const parsed = JSON.parse(raw) as Partial<NorthWatch>;
    return {
      enabled: !!parsed.enabled,
      lastAlertAt: typeof parsed.lastAlertAt === "number" ? parsed.lastAlertAt : 0,
      lastLevel: parsed.lastLevel === "push" || parsed.lastLevel === "exodus" ? parsed.lastLevel : null,
      lastFingerprint: typeof parsed.lastFingerprint === "string" ? parsed.lastFingerprint : "",
    };
  } catch {
    return { enabled: false, lastAlertAt: 0, lastLevel: null, lastFingerprint: "" };
  }
}

function saveNorthWatch(watch: NorthWatch) {
  window.localStorage.setItem(WATCH_KEY, JSON.stringify(watch));
  window.dispatchEvent(new Event("flyway-watch-change"));
}

function fingerprint(brief: HuntBrief): string {
  const stations = brief.incoming.stations
    .map((s) => `${s.name}:${s.tempF.toFixed(0)}:${s.windCardinal}`)
    .join("|");
  return `${brief.now.time.slice(0, 10)}:${brief.incoming.level}:${stations}`;
}

export function pushAlertCopy(brief: HuntBrief): { title: string; body: string } {
  const north = brief.incoming.stations[0];
  const title =
    brief.incoming.level === "exodus"
      ? `Hard push toward ${brief.location.name}`
      : `Birds moving toward ${brief.location.name}`;
  const northBit = north
    ? `${north.name} is ${north.tempF.toFixed(0)}° with ${north.windCardinal} wind.`
    : pushHeadline(brief.incoming.level);
  return {
    title,
    body: `${northBit} ${brief.incoming.detail}`.replace(/\s+/g, " ").trim().slice(0, 220),
  };
}

function shouldAlert(brief: HuntBrief, watch: NorthWatch): boolean {
  if (!watch.enabled) return false;
  if (!isIdealNorthPush(brief.incoming.level)) return false;
  const print = fingerprint(brief);
  if (print === watch.lastFingerprint) return false;
  const rank = brief.incoming.level === "exodus" ? 2 : 1;
  const prev = watch.lastLevel === "exodus" ? 2 : watch.lastLevel === "push" ? 1 : 0;
  if (rank > prev) return true;
  return Date.now() - watch.lastAlertAt >= COOLDOWN_MS;
}

async function showNotification(title: string, body: string) {
  const native = nativeBridge();
  if (native?.notifyNow) {
    native.notifyNow(title, body);
    return;
  }
  const worker = typeof navigator !== "undefined" ? navigator.serviceWorker : undefined;
  if (worker?.controller) {
    worker.controller.postMessage({ type: "flyway-push", title, body });
    return;
  }
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body, tag: "flyway-north", silent: false });
  }
}

export async function ensureNotifyPermission(): Promise<boolean> {
  if (nativeBridge()) return true;
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function registerPushWorker() {
  if (typeof navigator === "undefined" || !navigator.serviceWorker) return;
  if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;
  try {
    await navigator.serviceWorker.register("/flyway-sw.js");
  } catch {
    /* preview hosts may block SW */
  }
}

function payloadForNative(place: Place, brief: HuntBrief): string {
  return JSON.stringify({
    name: place.name,
    lat: place.lat,
    lon: place.lon,
    stations: brief.incoming.stations.map((s) => ({
      name: s.name,
      lat: s.lat,
      lon: s.lon,
    })),
  });
}

export async function setNorthWatchEnabled(
  enabled: boolean,
  brief: HuntBrief | null,
): Promise<NorthWatch> {
  const current = loadNorthWatch();
  const next: NorthWatch = { ...current, enabled };
  saveNorthWatch(next);
  const native = nativeBridge();
  if (!enabled) {
    native?.disableWatch();
    return next;
  }
  if (brief) native?.enableWatch(payloadForNative(brief.location, brief));
  void registerPushWorker();
  if (brief) await considerNorthPush(brief);
  return loadNorthWatch();
}

export function syncNativeWatch(brief: HuntBrief) {
  const watch = loadNorthWatch();
  if (!watch.enabled) return;
  nativeBridge()?.enableWatch(payloadForNative(brief.location, brief));
}

export async function considerNorthPush(brief: HuntBrief): Promise<boolean> {
  const watch = loadNorthWatch();
  if (!shouldAlert(brief, watch)) return false;
  const { title, body } = pushAlertCopy(brief);
  await showNotification(title, body);
  const next: NorthWatch = {
    enabled: true,
    lastAlertAt: Date.now(),
    lastLevel: brief.incoming.level,
    lastFingerprint: fingerprint(brief),
  };
  saveNorthWatch(next);
  nativeBridge()?.markAlerted(brief.incoming.level);
  return true;
}
