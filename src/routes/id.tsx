import { createFileRoute } from "@tanstack/react-router";
import { IdGuide } from "@/components/id-guide";

export const Route = createFileRoute("/id")({ component: IdPage });

function IdPage() {
  return <IdGuide />;
}
