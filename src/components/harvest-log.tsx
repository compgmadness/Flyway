import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BirdId } from "@/lib/flyway/id-guide";
import {
  addHarvest,
  FINISH_LABEL,
  ICE_LABEL,
  loadHarvests,
  removeHarvest,
  subscribeHarvests,
  type HarvestFinish,
  type HarvestIce,
  type HarvestLog,
  type HarvestSex,
} from "@/lib/flyway/harvest";
import {
  DEFAULT_PLACE,
  featuredByFlyway,
  searchUsPlaces,
  type Place,
} from "@/lib/flyway/places";
import { cn } from "@/lib/utils";

const LOC_KEY = "flyway:location";

function loadMarsh(): Place {
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

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center rounded-md px-3 text-sm",
        active ? "bg-sage text-sage-fg" : "bg-elevated text-fg hover:bg-elevated/80",
      )}
    >
      {children}
    </button>
  );
}

export function HarvestLogForm({ bird }: { bird: BirdId }) {
  const marsh = useMemo(() => loadMarsh(), []);
  const flyways = useMemo(() => featuredByFlyway(), []);
  const [place, setPlace] = useState<Place>(marsh);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [sex, setSex] = useState<HarvestSex>("unknown");
  const [count, setCount] = useState(1);
  const [ice, setIce] = useState<HarvestIce>("open");
  const [finish, setFinish] = useState<HarvestFinish>("decoys");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = window.setTimeout(() => {
      void searchUsPlaces(q)
        .then((rows) => {
          if (!cancelled) setHits(rows);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [query]);

  function pickPlace(next: Place) {
    setPlace(next);
    setQuery("");
    setHits([]);
  }

  function submit() {
    addHarvest({
      birdId: bird.id,
      birdName: bird.name,
      sex,
      count,
      ice,
      finish,
      note,
      place,
    });
    setSaved(
      `Logged ${count} ${bird.name.toLowerCase()}${count === 1 ? "" : "s"} at ${place.name}. The brief now uses this bag.`,
    );
    setNote("");
    window.setTimeout(() => setSaved(null), 4200);
  }

  return (
    <section className="rounded-2xl bg-surface p-4 shadow-border">
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">Harvest-fed flyway</p>
      <h2 className="mt-1 font-display text-xl text-fg">Log this bird</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Bag ID is the log, not just a key. Pin any U.S. marsh — this sits on the flyway and moves
        the sit number for hunters south of you. Not a legal harvest report.
      </p>

      <p className="mt-4 text-xs tracking-widest text-subtle uppercase">Marsh</p>
      <p className="mt-1 text-sm text-fg">
        {place.name}
        {place.region ? ` · ${place.region}` : ""}
      </p>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any U.S. city or refuge"
        className="mt-2"
        aria-label="Search marsh"
      />
      {query.trim().length >= 2 ? (
        <ul className="mt-2 space-y-1">
          {searching ? (
            <li className="px-2 py-2 text-sm text-muted">Searching the U.S.…</li>
          ) : hits.length === 0 ? (
            <li className="px-2 py-2 text-sm text-muted">No U.S. places found.</li>
          ) : (
            hits.map((hit) => (
              <li key={`${hit.name}-${hit.lat}`}>
                <button
                  type="button"
                  className="flex min-h-11 w-full flex-col items-start rounded-md px-2 text-left hover:bg-elevated"
                  onClick={() => pickPlace(hit)}
                >
                  <span className="text-sm text-fg">{hit.name}</span>
                  {hit.region ? <span className="text-xs text-muted">{hit.region}</span> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : (
        <label className="mt-2 block text-xs tracking-widest text-subtle uppercase">
          Or pick a flyway marsh
          <select
            value={`${place.lat},${place.lon}`}
            onChange={(e) => {
              const [lat, lon] = e.target.value.split(",").map(Number);
              const hit = flyways
                .flatMap((g) => g.spots)
                .concat(marsh)
                .find((s) => s.lat === lat && s.lon === lon);
              if (hit) pickPlace(hit);
            }}
            className="mt-2 flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border"
          >
            <optgroup label="This sit">
              <option value={`${marsh.lat},${marsh.lon}`}>
                {marsh.name}
                {marsh.region ? ` · ${marsh.region}` : ""}
              </option>
            </optgroup>
            {flyways.map((group) => (
              <optgroup key={group.id} label={group.label}>
                {group.spots.map((spot) => (
                  <option key={`${spot.name}-${spot.lat}`} value={`${spot.lat},${spot.lon}`}>
                    {spot.name} · {spot.region}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      )}

      <p className="mt-4 text-xs tracking-widest text-subtle uppercase">Sex</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["drake", "hen", "unknown"] as const).map((s) => (
          <Chip key={s} active={sex === s} onClick={() => setSex(s)}>
            {s === "unknown" ? "Unsure" : s[0]!.toUpperCase() + s.slice(1)}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-xs tracking-widest text-subtle uppercase">Count</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Chip key={n} active={count === n} onClick={() => setCount(n)}>
            {String(n)}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-xs tracking-widest text-subtle uppercase">Ice</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["open", "skim", "locked"] as const).map((v) => (
          <Chip key={v} active={ice === v} onClick={() => setIce(v)}>
            {ICE_LABEL[v]}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-xs tracking-widest text-subtle uppercase">How they finished</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["decoys", "pass", "jump", "loafing"] as const).map((v) => (
          <Chip key={v} active={finish === v} onClick={() => setFinish(v)}>
            {FINISH_LABEL[v]}
          </Chip>
        ))}
      </div>

      <label className="mt-4 block text-xs tracking-widest text-subtle uppercase">
        Note
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={180}
          placeholder="Wind, hole, anything the next hunter needs"
          className="mt-2 flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border placeholder:text-subtle"
        />
      </label>

      <Button type="button" className="mt-4 w-full sm:w-auto" onClick={submit}>
        Put it on the flyway
      </Button>
      {saved ? <p className="mt-3 text-sm text-sage">{saved}</p> : null}
    </section>
  );
}

export function RecentHarvests() {
  const [rows, setRows] = useState<HarvestLog[]>([]);
  useEffect(() => {
    const sync = () => setRows(loadHarvests().slice(0, 5));
    sync();
    return subscribeHarvests(sync);
  }, []);
  if (rows.length === 0) return null;
  return (
    <section>
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">Your bag</p>
      <ul className="mt-3 space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between gap-3 rounded-md bg-surface px-3 py-3 shadow-border"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-fg">
                {row.count} {row.birdName}
                {row.sex !== "unknown" ? ` · ${row.sex}` : ""}
              </p>
              <p className="mt-1 text-xs text-muted">
                {row.place.name}
                {row.place.region ? ` · ${row.place.region}` : ""} · {ICE_LABEL[row.ice]}
              </p>
            </div>
            <button
              type="button"
              className="h-11 shrink-0 px-3 text-sm text-muted hover:text-fg"
              onClick={() => removeHarvest(row.id)}
            >
              Pull
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}