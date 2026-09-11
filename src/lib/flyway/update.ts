import { persistReadJson, persistWriteJson } from "./community-local";

export const APP_VERSION = "2.6";
export const UPDATE_TAG = "v2.6";
export const UPDATE_APK_URL =
  "https://github.com/compgmadness/Flyway/releases/download/v2.6/flyway.apk";
export const UPDATE_HEADLINE = "Flyway 2.6 is out";
export const UPDATE_BODY =
  "Nationwide marshes, U.S. Bag ID, and harvest-fed flyway. Pin any state — not just Colorado.";

const PINGED_KEY = "flyway-update-pinged";
const DISMISS_KEY = "flyway-update-dismissed";

type NativeNotify = { notifyNow: (title: string, body: string) => void };

function nativeNotify(): NativeNotify | null {
  if (typeof window === "undefined") return null;
  const bridge = (window as Window & { FlywayNotify?: NativeNotify }).FlywayNotify;
  if (!bridge || typeof bridge.notifyNow !== "function") return null;
  return bridge;
}

export function isUpdateDismissed(): boolean {
  return persistReadJson<string>(DISMISS_KEY, "") === APP_VERSION;
}

export function dismissUpdate() {
  persistWriteJson(DISMISS_KEY, APP_VERSION);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("flyway-update-change"));
  }
}

function alreadyPinged(): boolean {
  return persistReadJson<string>(PINGED_KEY, "") === APP_VERSION;
}

function markPinged() {
  persistWriteJson(PINGED_KEY, APP_VERSION);
}

export async function pingAllUsers(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (alreadyPinged()) return false;
  markPinged();

  const native = nativeNotify();
  if (native) {
    native.notifyNow(UPDATE_HEADLINE, UPDATE_BODY);
    return true;
  }

  try {
    if (typeof Notification === "undefined") return false;
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") return false;
    new Notification(UPDATE_HEADLINE, {
      body: UPDATE_BODY,
      tag: `flyway-update-${APP_VERSION}`,
    });
    return true;
  } catch {
    return false;
  }
}
