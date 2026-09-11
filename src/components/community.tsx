import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { AppChrome, type AppPage } from "@/components/app-chrome";
import { UpdatePing } from "@/components/update-ping";
import { AttachPhoto, AvatarField, HunterMark } from "@/components/photo-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  createReport,
  deleteReport,
  getMyProfile,
  listReports,
  saveProfile,
  type FieldReport,
  type HunterProfile,
} from "@/lib/flyway/community";
import {
  CITIES_BY_STATE,
  FLYWAY_OPTIONS,
  REPORT_SPECIES,
  STATES_BY_FLYWAY,
  stateName,
} from "@/lib/flyway/community-geo";
import {
  addLocalReport,
  loadLocalProfile,
  removeLocalReport,
  saveLocalProfile,
} from "@/lib/flyway/community-local";
import { cn } from "@/lib/utils";

const APK = import.meta.env.VITE_APK_BUILD === "1";

const selectClass =
  "flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

const areaClass =
  "min-h-28 w-full rounded-md bg-elevated px-3 py-3 text-sm leading-relaxed text-fg shadow-border outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/70";

export function CommunityPage({
  apk = APK,
  onPage,
}: {
  apk?: boolean;
  onPage?: (page: AppPage) => void;
}) {
  return (
    <div className="min-h-dvh">
      <AppChrome page="community" apk={apk} onPage={onPage} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <UpdatePing compact />
        </div>
        {apk ? <ApkNote /> : <Lodge />}
      </main>
    </div>
  );
}

function ApkNote() {
  return (
    <section className="rounded-lg bg-surface px-4 py-6 shadow-border">
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">The lodge</p>
      <h1 className="mt-2 font-display text-3xl text-fg">Community lives on the live desk</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Field reports need a signed-in hunter. Open Flyway in a browser, tap Community, and post
        what you saw on your flyway.
      </p>
    </section>
  );
}

