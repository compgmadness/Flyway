import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/components/providers";
import { Dashboard } from "@/components/dashboard";
import { IdGuide } from "@/components/id-guide";
import { CommunityApkPage } from "@/components/community-apk";
import type { AppPage } from "@/components/app-chrome";
import { loadLastPage, saveLastPage } from "@/lib/flyway/community-local";
import "./styles.css";

function readPage(): AppPage {
  if (typeof window === "undefined") return "brief";
  if (window.location.hash === "#id") return "id";
  if (window.location.hash === "#community") return "community";
  return loadLastPage() ?? "brief";
}

function ApkApp() {
  const [page, setPage] = useState<AppPage>(readPage);

  function go(next: AppPage) {
    setPage(next);
    saveLastPage(next === "get" ? "brief" : next);
    window.location.hash =
      next === "id" ? "id" : next === "community" ? "community" : "";
  }

  if (page === "id") return <IdGuide apk onPage={go} />;
  if (page === "community") return <CommunityApkPage onPage={go} />;
  return <Dashboard initialBrief={null} apk onPage={go} />;
}

function mount() {
  const root = document.getElementById("root");
  if (!root) throw new Error("Flyway root missing");
  createRoot(root).render(
    <AppProviders>
      <ApkApp />
    </AppProviders>,
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
