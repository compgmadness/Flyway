import { Link } from "@tanstack/react-router";
import { FlockMark } from "@/components/app-chrome";
import { PLAY_LISTING } from "@/lib/flyway/play-listing";
import type { ReactNode } from "react";

function LegalShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-border bg-bg pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <FlockMark />
          <div className="min-w-0">
            <p className="font-display text-lg leading-none text-fg">Flyway</p>
            <p className="mt-1 text-xs tracking-widest text-subtle uppercase">{kicker}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl leading-tight text-fg sm:text-4xl">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">{children}</div>
        <p className="mt-10 text-sm">
          <Link to="/" className="text-sage hover:underline">
            Back to the brief
          </Link>
        </p>
      </main>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell kicker="Legal" title="Privacy policy">
      <p>Last updated September 10, 2026.</p>
      <p>
        Flyway is a waterfowl hunting brief. This policy covers the website, the Android app, and
        the lodge. We do not sell your data. We do not run ads. We do not use an advertising ID.
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">What we collect</h2>
      <p>
        <strong className="text-fg">Marsh pin.</strong> If you choose a location (or allow the
        device to locate you), we use that latitude and longitude to fetch weather and upflyway
        stations. It stays on your device unless you share a sit link.
      </p>
      <p>
        <strong className="text-fg">Account (optional).</strong> To post in the lodge you create a
        handle, display name, home flyway / state / city, optional bio, and optional profile
        picture. Lodge posts may include a photo you attach.
      </p>
      <p>
        <strong className="text-fg">Weather.</strong> Forecasts come from Open-Meteo using the
        coordinates of your pin and corridor stations. We do not send your name to that service.
      </p>
      <p>
        <strong className="text-fg">Notifications (optional).</strong> If you turn on push alerts,
        the phone checks weather north of your pin on a schedule. You can turn this off in the brief.
      </p>
      <p>
        <strong className="text-fg">On the phone pack.</strong> Profile, session, and lodge photos
        are stored in app storage on that device so they survive closing the app.
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">What we do not do</h2>
      <p>
        No sale of personal information. No advertising networks. No tracking pixels for ads. No
        selling of hunter locations.
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">Children</h2>
      <p>
        Flyway is not directed at children under 13. Do not create a lodge profile if you are under
        13.
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">Your choices</h2>
      <p>
        You can hunt the brief without an account. You can delete lodge posts you authored. You can
        uninstall the Android app to remove on-device storage. You can deny location and
        notification permission; the brief still works with a typed pin.
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">Contact</h2>
      <p>
        Questions about this policy: use the support email on the Flyway Google Play listing, or
        the contact on Get app.
      </p>
    </LegalShell>
  );
}

export function PublishPage() {
  return (
    <LegalShell kicker="Play Store" title="Listing kit">
      <p>
        Copy this into Google Play Console. Upload <span className="text-fg">Flyway.aab</span> (not
        the sideload APK). Target is Android 16 (API 36), as required after August 31, 2026.
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">Title</h2>
      <p className="rounded-md bg-elevated px-3 py-2 text-fg">{PLAY_LISTING.title}</p>
      <h2 className="pt-2 font-display text-xl text-fg">Short description</h2>
      <p className="rounded-md bg-elevated px-3 py-2 text-fg">{PLAY_LISTING.shortDescription}</p>
      <h2 className="pt-2 font-display text-xl text-fg">Full description</h2>
      <pre className="overflow-auto whitespace-pre-wrap rounded-md bg-elevated px-3 py-3 font-sans text-sm text-fg">
        {PLAY_LISTING.fullDescription}
      </pre>
      <h2 className="pt-2 font-display text-xl text-fg">Category & rating</h2>
      <p>
        Category: {PLAY_LISTING.category}. {PLAY_LISTING.contentRating}
      </p>
      <h2 className="pt-2 font-display text-xl text-fg">Data safety (paste as notes)</h2>
      <ul className="list-disc space-y-2 pl-5">
        {PLAY_LISTING.dataSafety.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h2 className="pt-2 font-display text-xl text-fg">What you still do in Play Console</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Pay the one-time $25 Google Play developer fee and finish identity verification.</li>
        <li>Create the app with package name <span className="text-fg">app.flyway.brief</span>.</li>
        <li>Enroll in Play App Signing. Upload the signed .aab from Get app.</li>
        <li>Set this Privacy policy URL (this page) and a support email you monitor.</li>
        <li>Personal accounts: 14-day closed test with at least 12 opted-in testers, then production.</li>
      </ol>
      <p className="pt-2">
        <a href="/flyway.aab" download="Flyway.aab" className="text-sage hover:underline">
          Download Flyway.aab
        </a>
        {" · "}
        <a href="/play/icon-512.png" download="flyway-play-icon-512.png" className="text-sage hover:underline">
          512 icon
        </a>
        {" · "}
        <a href="/play/flyway-play-listing.zip" download="Flyway-play-listing.zip" className="text-sage hover:underline">
          Listing graphics zip
        </a>
      </p>
    </LegalShell>
  );
}
