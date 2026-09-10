import { createFileRoute } from "@tanstack/react-router";
import { PublishPage } from "@/components/legal-page";

export const Route = createFileRoute("/publish")({ component: PublishPage });
