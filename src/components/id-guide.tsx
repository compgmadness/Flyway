import { ArrowLeft, RotateCcw, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { AppChrome, type AppPage } from "@/components/app-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BIRDS,
  GROUP_LABEL,
  MARK_LABEL,
  SIZE_LABEL,
  birdById,
  marksForGroup,
  matchBirds,
  type BirdGroup,
  type BirdId,
  type BirdMark,
  type BirdSize,
} from "@/lib/flyway/id-guide";
import { cn } from "@/lib/utils";

export function IdGuide({
  apk = false,
  onPage,
}: {
  apk?: boolean;
  onPage?: (page: AppPage) => void;
}) {
  const [group, setGroup] = useState<BirdGroup | null>(null);
  const [size, setSize] = useState<BirdSize | null>(null);
  const [marks, setMarks] = useState<BirdMark[]>([]);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(
    () => matchBirds({ group, size, marks, query }),
    [group, size, marks, query],
  );
  const selected = openId ? birdById(openId) : undefined;
  const filtering = Boolean(group || size || marks.length || query.trim());

  function toggleMark(mark: BirdMark) {
    setMarks((prev) => (prev.includes(mark) ? prev.filter((m) => m !== mark) : [...prev, mark]));
  }

  function reset() {
    setGroup(null);
    setSize(null);
    setMarks([]);
    setQuery("");
    setOpenId(null);
  }

  return (
    <div className="min-h-dvh">
      <AppChrome page="id" apk={apk} onPage={onPage} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {selected ? (
          <BirdDetail
            bird={selected}
            onBack={() => setOpenId(null)}
            onOpen={(id) => setOpenId(id)}
          />
        ) : (
          <div className="space-y-8">
            <section>
              <p className="text-xs font-medium tracking-widest text-subtle uppercase">
                In-hand identification
              </p>
              <h1 className="mt-2 font-display text-3xl leading-tight text-fg sm:text-4xl">
                What did you shoot?
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                Work the bird in hand: family, size, then the mark that jumps out. This is a field
                key, not a regs book — confirm limits for your unit.
              </p>
            </section>

            <section className="space-y-4">
              <Step label="1" title="Family">
                <ChipRow>
                  {(["dabbler", "diver", "goose"] as const).map((g) => (
                    <Chip
                      key={g}
                      active={group === g}
                      onClick={() => {
                        setGroup(group === g ? null : g);
                        setSize(null);
                        setMarks([]);
                      }}
                    >
                      {GROUP_LABEL[g]}
                    </Chip>
                  ))}
                </ChipRow>
              </Step>
              <Step label="2" title="Size in hand">
                <ChipRow>
                  {(group === "goose"
                    ? (["goose"] as const)
                    : group === "dabbler" || group === "diver"
                      ? (["teal", "duck"] as const)
                      : (["teal", "duck", "goose"] as const)
                  ).map((s) => (
                    <Chip
                      key={s}
                      active={size === s}
                      onClick={() => setSize(size === s ? null : s)}
                    >
                      {SIZE_LABEL[s]}
                    </Chip>
                  ))}
                </ChipRow>
              </Step>
              <Step label="3" title="The mark you can see">
                <ChipRow>
                  {marksForGroup(group).map((m) => (
                    <Chip key={m} active={marks.includes(m)} onClick={() => toggleMark(m)}>
                      {MARK_LABEL[m]}
                    </Chip>
                  ))}
                </ChipRow>
              </Step>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or nickname"
                  className="pl-10"
                  aria-label="Search birds"
                />
              </label>
              {filtering ? (
                <Button type="button" variant="ghost" onClick={reset}>
                  <RotateCcw />
                  Clear key
                </Button>
              ) : null}
            </div>

            <section>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl text-fg">
                  {filtering ? `${results.length} match${results.length === 1 ? "" : "es"}` : "All birds"}
                </h2>
                <p className="text-xs text-subtle">{BIRDS.length} in the guide</p>
              </div>
              {results.length === 0 ? (
                <p className="rounded-md bg-surface px-4 py-6 text-sm text-muted shadow-border">
                  Nothing in the key for that mix. Clear a mark or try family only.
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((bird) => (
                    <li key={bird.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(bird.id)}
                        className="w-full overflow-hidden rounded-lg bg-surface text-left shadow-border transition-colors hover:bg-elevated"
                      >
                        <SexPlates bird={bird} />
                        <div className="px-4 py-3">
                          <p className="font-display text-lg text-fg">{bird.name}</p>
                          <p className="mt-1 text-xs tracking-wide text-muted uppercase">
                            {GROUP_LABEL[bird.group]} · {SIZE_LABEL[bird.size]}
                            {bird.aka[0] ? ` · ${bird.aka[0]}` : ""}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function BirdDetail({
  bird,
  onBack,
  onOpen,
}: {
  bird: BirdId;
  onBack: () => void;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="space-y-6">
      <Button type="button" variant="ghost" className="-ml-2" onClick={onBack}>
        <ArrowLeft />
        Back to key
      </Button>

      <div className="overflow-hidden rounded-lg bg-surface shadow-border">
        <SexPlates bird={bird} />
      </div>

      <div>
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">
          {GROUP_LABEL[bird.group]} · {SIZE_LABEL[bird.size]}
        </p>
        <h1 className="mt-2 font-display text-3xl text-fg">{bird.name}</h1>
        {bird.aka.length ? (
          <p className="mt-1 text-sm text-muted">Also called {bird.aka.join(", ")}</p>
        ) : null}
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{bird.note}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Fact label="Bill" value={bird.bill} />
        <Fact label="Speculum / wing" value={bird.speculum} />
        <Fact label="Drake" value={bird.drake} />
        <Fact label="Hen" value={bird.hen} />
      </dl>

      <section>
        <h2 className="font-display text-xl text-fg">In the hand</h2>
        <ul className="mt-3 space-y-2">
          {bird.inHand.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      {bird.lookalikes.length ? (
        <section>
          <h2 className="font-display text-xl text-fg">Don’t confuse with</h2>
          <ul className="mt-3 space-y-2">
            {bird.lookalikes.map((look) => {
              const other = birdById(look.id);
              return (
                <li key={look.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(look.id)}
                    className="w-full rounded-md bg-surface px-4 py-3 text-left shadow-border hover:bg-elevated"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-fg">{other?.name ?? look.id}</span>
                      <Badge>Lookalike</Badge>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{look.why}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="text-xs leading-relaxed text-subtle">
        ID only. Seasons, sex restrictions, and bag limits change by flyway and unit — check the
        current abstract before you tag it.
      </p>
    </article>
  );
}

function SexPlates({ bird }: { bird: BirdId }) {
  if (!bird.henImage) {
    return (
      <figure>
        <img
          src={bird.image}
          alt={`${bird.name} — sexes alike`}
          className="aspect-plate w-full object-cover"
          crossOrigin="anonymous"
        />
        <figcaption className="px-3 py-2 text-xs tracking-widest text-subtle uppercase">
          Sexes alike
        </figcaption>
      </figure>
    );
  }

  const labelClass = "px-3 py-2 text-xs tracking-widest text-subtle uppercase";

  return (
    <div className="grid grid-cols-2">
      <figure className="min-w-0 border-r border-border">
        <img
          src={bird.image}
          alt={`${bird.name} drake`}
          className="aspect-plate w-full object-cover"
          crossOrigin="anonymous"
        />
        <figcaption className={labelClass}>Drake</figcaption>
      </figure>
      <figure className="min-w-0">
        <img
          src={bird.henImage}
          alt={`${bird.name} hen`}
          className="aspect-plate w-full object-cover"
          crossOrigin="anonymous"
        />
        <figcaption className={labelClass}>Hen</figcaption>
      </figure>
    </div>
  );
}

function Step({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs tracking-widest text-subtle uppercase">
        <span className="flex size-6 items-center justify-center rounded-full bg-elevated font-display text-fg">
          {label}
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full px-4 text-sm transition-colors",
        active ? "bg-sage text-sage-fg" : "bg-elevated text-fg hover:bg-elevated/80",
      )}
    >
      {children}
    </button>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface px-4 py-3 shadow-border">
      <dt className="text-xs tracking-widest text-subtle uppercase">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-fg">{value}</dd>
    </div>
  );
}
