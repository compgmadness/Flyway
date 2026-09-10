export const PLAY_LISTING = {
  title: "Flyway: Waterfowl Hunt Brief",
  shortDescription:
    "Live sit score from weather north of you. Migration, Bag ID, and lodge reports.",
  fullDescription: `Flyway is a waterfowl hunting brief — not another map.

Pin your marsh. Flyway reads the weather on the stations north of you, scores the sit from 0 to 100, and tells you whether new birds should be riding a front, a north wind, and falling glass.

WHAT YOU GET
• Hunt odds for this morning and the next 7 days
• Upflyway stations (freeze line, wind, barometer)
• Species board shifted for your latitude — teal vs mallards vs geese
• Legal shooting light and moon
• Push alerts when the north lines up
• Bag ID: drake and hen field marks
• The lodge: hunter profiles, photos, and reports by flyway, state, and town

BUILT FOR DUCK HUNTERS
Open it Thursday night. Trust it at 4 a.m. Free core brief. Location is optional — use it only to pin a marsh. Weather comes from Open-Meteo. No ads.

NOT A LAND MAP
Flyway does not replace onX or Ducks Unlimited. It answers a different question: are they coming, and is the sit worth it?

Support and privacy: open Flyway in a browser and tap Get app, or visit the Privacy page in the app.`,
  category: "Sports",
  tags: ["hunting", "waterfowl", "weather", "migration", "ducks"],
  contentRating: "Everyone 10+ (complete the IARC questionnaire in Play Console — hunting theme, no graphic violence)",
  contactEmail: "Use the Play Console support email you own",
  dataSafety: [
    "Location (approximate/precise): optional, to pin a marsh and score weather. Not sold. Not used for ads.",
    "Photos: optional profile picture and lodge post photos. User-generated. Stored with your hunter profile / on-device on the phone pack.",
    "Personal info: display name, handle, home flyway / state / city, bio.",
    "App activity: field reports you choose to post.",
    "Notifications: optional push alerts for upflyway weather.",
    "Collected for app functionality. Encrypted in transit (HTTPS). Not sold. No advertising ID.",
  ],
} as const;
