import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  considerNorthPush,
  ensureNotifyPermission,
  loadNorthWatch,
  setNorthWatchEnabled,
  syncNativeWatch,
  type NorthWatch,
} from "@/lib/flyway/push-watch";
import { isIdealNorthPush } from "@/lib/flyway/scoring";
import type { HuntBrief } from "@/lib/flyway/types";

export function PushWatchCard({ brief }: { brief: HuntBrief }) {
  const [watch, setWatch] = useState<NorthWatch>(() => loadNorthWatch());
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const canWatch = brief.incoming.stations.length > 0;

  useEffect(() => {
    if (!watch.enabled) return;
    syncNativeWatch(brief);
    void considerNorthPush(brief);
  }, [brief, watch.enabled]);

  async function toggle() {
    if (!canWatch) return;
    setBusy(true);
    setNote(null);
    try {
      if (!watch.enabled) {
        const ok = await ensureNotifyPermission();
        if (!ok) {
          setNote("Notifications are blocked on this device. Allow them in system settings.");
          setBusy(false);
          return;
        }
      }
      const next = await setNorthWatchEnabled(!watch.enabled, brief);
      setWatch(next);
      setNote(
        next.enabled
          ? `Watching the north of ${brief.location.name}. We’ll ping you when a push is on.`
          : "Push alerts are off.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-md bg-elevated px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">Push alerts</p>
          <p className="mt-1 text-sm text-fg">
            {watch.enabled ? "Watching the north" : "Ping me when birds should move"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {canWatch
              ? `Freeze, a north wind, and falling glass upflyway of ${brief.location.name}.`
              : "No stations north of this pin to watch."}
          </p>
          {isIdealNorthPush(brief.incoming.level) ? (
            <p className="mt-2 text-xs text-sage">Conditions up north are already in the window.</p>
          ) : null}
          {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
        </div>
        <Button
          type="button"
          variant={watch.enabled ? "default" : "secondary"}
          className="h-11 shrink-0 px-3"
          disabled={!canWatch || busy}
          onClick={() => void toggle()}
        >
          {watch.enabled ? <Bell /> : <BellOff />}
          <span className="hidden sm:inline">{watch.enabled ? "On" : "Off"}</span>
        </Button>
      </div>
    </div>
  );
}
