import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Cloud,
  Gauge,
  Moon,
  Share2,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppChrome, type AppPage } from "@/components/app-chrome";
import { LocationDialog } from "@/components/location-dialog";
import { PushWatchCard } from "@/components/push-watch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { loadBrief } from "@/lib/flyway/load-brief";
import { DEFAULT_PLACE, placeFromSearch, placeSearch, placeShareUrl } from "@/lib/flyway/places";
import { shareApp } from "@/lib/flyway/share-app";
import { longDate, scoreTone } from "@/lib/flyway/scoring";
import type { HuntBrief, HuntRating, Place } from "@/lib/flyway/types";
import { loadNorthWatch } from "@/lib/flyway/push-watch";
import { cn } from "@/lib/utils";

const LOC_KEY = "flyway:location";
const RECENTS_KEY = "flyway:recents";

function loadStoredPlace(): Place {
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return DEFAULT_PLACE;
    const parsed = JSON.parse(raw) as Place;
    if (typeof parsed.lat === "number" && typeof parsed.lon === "number") return parsed;
  } catch {
    /* ignore */
  }
  return DEFAULT_PLACE;
}

function loadRecents(): Place[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Place[];
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
}

function persist(place: Place, recents: Place[]) {
  localStorage.setItem(LOC_KEY, JSON.stringify(place));
  const next = [
    place,
    ...recents.filter((r) => r.name !== place.name || r.lat !== place.lat),
  ].slice(0, 5);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  return next;
}

function ratingTone(rating: HuntRating) {
  if (rating === "Prime" || rating === "Exceptional") return "sage" as const;
  if (rating === "Good") return "good" as const;
  if (rating === "Fair") return "fair" as const;
  return "poor" as const;
}

function writePlaceUrl(place: Place) {
  if (typeof window === "undefined") return;
  const next = placeSearch(place);
  if (`${window.location.search}` !== next) {
    window.history.replaceState(null, "", `${window.location.pathname}${next}`);
  }
}

async function shareSit(place: Place, brief?: HuntBrief | null): Promise<"shared" | "copied" | "cancelled"> {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const canLink = host !== "" && host !== "app.flyway.brief";
  const url = canLink ? placeShareUrl(place) : undefined;
  const title = `Flyway — ${place.name}`;
  const text = brief
    ? `${brief.score.value} ${brief.score.rating} at ${place.name}. ${brief.score.headline}`
    : `Live waterfowl migration brief for ${place.name}`;
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share(url ? { title, text, url } : { title, text });
      return "shared";
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "cancelled";
  }
  const payload = url ? `${title}\n${text}\n${url}` : `${title}\n${text}`;
  await navigator.clipboard.writeText(payload);
  return "copied";
}

