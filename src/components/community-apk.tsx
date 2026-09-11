import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { AppChrome, type AppPage } from "@/components/app-chrome";
import { UpdatePing } from "@/components/update-ping";
import { AttachPhoto, AvatarField, HunterMark } from "@/components/photo-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addLocalReport,
  hasLocalAccounts,
  loadLocalProfile,
  loadLocalReports,
  loginLocalAccount,
  logoutLocalAccount,
  registerLocalAccount,
  removeLocalReport,
  saveLocalProfile,
} from "@/lib/flyway/community-local";
import type { HunterProfile } from "@/lib/flyway/community-types";
import {
  CITIES_BY_STATE,
  FLYWAY_OPTIONS,
  REPORT_SPECIES,
  STATES_BY_FLYWAY,
  stateName,
} from "@/lib/flyway/community-geo";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

const areaClass =
  "min-h-28 w-full rounded-md bg-elevated px-3 py-3 text-sm leading-relaxed text-fg shadow-border outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/70";

type Gate = "boot" | "login" | "register" | "lodge";

export function CommunityApkPage({ onPage }: { onPage?: (page: AppPage) => void }) {
  const [gate, setGate] = useState<Gate>("boot");
  const [profile, setProfile] = useState<HunterProfile | null>(null);

  useEffect(() => {
    const current = loadLocalProfile();
    if (current) {
      setProfile(current);
      setGate("lodge");
      return;
    }
    setGate(hasLocalAccounts() ? "login" : "register");
  }, []);

  function enter(next: HunterProfile) {
    setProfile(next);
    setGate("lodge");
  }

  function leave() {
    logoutLocalAccount();
    setProfile(null);
    setGate(hasLocalAccounts() ? "login" : "register");
  }

  return (
    <div className="min-h-dvh">
      <AppChrome
        page="community"
        apk
        onPage={onPage}
        actions={
          gate === "lodge" && profile ? (
            <Button type="button" variant="ghost" className="h-11 shrink-0 px-3" onClick={leave}>
              Log out
            </Button>
          ) : null
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <UpdatePing compact />
        </div>
        {gate === "boot" ? (
          <div className="h-40 animate-pulse rounded-lg bg-surface" />
        ) : gate === "login" ? (
          <LoginCard onEnter={enter} onCreate={() => setGate("register")} />
        ) : gate === "register" ? (
          <RegisterCard
            onEnter={enter}
            onLogin={() => setGate("login")}
            canLogin={hasLocalAccounts()}
          />
        ) : profile ? (
          <PhoneLodge profile={profile} onProfile={setProfile} />
        ) : (
          <LoginCard onEnter={enter} onCreate={() => setGate("register")} />
        )}
      </main>
    </div>
  );
}

function LoginCard({
  onEnter,
  onCreate,
}: {
  onEnter: (profile: HunterProfile) => void;
  onCreate: () => void;
}) {
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="rounded-lg bg-surface p-4 shadow-border">
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">The lodge</p>
      <h1 className="mt-2 font-display text-3xl text-fg">Log in</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Use the handle and password you cut on this phone. You stay signed in until you log out.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const res = loginLocalAccount(handle, password);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          onEnter(res.profile);
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Handle</span>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="greenhead_co" autoCapitalize="none" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Password</span>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 4 characters" />
        </label>
        {error ? <p className="text-sm text-hunt-poor">{error}</p> : null}
        <Button type="submit">Log in</Button>
      </form>
      <button type="button" className="mt-4 text-sm text-sage" onClick={onCreate}>
        New to this phone? Create an account
      </button>
    </section>
  );
}

function RegisterCard({
  onEnter,
  onLogin,
  canLogin,
}: {
  onEnter: (profile: HunterProfile) => void;
  onLogin: () => void;
  canLogin: boolean;
}) {
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [homeFlyway, setHomeFlyway] = useState<HunterProfile["homeFlyway"]>("central");
  const [homeState, setHomeState] = useState("CO");
  const [homeCity, setHomeCity] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const states = STATES_BY_FLYWAY[homeFlyway];
  const cities = CITIES_BY_STATE[homeState] ?? [];

  return (
    <section className="rounded-lg bg-surface p-4 shadow-border">
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">The lodge</p>
      <h1 className="mt-2 font-display text-3xl text-fg">Create an account</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Cut a handle and a password. Next time you open Flyway, log in — you will not cut a new profile.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (password !== confirm) {
            setError("Passwords don’t match.");
            return;
          }
          if (displayName.trim().length < 2) {
            setError("Give a name the lodge can call you.");
            return;
          }
          if (homeCity.trim().length < 2) {
            setError("City is required.");
            return;
          }
          const res = registerLocalAccount(
            {
              handle,
              displayName: displayName.trim().slice(0, 32),
              homeFlyway,
              homeState,
              homeCity: homeCity.trim().slice(0, 48),
              bio: bio.trim().slice(0, 160),
              avatarUrl,
            },
            password,
          );
          if (!res.ok) {
            setError(res.error);
            return;
          }
          onEnter(res.profile);
        }}
      >
        <AvatarField name={displayName || handle} value={avatarUrl} onChange={setAvatarUrl} />
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Handle</span>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="greenhead_co" autoCapitalize="none" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Name</span>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What they call you" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Password</span>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 4 characters" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Confirm</span>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Type it again" />
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
              list="register-cities"
              placeholder="Town"
            />
            <datalist id="register-cities">
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
        <Button type="submit">Create account</Button>
      </form>
      {canLogin ? (
        <button type="button" className="mt-4 text-sm text-sage" onClick={onLogin}>
          Already have a handle? Log in
        </button>
      ) : null}
    </section>
  );
}

