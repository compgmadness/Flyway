import { createFileRoute } from "@tanstack/react-router";
import { AdsPage } from "@/components/ads-page";

export const Route = createFileRoute("/ads")({ component: AdsPage });