export function Dashboard({
  initialBrief,
  apk = false,
  extra,
  onPage,
}: {
  initialBrief: HuntBrief | null;
  apk?: boolean;
  extra?: (brief: HuntBrief) => ReactNode;
  onPage?: (page: AppPage) => void;
}) {
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  const [recents, setRecents] = useState<Place[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    const fromUrl = placeFromSearch(window.location.search);
    if (fromUrl) {
      setPlace(fromUrl);
      setRecents(persist(fromUrl, loadRecents()));
      return;
    }
    const stored = loadStoredPlace();
    setPlace(stored);
    setRecents(loadRecents());
    writePlaceUrl(stored);
  }, []);

  useEffect(() => {
    const sync = () => setWatching(loadNorthWatch().enabled);
    sync();
    window.addEventListener("flyway-watch-change", sync);
    return () => window.removeEventListener("flyway-watch-change", sync);
  }, []);

  const matchesInitial =
    !!initialBrief &&
    Math.abs(place.lat - initialBrief.location.lat) < 0.05 &&
    Math.abs(place.lon - initialBrief.location.lon) < 0.05;

  const brief = useQuery({
    queryKey: ["brief", place.lat, place.lon, place.name],
    queryFn: () => loadBrief(place),
    initialData: matchesInitial && initialBrief ? initialBrief : undefined,
    initialDataUpdatedAt: matchesInitial ? Date.now() : undefined,
    retry: 1,
    retryDelay: 2000,
    placeholderData: keepPreviousData,
    refetchInterval: watching ? 20 * 60 * 1000 : false,
  });

  function selectPlace(next: Place) {
    setPlace(next);
    setRecents(persist(next, recents));
    writePlaceUrl(next);
  }

  async function onShareApp() {
    const result = await shareApp(place);
    if (result === "shared-file") setShareNote("Pick a chat — Flyway.apk is attached");
    if (result === "shared-link") setShareNote("Install link sent");
    if (result === "copied") setShareNote("Install link copied — send it to testers");
    if (result !== "cancelled") {
      window.setTimeout(() => setShareNote(null), 3200);
    }
  }

  async function onShareSit() {
    const result = await shareSit(place, brief.data);
    if (result === "copied") setShareNote("Sit link copied");
    if (result === "shared") setShareNote("Shared");
    if (result !== "cancelled") {
      window.setTimeout(() => setShareNote(null), 2800);
    }
  }

  return (
    <div className="min-h-dvh">
      <AppChrome
        page="brief"
        apk={apk}
        onPage={onPage}
        actions={
          <>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex min-h-11 max-w-28 items-center gap-2 rounded-md px-2 text-right hover:bg-elevated sm:max-w-xs"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-fg">{place.name}</span>
                {place.region ? (
                  <span className="block truncate text-xs text-muted">{place.region}</span>
                ) : null}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted" />
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label={apk ? "Share this marsh" : "Share Flyway app"}
              onClick={() => void (apk ? onShareSit() : onShareApp())}
            >
              <Share2 />
            </Button>
          </>
        }
      />

      <LocationDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        recents={recents}
        onSelect={selectPlace}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {!brief.data && brief.isLoading ? <BriefSkeleton /> : null}
        {brief.isError && !brief.data ? (
          <ErrorPanel
            message={
              brief.error instanceof Error
                ? brief.error.message
                : "The live forecast didn’t load. Check the pin and try again."
            }
            onRetry={() => void brief.refetch()}
          />
        ) : null}
        {brief.data ? <BriefView data={brief.data} extra={extra} onShare={() => void onShareSit()} /> : null}
      </main>
      {shareNote ? (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <p className="rounded-md bg-elevated px-4 py-2 text-sm text-fg shadow-border">{shareNote}</p>
        </div>
      ) : null}
    </div>
  );
}

