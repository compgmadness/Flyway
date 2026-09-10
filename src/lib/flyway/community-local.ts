import type { FieldReport, HunterProfile } from "./community-types";
import type { FlywayId } from "./types";

const PROFILE_KEY = "flyway-hunter-profile";
const REPORTS_KEY = "flyway-field-reports";
const PAGE_KEY = "flyway-last-page";
const ACCOUNTS_KEY = "flyway-accounts";
const SESSION_KEY = "flyway-session-handle";
const BLOB_PREFIX = "flyway-blob-";

type Kv = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

type NativeBridge = {
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
};

type LocalAccount = {
  profile: HunterProfile;
  secret: string;
};

type AccountBook = Record<string, LocalAccount>;

function bootMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const boot = (window as Window & { __FLYWAY_BOOT__?: Record<string, string> }).__FLYWAY_BOOT__;
  if (!boot || typeof boot !== "object") return {};
  return boot;
}

function nativeStore(): Kv | null {
  if (typeof window === "undefined") return null;
  const bridge = (window as Window & { FlywayStore?: NativeBridge }).FlywayStore;
  if (!bridge || typeof bridge.getItem !== "function" || typeof bridge.setItem !== "function") {
    return null;
  }
  return {
    getItem(key) {
      try {
        const value = bridge.getItem(key);
        if (value == null || value === "" || value === "null") return null;
        return String(value);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        bridge.setItem(key, value);
      } catch {
        // Native write can fail if the activity is gone; web storage still tries.
      }
    },
  };
}

function webStore(): Kv | null {
  if (typeof window === "undefined") return null;
  try {
    const { localStorage } = window;
    localStorage.getItem(PROFILE_KEY);
    return localStorage;
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  const boot = bootMap()[key];
  if (boot != null && boot !== "" && boot !== "null") return String(boot);
  const native = nativeStore();
  const web = webStore();
  const fromNative = native?.getItem(key) ?? null;
  if (fromNative) {
    bootMap()[key] = fromNative;
    if (web && web.getItem(key) !== fromNative) web.setItem(key, fromNative);
    return fromNative;
  }
  const fromWeb = web?.getItem(key) ?? null;
  if (fromWeb) {
    bootMap()[key] = fromWeb;
    if (native) native.setItem(key, fromWeb);
    return fromWeb;
  }
  return null;
}

function readJson<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  const payload = JSON.stringify(value);
  bootMap()[key] = payload;
  nativeStore()?.setItem(key, payload);
  webStore()?.setItem(key, payload);
}

function writeRaw(key: string, value: string) {
  bootMap()[key] = value;
  nativeStore()?.setItem(key, value);
  webStore()?.setItem(key, value);
}

function normalizeProfile(row: HunterProfile | null): HunterProfile | null {
  if (!row || typeof row.handle !== "string") return null;
  return {
    handle: row.handle,
    displayName: row.displayName ?? row.handle,
    homeFlyway: row.homeFlyway ?? "central",
    homeState: row.homeState ?? "CO",
    homeCity: row.homeCity ?? "",
    bio: row.bio ?? "",
    avatarUrl: row.avatarUrl ?? "",
  };
}

function hashSecret(handle: string, password: string): string {
  let hash = 5381;
  const input = `${handle.toLowerCase()}::${password}::flyway-lodge`;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function loadBook(): AccountBook {
  const rows = readJson<AccountBook>(ACCOUNTS_KEY, {});
  return rows && typeof rows === "object" ? rows : {};
}

function migrateLegacy() {
  const book = loadBook();
  const legacy = readJson<HunterProfile | null>(PROFILE_KEY, null);
  if (legacy && typeof legacy.handle === "string" && legacy.handle.length >= 3) {
    const handle = legacy.handle.toLowerCase();
    if (!book[handle]) {
      book[handle] = { profile: { ...legacy, handle }, secret: "" };
      writeJson(ACCOUNTS_KEY, book);
    }
    const session = readRaw(SESSION_KEY);
    if (!session) writeRaw(SESSION_KEY, handle);
  }
}

export function loadLastPage(): "brief" | "id" | "community" | null {
  const raw = readRaw(PAGE_KEY);
  if (raw === "brief" || raw === "id" || raw === "community") return raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as string) : "";
    if (parsed === "brief" || parsed === "id" || parsed === "community") return parsed;
  } catch {
    // plain string
  }
  return null;
}

export function saveLastPage(page: "brief" | "id" | "community") {
  writeRaw(PAGE_KEY, page);
}

export function hasLocalAccounts(): boolean {
  migrateLegacy();
  return Object.keys(loadBook()).length > 0;
}

export function loadLocalProfile(): HunterProfile | null {
  migrateLegacy();
  const handle = (readRaw(SESSION_KEY) ?? "").toLowerCase();
  if (!handle || handle === "signed-out") return null;
  const book = loadBook();
  return book[handle] ? normalizeProfile(book[handle].profile) : null;
}

