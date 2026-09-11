import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, MapPin, Navigation, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featuredByFlyway, reverseGeocode, searchUsPlaces } from "@/lib/flyway/places";
import type { Place } from "@/lib/flyway/types";

export function LocationDialog({
  open,
  onOpenChange,
  recents,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  recents: Place[];
  onSelect: (place: Place) => void;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const flyways = featuredByFlyway();

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

  function pick(place: Place) {
    onSelect(place);
    onOpenChange(false);
    setQuery("");
    setHits([]);
  }

  function useMyLocation() {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Location is not available in this browser.");
      return;
    }
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          .then((place) => pick(place))
          .catch(() =>
            pick({
              name: "My location",
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            }),
          )
          .finally(() => setGeoBusy(false));
      },
      () => {
        setGeoBusy(false);
        setGeoError("Could not read your location. Search a marsh instead.");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-border sm:inset-y-auto sm:top-1/2 sm:bottom-auto sm:max-h-[80dvh] sm:-translate-y-1/2 sm:rounded-2xl sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-display text-xl text-fg">
                Hunt location
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                Any town or refuge in the United States. Search, use GPS, or pick a flyway marsh.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any U.S. city or refuge"
              className="pl-10"
              autoFocus
            />
          </div>

          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={useMyLocation}
            disabled={geoBusy}
          >
            {geoBusy ? <LoaderCircle className="animate-spin" /> : <Navigation />}
            Use my location
          </Button>
          {geoError ? <p className="mt-2 text-sm text-hunt-poor">{geoError}</p> : null}

          {query.trim().length >= 2 ? (
            <ul className="mt-4 space-y-1">
              {searching ? (
                <li className="px-2 py-3 text-sm text-muted">Searching the U.S.…</li>
              ) : hits.length === 0 ? (
                <li className="px-2 py-3 text-sm text-muted">No U.S. places found.</li>
              ) : (
                hits.map((hit) => (
                  <li key={`${hit.name}-${hit.lat}`}>
                    <PlaceRow place={hit} onClick={() => pick(hit)} />
                  </li>
                ))
              )}
            </ul>
          ) : (
            <div className="mt-5 space-y-5">
              {recents.length > 0 ? (
                <SpotGroup title="Recent" spots={recents} onPick={pick} />
              ) : null}
              {flyways.map((group) =>
                group.spots.length ? (
                  <SpotGroup key={group.id} title={group.label} spots={group.spots} onPick={pick} />
                ) : null,
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SpotGroup({
  title,
  spots,
  onPick,
}: {
  title: string;
  spots: Place[];
  onPick: (p: Place) => void;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-medium tracking-widest text-subtle uppercase">
        {title}
      </h3>
      <ul className="space-y-1">
        {spots.map((spot) => (
          <li key={`${spot.name}-${spot.lat}`}>
            <PlaceRow place={spot} onClick={() => onPick(spot)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlaceRow({ place, onClick }: { place: Place; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left hover:bg-elevated"
    >
      <MapPin className="size-4 shrink-0 text-sage" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-fg">{place.name}</span>
        {place.region ? (
          <span className="block truncate text-xs text-muted">{place.region}</span>
        ) : null}
      </span>
    </button>
  );
}