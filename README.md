# Flyway

Waterfowl hunting brief: sit score from weather north of you, migration board, Bag ID, and the lodge.

Live brief pins a marsh, reads Open-Meteo on upflyway stations, and scores the sit 0–100. Bag ID covers drake and hen field marks. Community posts are scoped by flyway, state, and town.

## Stack

TanStack Start, Tailwind, Better Auth, Postgres (Neon / PGLite in preview). Android is a signed WebView pack (`app.flyway.brief`) targeting API 36 for Play.

## Run

```bash
npm install
npm run dev
```

## Android

Sideload APK and Play `.aab` are built from `scripts/build-apk.sh` and `scripts/build-aab.sh`. Upload keys are not in this repo — keep `android/play-upload.keystore` local.

Package: `app.flyway.brief` · version 2.6

## Privacy

See `/privacy` in the running app.