function PhoneLodge({
  profile,
  onProfile,
}: {
  profile: HunterProfile;
  onProfile: (profile: HunterProfile) => void;
}) {
  const [flyway, setFlyway] = useState<HunterProfile["homeFlyway"]>(profile.homeFlyway);
  const [state, setState] = useState(profile.homeState);
  const [city, setCity] = useState(profile.homeCity);
  const [tick, setTick] = useState(0);

  const reports = useMemo(
    () => loadLocalReports({ flyway, state, city }),
    [flyway, state, city, tick],
  );

  const states = STATES_BY_FLYWAY[flyway];
  const cities = CITIES_BY_STATE[state] ?? [];

  function pickFlyway(next: HunterProfile["homeFlyway"]) {
    setFlyway(next);
    setState(STATES_BY_FLYWAY[next][0].code);
    setCity("");
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <HunterMark name={profile.displayName} src={profile.avatarUrl} />
        <div>
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">The lodge</p>
        <h1 className="mt-2 font-display text-3xl text-fg">Welcome back, {profile.displayName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Signed in as @{profile.handle}. Your posts stay on this phone after you close Flyway.
        </p>
        </div>
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

      <PhoneComposer
        profile={profile}
        flyway={flyway}
        state={state}
        city={city}
        onPosted={() => setTick((n) => n + 1)}
        onSaved={(next) => {
          onProfile(next);
          setFlyway(next.homeFlyway);
          setState(next.homeState);
          setCity(next.homeCity);
        }}
      />

      <section>
        <h2 className="font-display text-xl text-fg">
          {state ? `${stateName(state)}${city ? ` · ${city}` : ""}` : FLYWAY_OPTIONS.find((f) => f.id === flyway)?.label}{" "}
          reports
        </h2>
        {reports.length ? (
          <ul className="mt-3 space-y-3">
            {reports.map((report) => (
              <li key={report.id} className="rounded-lg bg-surface p-4 shadow-border">
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
                  {profile.handle === report.handle ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Delete report"
                      onClick={() => {
                        removeLocalReport(report.id, report.handle);
                        setTick((n) => n + 1);
                      }}
                    >
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

function PhoneProfileForm({
  initial,
  onSaved,
}: {
  initial?: HunterProfile | null;
  onSaved: (profile: HunterProfile) => void;
}) {
  const [handle, setHandle] = useState(initial?.handle ?? "");
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [homeFlyway, setHomeFlyway] = useState(initial?.homeFlyway ?? "central");
  const [homeState, setHomeState] = useState(initial?.homeState ?? "CO");
  const [homeCity, setHomeCity] = useState(initial?.homeCity ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const states = STATES_BY_FLYWAY[homeFlyway];
  const cities = CITIES_BY_STATE[homeState] ?? [];

  return (
    <section className="rounded-lg bg-surface p-4 shadow-border">
      <h2 className="font-display text-xl text-fg">Edit profile</h2>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const nextHandle = handle.trim().toLowerCase();
          if (!/^[a-z0-9_]{3,20}$/.test(nextHandle)) {
            setError("Handle must be 3–20 letters, numbers, or underscores.");
            return;
          }
          if (displayName.trim().length < 2) {
            setError("Give a name the lodge can call you.");
            return;
          }
          if (homeCity.trim().length < 2) {
            setError("City is required.");
            return;
          }
          setPending(true);
          const next: HunterProfile = {
            handle: nextHandle,
            displayName: displayName.trim().slice(0, 32),
            homeFlyway,
            homeState,
            homeCity: homeCity.trim().slice(0, 48),
            bio: bio.trim().slice(0, 160),
            avatarUrl,
          };
          const res = saveLocalProfile(next);
          setPending(false);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          onSaved(next);
        }}
      >
        <AvatarField name={displayName || handle} value={avatarUrl} onChange={setAvatarUrl} />
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">Handle</span>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="greenhead_co" autoCapitalize="none" />
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
        <Button type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" /> : null}
          Save profile
        </Button>
      </form>
    </section>
  );
}

function PhoneComposer({
  profile,
  flyway,
  state,
  city,
  onPosted,
  onSaved,
}: {
  profile: HunterProfile;
  flyway: HunterProfile["homeFlyway"];
  state: string;
  city: string;
  onPosted: () => void;
  onSaved: (profile: HunterProfile) => void;
}) {
  const [body, setBody] = useState("");
  const [species, setSpecies] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postCity = city.trim();
  const postState = state;

  if (editing) {
    return (
      <PhoneProfileForm
        initial={profile}
        onSaved={(next) => {
          setEditing(false);
          onSaved(next);
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
            {postState ? ` · ${stateName(postState)}` : ""}
            {postCity ? ` · ${postCity}` : ""}
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
          if (!postState || !postCity) return;
          const text = body.replace(/\s+/g, " ").trim();
          if (text.length < 8) {
            setError("Tell the lodge a little more.");
            return;
          }
          const res = addLocalReport({
            profile,
            flyway,
            state: postState,
            city: postCity,
            species,
            body: text.slice(0, 500),
            photoUrl,
          });
          if (!res.ok) {
            setError(res.error);
            return;
          }
          setBody("");
          setSpecies("");
          setPhotoUrl("");
          setError(null);
          onPosted();
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
          <Button type="submit" disabled={!postCity || !postState}>
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

function ago(ms: number): string {
  const delta = Math.max(0, Date.now() - ms) / 1000;
  if (delta < 60) return "just now";
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
}
