import { Link } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export type AppPage = "brief" | "id" | "get" | "community";

const APK = import.meta.env.VITE_APK_BUILD === "1";

const SUBTITLE: Record<AppPage, string> = {
  brief: "Migration brief",
  id: "Bag identification",
  get: "Get the app",
  community: "The lodge",
};

export function FlockMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={40}
      height={40}
      className={cn("size-10 shrink-0 rounded-full sm:size-11", className)}
      aria-hidden="true"
    />
  );
}

export function AppChrome({
  page,
  apk = APK,
  onPage,
  actions,
}: {
  page: AppPage;
  apk?: boolean;
  onPage?: (next: AppPage) => void;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg pt-[var(--flyway-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <FlockMark />
          <div className="min-w-0">
            <p className="font-display text-lg leading-none text-fg">Flyway</p>
            <p className="mt-1 truncate text-xs tracking-widest text-subtle uppercase">
              {SUBTITLE[page]}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-1">
          {actions}
          {apk ? null : <AuthSlot />}
          {apk || page === "get" ? null : (
            <Button asChild variant="secondary" className="h-11 shrink-0 px-3">
              <Link to="/get">
                <Smartphone />
                <span className="hidden sm:inline">Get app</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-1 px-3 pb-2 sm:px-6 sm:pb-3">
        <NavItem
          label="Brief"
          active={page === "brief"}
          apk={apk}
          href="/"
          onClick={() => onPage?.("brief")}
        />
        <NavItem
          label="Bag ID"
          active={page === "id"}
          apk={apk}
          href="/id"
          onClick={() => onPage?.("id")}
        />
        <NavItem
          label="Community"
          active={page === "community"}
          apk={apk}
          href="/community"
          onClick={() => onPage?.("community")}
        />
      </nav>
    </header>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="hidden size-11 shrink-0 rounded-md bg-elevated sm:block" aria-hidden="true" />;
  }
  if (user) {
    return (
      <div className="hidden min-w-0 sm:block">
        <UserButton />
      </div>
    );
  }
  return (
    <Button asChild variant="ghost" className="hidden h-11 shrink-0 px-3 sm:inline-flex">
      <Link to="/login">Sign in</Link>
    </Button>
  );
}

function NavItem({
  label,
  active,
  apk,
  href,
  onClick,
}: {
  label: string;
  active: boolean;
  apk: boolean;
  href: string;
  onClick: () => void;
}) {
  const className = cn(
    "inline-flex h-10 flex-1 items-center justify-center rounded-md text-sm font-medium transition-colors sm:h-11 sm:flex-none sm:px-6",
    active ? "bg-sage text-sage-fg" : "bg-elevated text-fg hover:bg-elevated/80",
  );
  if (apk) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
    );
  }
  return (
    <Link to={href} className={className}>
      {label}
    </Link>
  );
}
