import { useMutation } from "@tanstack/react-query";
import { Compass, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { writeScoutReport } from "@/lib/flyway/brief";
import type { HuntBrief } from "@/lib/flyway/types";

export function ScoutReport({ brief }: { brief: HuntBrief }) {
  const [text, setText] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: () => writeScoutReport({ data: { brief } }),
    onSuccess: (res) => {
      if (res.ok) setText(res.text);
    },
  });

  return (
    <section className="rounded-2xl bg-surface p-4 shadow-border">
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">Scout desk</p>
      <h2 className="mt-1 font-display text-2xl text-fg">Morning report</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Turn the numbers into a short sit brief — what’s moving, how the weather will hunt, and
        which morning looks best.
      </p>
      {text ? (
        <div className="mt-4 space-y-3 font-display text-base leading-relaxed text-fg italic">
          {text.split(/\n{2,}/).map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      ) : (
        <Button className="mt-4" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <Compass />}
          Write scout report
        </Button>
      )}
      {mutation.isError || (mutation.data && !mutation.data.ok) ? (
        <p className="mt-3 text-sm text-hunt-poor">
          {mutation.data && !mutation.data.ok
            ? mutation.data.error
            : "Could not write the report. Try again in a moment."}
        </p>
      ) : null}
    </section>
  );
}
