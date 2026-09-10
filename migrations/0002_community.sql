-- Hunter profiles and field reports for the lodge.

create table if not exists hunter_profiles (
  user_id      text primary key,
  handle       text not null,
  display_name text not null,
  home_flyway  text not null,
  home_state   text not null,
  home_city    text not null,
  bio          text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index if not exists hunter_profiles_handle_idx
  on hunter_profiles (lower(handle));

create table if not exists field_reports (
  id         serial primary key,
  user_id    text not null,
  flyway     text not null,
  state      text not null,
  city       text not null,
  species    text not null default '',
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists field_reports_place_idx
  on field_reports (flyway, state, city, created_at desc);

create index if not exists field_reports_user_idx
  on field_reports (user_id, created_at desc);