function BriefView({
  data,
  extra,
  onShare,
}: {
  data: HuntBrief;
  extra?: (brief: HuntBrief) => ReactNode;
  onShare?: () => void;
}) {
  const bestDay = useMemo(() => {
    return data.days.reduce(
      (best, day) => (day.score > best.score ? day : best),
      data.days[0] ?? { score: 0, date: "" },
    );
  }, [data.days]);

  const glass = data.now.pressureChange24h;
  const glassLabel =
    glass <= -1.5 ? "falling" : glass >= 1.5 ? "rising" : "steady";

  return (
    <div className="space-y-8">
      <section className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
        <ScoreRing value={data.score.value} rating={data.score.rating} />
        <div>
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">
            {data.flyway.name} · {data.season.name} · {longDate(data.now.time.slice(0, 10))}
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-fg sm:text-4xl">
            {data.score.headline}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {data.score.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone={ratingTone(data.score.rating)}>{data.score.rating} sit</Badge>
            <Badge>{data.incoming.headline}</Badge>
            <Badge>
              {data.now.weatherLabel} · {data.now.windCardinal} {data.now.windMph.toFixed(0)} mph
            </Badge>
          </div>
          {onShare ? (
            <Button type="button" variant="secondary" className="mt-4" onClick={onShare}>
              <Share2 />
              Share this sit
            </Button>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={<Thermometer className="size-4" />}
          label="Temperature"
          value={`${data.now.tempF.toFixed(0)}°`}
          hint={`Feels ${data.now.feelsF.toFixed(0)}°`}
        />
        <Stat
          icon={<Wind className="size-4" />}
          label="Wind"
          value={`${data.now.windMph.toFixed(0)} mph`}
          hint={`${data.now.windCardinal} · gusts ${data.now.windGustMph.toFixed(0)}`}
        />
        <Stat
          icon={<Gauge className="size-4" />}
          label="The glass"
          value={`${data.now.pressureInHg.toFixed(2)}`}
          hint={`${glassLabel} · ${glass >= 0 ? "+" : ""}${glass.toFixed(1)} hPa`}
        />
        <Stat
          icon={<Cloud className="size-4" />}
          label="Sky"
          value={`${data.now.cloudCover.toFixed(0)}%`}
          hint={data.now.weatherLabel}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl bg-surface p-4 shadow-border lg:col-span-3">
          <SectionKicker>Coming down the flyway</SectionKicker>
          <h2 className="mt-1 font-display text-2xl text-fg">{data.incoming.headline}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{data.incoming.detail}</p>
          <PushWatchCard brief={data} />
          {data.incoming.stations.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No upflyway stations north of this pin. You’re hunting the top of the corridor.
            </p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {data.incoming.stations.map((s) => (
                <li
                  key={s.name}
                  className="rounded-md bg-elevated px-3 py-3"
                >
                  <p className="text-xs tracking-widest text-subtle uppercase">
                    {s.distanceMi.toFixed(0)} mi north
                  </p>
                  <p className="mt-1 truncate text-sm text-fg">{s.name}</p>
                  <p className="mt-2 font-display text-2xl tabular-nums leading-none">
                    {s.tempF.toFixed(0)}°
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {s.windCardinal} {s.windMph.toFixed(0)} · {s.weatherLabel}
                    {s.freezing ? " · freeze" : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-surface p-4 shadow-border lg:col-span-2">
          <SectionKicker>Moon & legal light</SectionKicker>
          <div className="mt-2 flex items-start gap-3">
            <Moon className="mt-1 size-4 text-sage" />
            <div>
              <p className="text-sm text-fg">
                {data.moon.phase} · {Math.round(data.moon.illumination * 100)}% lit
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{data.moon.huntingNote}</p>
            </div>
          </div>
          {data.days[0] ? (
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-elevated px-3 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-subtle">
                  <Sunrise className="size-3.5" /> Dawn
                </dt>
                <dd className="mt-1 font-display text-lg tabular-nums">{data.days[0].legalAm}</dd>
                <p className="text-xs text-muted">30 min before sunrise</p>
              </div>
              <div className="rounded-md bg-elevated px-3 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-subtle">
                  <Sunset className="size-3.5" /> Dusk
                </dt>
                <dd className="mt-1 font-display text-lg tabular-nums">{data.days[0].legalPm}</dd>
                <p className="text-xs text-muted">Sunset, federal framework</p>
              </div>
            </dl>
          ) : null}
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <SectionKicker>Seven-day hunt odds</SectionKicker>
            <h2 className="mt-1 font-display text-2xl text-fg">When to sit</h2>
          </div>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0">
          {data.days.map((day) => {
            const isBest = day.date === bestDay.date;
            return (
              <article
                key={day.date}
                className={cn(
                  "w-32 shrink-0 rounded-xl bg-surface p-3 shadow-border sm:w-auto sm:min-w-0 sm:flex-1",
                  isBest && "ring-1 ring-sage/50",
                )}
              >
                <p className="text-xs tracking-widest text-subtle uppercase">{day.label}</p>
                <p className={cn("mt-2 font-display text-3xl tabular-nums leading-none", scoreTone(day.rating))}>
                  {day.score}
                </p>
                <p className="mt-1 text-xs text-muted">{day.rating}</p>
                {isBest ? (
                  <p className="mt-2 text-xs text-sage">Best sit</p>
                ) : (
                  <p className="mt-2 text-xs text-muted">
                    {day.tempMin.toFixed(0)}° / {day.tempMax.toFixed(0)}°
                  </p>
                )}
                <p className="mt-1 text-xs text-muted">
                  {day.windCardinal} {day.windMph.toFixed(0)}
                </p>
                <p className="mt-1 text-xs text-subtle">{day.weatherLabel}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-surface p-4 shadow-border">
          <SectionKicker>Species in play</SectionKicker>
          <h2 className="mt-1 font-display text-2xl text-fg">What’s on the wing</h2>
          <ul className="mt-4 divide-y divide-border">
            {data.species.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm text-fg">{s.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.note}</p>
                </div>
                <Badge tone={s.inPlay ? "sage" : "muted"}>{s.statusLabel}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-surface p-4 shadow-border">
          <SectionKicker>Why this number</SectionKicker>
          <h2 className="mt-1 font-display text-2xl text-fg">Weather model</h2>
          <ul className="mt-4 space-y-4">
            {data.score.factors.map((f) => (
              <li key={f.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-fg">{f.label}</p>
                  <p className="text-xs tabular-nums text-muted">
                    {f.score}/{f.max}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-sage"
                    style={{ width: `${Math.min(100, (f.score / f.max) * 100)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{f.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl bg-surface p-4 shadow-border">
        <SectionKicker>Hunt windows</SectionKicker>
        <h2 className="mt-1 font-display text-2xl text-fg">Dawn and dusk</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.windows.map((w) => (
            <li key={`${w.when}-${w.kind}`} className="rounded-md bg-elevated px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs tracking-widest text-subtle uppercase">
                  {w.kind === "dawn" ? "Dawn" : "Dusk"}
                </p>
                <p className={cn("text-sm tabular-nums", scoreTone(w.score >= 65 ? "Prime" : w.score >= 50 ? "Good" : w.score >= 30 ? "Fair" : "Poor"))}>
                  {w.score}
                </p>
              </div>
              <p className="mt-1 text-sm text-fg">{w.when}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{w.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {extra ? extra(data) : null}

      <footer className="border-t border-border pt-6 pb-10 text-xs leading-relaxed text-subtle">
        <p>
          Hunt odds combine live weather (Open-Meteo), upflyway stations, moon phase, and typical
          species calendars shifted for latitude. This is a field model, not a count of birds and
          not legal advice. Check your state’s season, shooting hours, and bag limits before you go.
        </p>
      </footer>
    </div>
  );
}

function ScoreRing({ value, rating }: { value: number; rating: HuntRating }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative mx-auto size-44 sm:mx-0">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden="true">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          className="stroke-elevated"
          strokeWidth="8"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          className={cn("stroke-current", scoreTone(rating))}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl tabular-nums leading-none text-fg">{value}</span>
        <span className="mt-1 text-xs tracking-widest text-muted uppercase">{rating}</span>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-border">
      <p className="flex items-center gap-1.5 text-xs tracking-widest text-subtle uppercase">
        <span className="text-sage">{icon}</span>
        {label}
      </p>
      <p className="mt-2 font-display text-2xl tabular-nums leading-none text-fg">{value}</p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-widest text-subtle uppercase">{children}</p>
  );
}

function BriefSkeleton() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">Reading the glass…</p>
      <div className="flex flex-col items-center gap-6 sm:flex-row" aria-hidden="true">
        <Skeleton className="size-44 rounded-full" />
        <div className="w-full space-y-3">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-16 w-full max-w-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-border">
      <h1 className="font-display text-2xl text-fg">Could not reach the weather desk</h1>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      <Button className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
