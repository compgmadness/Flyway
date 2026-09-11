import { Download, Images, Share2, Shield, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { AppChrome } from "@/components/app-chrome";
import { UpdatePing } from "@/components/update-ping";
import { Button } from "@/components/ui/button";
import { placeFromSearch, placeSearch } from "@/lib/flyway/places";
import { shareApp } from "@/lib/flyway/share-app";

export function GetAppPage() {
  const [note, setNote] = useState<string | null>(null);
  const place = useMemo(() => {
    if (typeof window === "undefined") return null;
    return placeFromSearch(window.location.search);
  }, []);

  async function onShare() {
    const result = await shareApp(place ?? undefined);
    if (result === "shared-file") setNote("Pick a chat — Flyway.apk is attached");
    if (result === "shared-link") setNote("Install link sent");
    if (result === "copied") setNote("Install link copied");
    if (result !== "cancelled") {
      window.setTimeout(() => setNote(null), 3200);
    }
  }

  const briefHref = place ? `/${placeSearch(place)}` : "/";

  return (
    <div className="min-h-dvh">
      <AppChrome page="get" />
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <UpdatePing />
        </div>
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">
          Send this to testers
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-fg sm:text-4xl">
          Get Flyway on your phone
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Android install is a download, not the Play Store. Tap below, then allow the install.
          {place ? ` This link is pinned to ${place.name}.` : ""}
        </p>

        <a
          href="/flyway.aab"
          download="Flyway.aab"
          className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90"
        >
          <Download className="size-4" />
          Download Play bundle (.aab)
        </a>

        <a
          href="/flyway.apk"
          download="Flyway.apk"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-md bg-elevated px-4 text-sm font-medium text-fg shadow-border hover:bg-elevated/80"
        >
          <Download className="size-4" />
          Sideload APK (testing)
        </a>

        <Button type="button" variant="secondary" className="mt-3 w-full" onClick={() => void onShare()}>
          <Share2 />
          Share the app
        </Button>

        <a
          href="/flyway-ads.zip"
          download="Flyway-ads.zip"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-md bg-elevated px-4 text-sm font-medium text-fg shadow-border hover:bg-elevated/80"
        >
          <Images className="size-4" />
          Download ad images
        </a>

        <a
          href="/ads"
          className="mt-3 flex min-h-11 items-center justify-center rounded-md text-sm text-sage hover:underline"
        >
          Preview and save ads one at a time
        </a>

        <a
          href="/publish"
          className="mt-3 flex min-h-11 items-center justify-center rounded-md text-sm text-sage hover:underline"
        >
          Play Store listing kit
        </a>

        <a
          href="/privacy"
          className="mt-3 flex min-h-11 items-center justify-center rounded-md text-sm text-sage hover:underline"
        >
          Privacy policy
        </a>

        <ol className="mt-8 space-y-3 text-sm leading-relaxed text-muted">
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg">
              1
            </span>
            <span>Download the file. If Chrome says it’s uncommon, choose Download anyway.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg">
              2
            </span>
            <span>
              Open Flyway.apk. Allow your browser to install unknown apps if Android asks.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated font-display text-xs text-fg">
              3
            </span>
            <span>Install, then open Flyway. Use Brief and Bag ID from the tabs under the title.</span>
          </li>
        </ol>

        <div className="mt-6 flex gap-3 rounded-md bg-elevated px-3 py-3 text-xs leading-relaxed text-muted">
          <Shield className="mt-0.5 size-4 shrink-0 text-sage" />
          <p>
            Sideloaded build, signed so Android will install it. Network for weather. Location is
            optional for pinning a marsh.
          </p>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-subtle">
          <Smartphone className="size-3.5" />
          Android 7 and newer
        </p>
      </main>
      {note ? (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <p className="rounded-md bg-elevated px-4 py-2 text-sm text-fg shadow-border">{note}</p>
        </div>
      ) : null}
    </div>
  );
}
