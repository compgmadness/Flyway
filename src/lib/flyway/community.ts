import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { FlywayId } from "./types";
import type { FieldReport, HunterProfile } from "./community-types";
import { AVATAR_MAX_CHARS, PHOTO_MAX_CHARS, parseImageDataUrl } from "./photo";

export type { FieldReport, HunterProfile };

const FLYWAYS: FlywayId[] = ["pacific", "central", "mississippi", "atlantic"];

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function parseFlyway(value: unknown): FlywayId {
  if (typeof value === "string" && FLYWAYS.includes(value as FlywayId)) {
    return value as FlywayId;
  }
  throw new Error("Unknown flyway");
}

function parseHandle(value: unknown): string {
  const handle = clean(value, 20).toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(handle)) {
    throw new Error("Handle must be 3–20 letters, numbers, or underscores.");
  }
  return handle;
}

export const listReports = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    return {
      flyway: parseFlyway(o.flyway),
      state: clean(o.state, 8).toUpperCase(),
      city: clean(o.city, 48),
    };
  })
  .handler(async ({ data }): Promise<FieldReport[]> => {
    const db = await import("./community-db.server");
    return db.fetchReports(data);
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<HunterProfile | null> => {
    const db = await import("./community-db.server");
    return db.fetchProfile(context.userId);
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const displayName = clean(o.displayName, 32);
    if (displayName.length < 2) throw new Error("Give a name the lodge can call you.");
    const homeCity = clean(o.homeCity, 48);
    if (homeCity.length < 2) throw new Error("City is required.");
    const homeState = clean(o.homeState, 8).toUpperCase();
    if (homeState.length !== 2) throw new Error("Pick a state.");
    return {
      handle: parseHandle(o.handle),
      displayName,
      homeFlyway: parseFlyway(o.homeFlyway),
      homeState,
      homeCity,
      bio: clean(o.bio, 160),
      avatarUrl: parseImageDataUrl(o.avatarUrl, AVATAR_MAX_CHARS),
    };
  })
  .handler(async ({ context, data }) => {
    const db = await import("./community-db.server");
    return db.upsertProfile(context.userId, data);
  });

export const createReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const city = clean(o.city, 48);
    if (city.length < 2) throw new Error("City is required.");
    const state = clean(o.state, 8).toUpperCase();
    if (state.length !== 2) throw new Error("Pick a state.");
    const body = clean(o.body, 500);
    if (body.length < 8) throw new Error("Tell the lodge a little more.");
    return {
      flyway: parseFlyway(o.flyway),
      state,
      city,
      species: clean(o.species, 40),
      body,
      photoUrl: parseImageDataUrl(o.photoUrl, PHOTO_MAX_CHARS),
    };
  })
  .handler(async ({ context, data }) => {
    const db = await import("./community-db.server");
    return db.insertReport(context.userId, data);
  });

export const deleteReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const id = typeof input === "number" ? input : Number((input as { id?: unknown })?.id);
    if (!Number.isInteger(id) || id < 1) throw new Error("Missing report");
    return id;
  })
  .handler(async ({ context, data: id }) => {
    const db = await import("./community-db.server");
    await db.removeReport(context.userId, id);
    return { ok: true as const };
  });
