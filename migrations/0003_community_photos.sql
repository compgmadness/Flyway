-- Profile pictures and field-report photos for the lodge.

alter table hunter_profiles
  add column if not exists avatar_url text not null default '';

alter table field_reports
  add column if not exists photo_url text not null default '';