function Lodge() {
  const queryClient = useQueryClient();
  const { user, isPending } = useCurrentUserState();
  const [flyway, setFlyway] = useState<HunterProfile["homeFlyway"]>("central");
  const [state, setState] = useState("CO");
  const [city, setCity] = useState("");
  const [placed, setPlaced] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["lodge-profile"],
    queryFn: () => getMyProfile(),
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (placed || !profileQuery.data) return;
    setFlyway(profileQuery.data.homeFlyway);
    setState(profileQuery.data.homeState);
    setCity(profileQuery.data.homeCity);
    setPlaced(true);
    saveLocalProfile(profileQuery.data);
  }, [placed, profileQuery.data]);

  useEffect(() => {
    if (!user || profileQuery.isPending || profileQuery.data) return;
    const cached = loadLocalProfile();
    if (!cached) return;
    void saveProfile({ data: cached }).then((res) => {
      if (res.ok) void queryClient.invalidateQueries({ queryKey: ["lodge-profile"] });
    });
  }, [user, profileQuery.isPending, profileQuery.data, queryClient]);

  const reportsQuery = useQuery({
    queryKey: ["lodge-reports", flyway, state, city],
    queryFn: () => listReports({ data: { flyway, state, city } }),
  });

  const states = STATES_BY_FLYWAY[flyway];
  const cities = CITIES_BY_STATE[state] ?? [];

  function pickFlyway(next: HunterProfile["homeFlyway"]) {
    setFlyway(next);
    const first = STATES_BY_FLYWAY[next][0];
    setState(first.code);
    setCity("");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">The lodge</p>
        <h1 className="mt-2 font-display text-3xl text-fg sm:text-4xl">What are you seeing?</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Hunters post by flyway, state, and town. Filter the board to the water you hunt.
        </p>
      </header>

      <section className="rounded-lg bg-surface p-4 shadow-border">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">Board</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FLYWAY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => pickFlyway(opt.id)}
              className={cn(
                "h-11 rounded-md text-sm font-medium",
                flyway === opt.id ? "bg-sage text-sage-fg" : "bg-elevated text-fg",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">State</span>
            <select
              className={selectClass}
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
            >
              <option value="">Whole flyway</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">City</span>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              list="lodge-cities"
              placeholder="All towns"
            />
            <datalist id="lodge-cities">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
        </div>
      </section>

      {isPending ? (
        <div className="h-40 animate-pulse rounded-lg bg-surface" />
      ) : !user ? (
        <section className="rounded-lg bg-surface p-4 shadow-border">
          <h2 className="font-display text-xl text-fg">Sign in to post</h2>
          <p className="mt-2 text-sm text-muted">
            Anyone can read the board. You need a handle to pin a report.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-flex h-11 items-center rounded-md bg-sage px-4 text-sm font-medium text-sage-fg"
          >
            Sign in
          </Link>
        </section>
      ) : profileQuery.isPending ? (
        <div className="h-40 animate-pulse rounded-lg bg-surface" />
      ) : profileQuery.data ? (
        <Composer
          profile={profileQuery.data}
          flyway={flyway}
          state={state}
          city={city}
          onPosted={() => void queryClient.invalidateQueries({ queryKey: ["lodge-reports"] })}
          onProfile={() => void queryClient.invalidateQueries({ queryKey: ["lodge-profile"] })}
        />
      ) : (
        <ProfileForm
          onSaved={() => void queryClient.invalidateQueries({ queryKey: ["lodge-profile"] })}
        />
      )}

      <section>
        <h2 className="font-display text-xl text-fg">
          {state ? `${stateName(state)}${city ? ` · ${city}` : ""}` : FLYWAY_OPTIONS.find((f) => f.id === flyway)?.label}{" "}
          reports
        </h2>
        {reportsQuery.isPending ? (
          <div className="mt-3 space-y-3">
            <div className="h-28 animate-pulse rounded-lg bg-surface" />
            <div className="h-28 animate-pulse rounded-lg bg-surface" />
          </div>
        ) : reportsQuery.isError ? (
          <p className="mt-3 rounded-lg bg-surface px-4 py-5 text-sm text-muted shadow-border">
            Couldn’t load the lodge. Try again in a minute.
          </p>
        ) : reportsQuery.data?.length ? (
          <ul className="mt-3 space-y-3">
            {reportsQuery.data.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                mine={report.handle === profileQuery.data?.handle}
                onDelete={() =>
                  deleteReport({ data: report.id }).then(() => {
                    removeLocalReport(report.id, report.handle);
                    queryClient.invalidateQueries({ queryKey: ["lodge-reports"] });
                  })
                }
              />
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-lg bg-surface px-4 py-5 text-sm text-muted shadow-border">
            Quiet on this water. Be the first to post what you saw.
          </p>
        )}
      </section>
    </div>
  );
}

function ProfileForm({
  initial,
  onSaved,
}: {
  initial?: HunterProfile | null;
  onSaved: () => void;
}) {
  const [handle, setHandle] = useState(initial?.handle ?? "");
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [homeFlyway, setHomeFlyway] = useState(initial?.homeFlyway ?? "central");
  const [homeState, setHomeState] = useState(initial?.homeState ?? "CO");
  const [homeCity, setHomeCity] = useState(initial?.homeCity ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      saveProfile({
        data: { handle, displayName, homeFlyway, homeState, homeCity, bio, avatarUrl },
      }),
    onSuccess: (res) => {
      if (res.ok) {
        saveLocalProfile({ handle, displayName, homeFlyway, homeState, homeCity, bio, avatarUrl });
        onSaved();
      } else setError(res.error);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Could not save"),
  });

  const states = STATES_BY_FLYWAY[homeFlyway];
  const cities = CITIES_BY_STATE[homeState] ?? [];

  return (
    <section className="rounded-lg bg-surface p-4 shadow-border">
      <h2 className="font-display text-xl text-fg">Cut a handle</h2>
      <p className="mt-2 text-sm text-muted">
        One profile per hunter. Home marsh is where your reports start.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate();
        }}
      >
        <AvatarField name={displayName || handle} value={avatarUrl} onChange={setAvatarUrl} />
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Handle</span>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="greenhead_co" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Name</span>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What they call you" />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Flyway</span>
            <select
              className={selectClass}
              value={homeFlyway}
              onChange={(e) => {
                const next = e.target.value as HunterProfile["homeFlyway"];
                setHomeFlyway(next);
                setHomeState(STATES_BY_FLYWAY[next][0].code);
              }}
            >
              {FLYWAY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">State</span>
            <select className={selectClass} value={homeState} onChange={(e) => setHomeState(e.target.value)}>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">City</span>
            <Input
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              list="profile-cities"
              placeholder="Town"
            />
            <datalist id="profile-cities">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Bio</span>
          <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Puddle-duck man, Front Range" />
        </label>
        {error ? <p className="text-sm text-hunt-poor">{error}</p> : null}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
          Save profile
        </Button>
      </form>
    </section>
  );
}

function Composer({
  profile,
  flyway,
  state,
  city,
  onPosted,
  onProfile,
}: {
  profile: HunterProfile;
  flyway: HunterProfile["homeFlyway"];
  state: string;
  city: string;
  onPosted: () => void;
  onProfile: () => void;
}) {
  const [body, setBody] = useState("");
  const [species, setSpecies] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postCity = city.trim();
  const postState = state;

  const mutation = useMutation({
    mutationFn: () =>
      createReport({
        data: { flyway, state: postState, city: postCity, species, body, photoUrl },
      }),
    onSuccess: (res) => {
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setBody("");
      setSpecies("");
      setPhotoUrl("");
      setError(null);
      addLocalReport({
        profile,
        flyway,
        state: postState,
        city: postCity,
        species,
        body,
        photoUrl,
      });
      onPosted();
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Could not post"),
  });

  if (editing) {
    return (
      <ProfileForm
        initial={profile}
        onSaved={() => {
          setEditing(false);
          onProfile();
        }}
      />
    );
  }

  return (
    <section className="rounded-lg bg-surface p-4 shadow-border">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <HunterMark name={profile.displayName} src={profile.avatarUrl} />
          <p className="text-sm text-muted">
            Posting as <span className="text-fg">@{profile.handle}</span>
          <span className="text-subtle">
            {" "}
            · {stateName(postState)} · {postCity}
          </span>
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit profile
        </Button>
      </div>
      <form
        className="mt-3 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate();
        }}
      >
        <textarea
          className={areaClass}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
          placeholder="Teal buzzing the sheet water at legal. North wind, low ceiling."
        />
        <AttachPhoto value={photoUrl} onChange={setPhotoUrl} />
        <div className="flex flex-wrap items-center gap-3">
          <select className={cn(selectClass, "max-w-56")} value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option value="">Species (optional)</option>
            {REPORT_SPECIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={mutation.isPending || !postCity || !postState}>
            {mutation.isPending ? <LoaderCircle className="animate-spin" /> : null}
            Post to the lodge
          </Button>
        </div>
        {!postState || !postCity ? (
          <p className="text-xs text-subtle">Pick a state and city on the board, then post.</p>
        ) : null}
        {error ? <p className="text-sm text-hunt-poor">{error}</p> : null}
      </form>
    </section>
  );
}

function ReportCard({
  report,
  mine,
  onDelete,
}: {
  report: FieldReport;
  mine: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-lg bg-surface p-4 shadow-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <HunterMark name={report.displayName} src={report.avatarUrl} />
          <div>
            <p className="font-display text-lg text-fg">{report.displayName}</p>
          <p className="mt-1 flex items-center gap-1 text-xs tracking-wide text-muted uppercase">
            <MapPin className="size-3" />
            @{report.handle} · {stateName(report.state)} · {report.city} · {ago(report.createdAtMs)}
          </p>
          </div>
        </div>
        {mine ? (
          <Button type="button" variant="ghost" size="icon" aria-label="Delete report" onClick={onDelete}>
            <Trash2 />
          </Button>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-fg">{report.body}</p>
      {report.photoUrl ? (
        <img
          src={report.photoUrl}
          alt=""
          className="mt-3 max-h-80 w-full rounded-md object-cover"
        />
      ) : null}
      {report.species ? (
        <p className="mt-3 text-xs tracking-widest text-sage uppercase">{report.species}</p>
      ) : null}
    </li>
  );
}

function ago(ms: number): string {
  const delta = Math.max(0, Date.now() - ms) / 1000;
  if (delta < 60) return "just now";
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
}
