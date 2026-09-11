import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  APP_VERSION,
  UPDATE_APK_URL,
  UPDATE_BODY,
  UPDATE_HEADLINE,
  dismissUpdate,
  isUpdateDismissed,
  pingAllUsers,
} from "@/lib/flyway/update";

export function UpdatePing({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(() => !isUpdateDismissed());

  useEffect(() => {
    void pingAllUsers();
    const sync = () => setOpen(!isUpdateDismissed());
    window.addEventListener("flyway-update-change", sync);
    return () => window.removeEventListener("flyway-update-change", sync);
  }, []);

  if (!open) return null;

  return (
    <aside className="rounded-2xl bg-surface p-4 shadow-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">
            Desk · {APP_VERSION}
          </p>
          <h2 className={compact ? "mt-1 font-display text-lg text-fg" : "mt-1 font-display text-2xl text-fg"}>
            {UPDATE_HEADLINE}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{UPDATE_BODY}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Dismiss update"
          onClick={() => {
            dismissUpdate();
            setOpen(false);
          }}
        >
          <X />
        </Button>
      </div>
      <a
        href={UPDATE_APK_URL}
        className="mt-4 flex min-h-11 items-center justify-center rounded-md bg-sage px-4 text-sm font-medium text-sage-fg hover:bg-sage/90"
      >
        Get the update
      </a>
    </aside>
  );
}
