import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";
import { ScoutReport } from "@/components/scout-report";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <Dashboard
      initialBrief={null}
      extra={(brief) => <ScoutReport brief={brief} />}
    />
  );
}
