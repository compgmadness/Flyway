import { r as getSql } from "./db-DNagSx9C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-db.server-Babv8bjy.js
var FLYWAYS = /* @__PURE__ */ new Set([
	"pacific",
	"central",
	"mississippi",
	"atlantic"
]);
function asFlyway(value) {
	return FLYWAYS.has(value) ? value : "central";
}
function mapProfile(row) {
	return {
		handle: row.handle,
		displayName: row.display_name,
		homeFlyway: asFlyway(row.home_flyway),
		homeState: row.home_state,
		homeCity: row.home_city,
		bio: row.bio
	};
}
function mapReport(row) {
	return {
		id: row.id,
		handle: row.handle,
		displayName: row.display_name,
		flyway: asFlyway(row.flyway),
		state: row.state,
		city: row.city,
		species: row.species,
		body: row.body,
		createdAtMs: row.created_at_ms
	};
}
async function fetchProfile(userId) {
	const rows = await (await getSql())`
    select handle, display_name, home_flyway, home_state, home_city, bio
    from hunter_profiles
    where user_id = ${userId}
    limit 1
  `;
	return rows[0] ? mapProfile(rows[0]) : null;
}
async function upsertProfile(userId, profile) {
	const sql = await getSql();
	try {
		await sql`
      insert into hunter_profiles (
        user_id, handle, display_name, home_flyway, home_state, home_city, bio, updated_at
      ) values (
        ${userId},
        ${profile.handle},
        ${profile.displayName},
        ${profile.homeFlyway},
        ${profile.homeState},
        ${profile.homeCity},
        ${profile.bio},
        now()
      )
      on conflict (user_id) do update set
        handle = excluded.handle,
        display_name = excluded.display_name,
        home_flyway = excluded.home_flyway,
        home_state = excluded.home_state,
        home_city = excluded.home_city,
        bio = excluded.bio,
        updated_at = now()
    `;
	} catch (err) {
		const message = err instanceof Error ? err.message.toLowerCase() : "";
		if (message.includes("unique") || message.includes("duplicate")) return {
			ok: false,
			error: "That handle is already on the wall."
		};
		throw err;
	}
	return {
		ok: true,
		profile
	};
}
async function fetchReports(filter) {
	const sql = await getSql();
	const state = filter.state.trim();
	const city = filter.city.trim().toLowerCase();
	return (await sql`
    select
      r.id,
      p.handle,
      p.display_name,
      r.flyway,
      r.state,
      r.city,
      r.species,
      r.body,
      (extract(epoch from r.created_at) * 1000)::bigint as created_at_ms
    from field_reports r
    join hunter_profiles p on p.user_id = r.user_id
    where r.flyway = ${filter.flyway}
      and (${state} = '' or r.state = ${state})
      and (${city} = '' or lower(r.city) = ${city})
    order by r.created_at desc
    limit 80
  `).map(mapReport);
}
async function insertReport(userId, input) {
	if (!await fetchProfile(userId)) return {
		ok: false,
		error: "Cut a handle before you post."
	};
	await (await getSql())`
    insert into field_reports (user_id, flyway, state, city, species, body)
    values (
      ${userId},
      ${input.flyway},
      ${input.state},
      ${input.city},
      ${input.species},
      ${input.body}
    )
  `;
	return { ok: true };
}
async function removeReport(userId, id) {
	await (await getSql())`delete from field_reports where id = ${id} and user_id = ${userId}`;
}
//#endregion
export { fetchProfile, fetchReports, insertReport, removeReport, upsertProfile };