export function saveLocalProfile(
  profile: HunterProfile,
): { ok: true } | { ok: false; error: string } {
  const handle = profile.handle.trim().toLowerCase();
  const next: HunterProfile = { ...profile, handle };
  writeJson(PROFILE_KEY, next);
  const book = loadBook();
  const existing = book[handle];
  book[handle] = { profile: next, secret: existing?.secret ?? "" };
  writeJson(ACCOUNTS_KEY, book);
  writeRaw(SESSION_KEY, handle);
  const roundTrip = loadLocalProfile();
  if (!roundTrip || roundTrip.handle !== handle) {
    return { ok: false, error: "Could not save your handle on this phone." };
  }
  return { ok: true };
}

export function registerLocalAccount(
  profile: HunterProfile,
  password: string,
): { ok: true; profile: HunterProfile } | { ok: false; error: string } {
  const handle = profile.handle.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
    return { ok: false, error: "Handle must be 3–20 letters, numbers, or underscores." };
  }
  if (password.trim().length < 4) {
    return { ok: false, error: "Password needs at least 4 characters." };
  }
  migrateLegacy();
  const book = loadBook();
  if (book[handle]?.secret) {
    return { ok: false, error: "That handle is already on this phone. Log in." };
  }
  const next: HunterProfile = { ...profile, handle };
  book[handle] = { profile: next, secret: hashSecret(handle, password) };
  writeJson(ACCOUNTS_KEY, book);
  writeJson(PROFILE_KEY, next);
  writeRaw(SESSION_KEY, handle);
  return { ok: true, profile: next };
}

export function loginLocalAccount(
  handleInput: string,
  password: string,
): { ok: true; profile: HunterProfile } | { ok: false; error: string } {
  migrateLegacy();
  const handle = handleInput.trim().toLowerCase();
  const book = loadBook();
  const row = book[handle];
  if (!row) return { ok: false, error: "No hunter with that handle on this phone." };
  if (!row.secret) {
    if (password.trim().length < 4) {
      return { ok: false, error: "Set a password of at least 4 characters." };
    }
    row.secret = hashSecret(handle, password);
    book[handle] = row;
    writeJson(ACCOUNTS_KEY, book);
  } else if (row.secret !== hashSecret(handle, password)) {
    return { ok: false, error: "Handle or password doesn’t match." };
  }
  writeJson(PROFILE_KEY, row.profile);
  writeRaw(SESSION_KEY, handle);
  const profile = normalizeProfile(row.profile);
  if (!profile) return { ok: false, error: "Could not open that handle." };
  return { ok: true, profile };
}

export function logoutLocalAccount() {
  writeRaw(SESSION_KEY, "signed-out");
}

function readReportRows(): FieldReport[] {
  const rows = readJson<FieldReport[]>(REPORTS_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

export function loadAllLocalReports(): FieldReport[] {
  return readReportRows().map((row) => {
    const pointer = row.photoUrl ?? "";
    const photo = pointer.startsWith(BLOB_PREFIX) ? (readRaw(pointer) ?? "") : pointer;
    return {
      ...row,
      avatarUrl: row.avatarUrl ?? "",
      photoUrl: photo && photo !== "null" ? photo : "",
    };
  });
}

export function loadLocalReports(filter: {
  flyway: FlywayId;
  state: string;
  city: string;
}): FieldReport[] {
  const state = filter.state.trim();
  const city = filter.city.trim().toLowerCase();
  return loadAllLocalReports()
    .filter((row) => row.flyway === filter.flyway)
    .filter((row) => !state || row.state === state)
    .filter((row) => !city || row.city.toLowerCase() === city)
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, 80);
}

export function addLocalReport(input: {
  profile: HunterProfile;
  flyway: FlywayId;
  state: string;
  city: string;
  species: string;
  body: string;
  photoUrl?: string;
}): { ok: true } | { ok: false; error: string } {
  const rows = readReportRows();
  const id = Date.now();
  const photo = input.photoUrl ?? "";
  if (photo) writeRaw(`${BLOB_PREFIX}${id}`, photo);
  rows.unshift({
    id,
    handle: input.profile.handle,
    displayName: input.profile.displayName,
    avatarUrl: input.profile.avatarUrl ?? "",
    flyway: input.flyway,
    state: input.state,
    city: input.city,
    species: input.species,
    body: input.body,
    photoUrl: photo ? `${BLOB_PREFIX}${id}` : "",
    createdAtMs: Date.now(),
  });
  writeJson(REPORTS_KEY, rows.slice(0, 200));
  return { ok: true };
}

export function removeLocalReport(id: number, handle: string) {
  writeRaw(`${BLOB_PREFIX}${id}`, "");
  writeJson(
    REPORTS_KEY,
    readReportRows().filter((row) => !(row.id === id && row.handle === handle)),
  );
}
