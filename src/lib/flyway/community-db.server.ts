import { getSql } from "@/lib/db";
import type { FlywayId } from "./types";
import type { FieldReport, HunterProfile } from "./community-types";

type ProfileRow = {
  handle: string;
  display_name: string;
  home_flyway: string;
  home_state: string;
  home_city: string;
  bio: string;
  avatar_url: string;
};

type ReportRow = {
  id: number;
  handle: string;
  display_name: string;
  avatar_url: string;
  flyway: string;
  state: string;
  city: string;
  species: string;
  body: string;
  photo_url: string;
  created_at_ms: number;
};

const FLYWAYS = new Set(["pacific", "central", "mississippi", "atlantic"]);

function asFlyway(value: string): FlywayId {
  return FLYWAYS.has(value) ? (value as FlywayId) : "central";
}

function mapProfile(row: ProfileRow): HunterProfile {
  return {
    handle: row.handle,
    displayName: row.display_name,
    homeFlyway: asFlyway(row.home_flyway),
    homeState: row.home_state,
    homeCity: row.home_city,
    bio: row.bio,
    avatarUrl: row.avatar_url ?? "",
  };
}

function mapReport(row: ReportRow): FieldReport {
  return {
    id: row.id,
    handle: row.handle,
    displayName: row.display_name,
    avatarUrl: row.avatar_url ?? "",
    flyway: asFlyway(row.flyway),
    state: row.state,
    city: row.city,
    species: row.species,
    body: row.body,
    photoUrl: row.photo_url ?? "",
    createdAtMs: row.created_at_ms,
  };
}

export async function fetchProfile(userId: string): Promise<HunterProfile | null> {
  const sql = await getSql();
  const rows = await sql<ProfileRow>`
    select handle, display_name, home_flyway, home_state, home_city, bio, avatar_url
    from hunter_profiles
    where user_id = ${userId}
    limit 1
  `;
  return rows[0] ? mapProfile(rows[0]) : null;
}

export async function upsertProfile(
  userId: string,
  profile: HunterProfile,
): Promise<{ ok: true; profile: HunterProfile } | { ok: false; error: string }> {
  const sql = await getSql();
  try {
    await sql`
      insert into hunter_profiles (
        user_id, handle, display_name, home_flyway, home_state, home_city, bio, avatar_url, updated_at
      ) values (
        ${userId},
        ${profile.handle},
        ${profile.displayName},
        ${profile.homeFlyway},
        ${profile.homeState},
        ${profile.homeCity},
        ${profile.bio},
        ${profile.avatarUrl},
        now()
      )
      on conflict (user_id) do update set
        handle = excluded.handle,
        display_name = excluded.display_name,
        home_flyway = excluded.home_flyway,
        home_state = excluded.home_state,
        home_city = excluded.home_city,
        bio = excluded.bio,
        avatar_url = excluded.avatar_url,
        updated_at = now()
    `;
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : "";
    if (message.includes("unique") || message.includes("duplicate")) {
      return { ok: false, error: "That handle is already on the wall." };
    }
    throw err;
  }
  return { ok: true, profile };
}

export async function fetchReports(filter: {
  flyway: FlywayId;
  state: string;
  city: string;
}): Promise<FieldReport[]> {
  const sql = await getSql();
  const state = filter.state.trim();
  const city = filter.city.trim().toLowerCase();
  const rows = await sql<ReportRow>`
    select
      r.id,
      p.handle,
      p.display_name,
      p.avatar_url,
      r.flyway,
      r.state,
      r.city,
      r.species,
      r.body,
      r.photo_url,
      (extract(epoch from r.created_at) * 1000)::bigint as created_at_ms
    from field_reports r
    join hunter_profiles p on p.user_id = r.user_id
    where r.flyway = ${filter.flyway}
      and (${state} = '' or r.state = ${state})
      and (${city} = '' or lower(r.city) = ${city})
    order by r.created_at desc
    limit 80
  `;
  return rows.map(mapReport);
}

export async function insertReport(
  userId: string,
  input: {
    flyway: FlywayId;
    state: string;
    city: string;
    species: string;
    body: string;
    photoUrl: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const profile = await fetchProfile(userId);
  if (!profile) {
    return { ok: false, error: "Cut a handle before you post." };
  }
  const sql = await getSql();
  await sql`
    insert into field_reports (user_id, flyway, state, city, species, body, photo_url)
    values (
      ${userId},
      ${input.flyway},
      ${input.state},
      ${input.city},
      ${input.species},
      ${input.body},
      ${input.photoUrl}
    )
  `;
  return { ok: true };
}

export async function removeReport(userId: string, id: number): Promise<void> {
  const sql = await getSql();
  await sql`delete from field_reports where id = ${id} and user_id = ${userId}`;
}
