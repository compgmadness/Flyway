import type { FlywayId } from "./types";

export type HunterProfile = {
  handle: string;
  displayName: string;
  homeFlyway: FlywayId;
  homeState: string;
  homeCity: string;
  bio: string;
  avatarUrl: string;
};

export type FieldReport = {
  id: number;
  handle: string;
  displayName: string;
  avatarUrl: string;
  flyway: FlywayId;
  state: string;
  city: string;
  species: string;
  body: string;
  photoUrl: string;
  createdAtMs: number;
};
