import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });
