import { createFileRoute } from "@tanstack/react-router";
import { GetAppPage } from "@/components/get-app-page";

export const Route = createFileRoute("/get")({ component: GetAppPage });
