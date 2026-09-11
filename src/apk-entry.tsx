import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/components/providers";
import { Dashboard } from "@/components/dashboard";
import { IdGuide } from "@/components/id-guide";
import { CommunityApkPage } from "@/components/community-apk";
import type { AppPage } from "@/components/app-chrome";
import { loadLastPage, saveLastPage } from "@/lib/flyway/community-local";
import { pingAllUsers } from "@/lib/flyway/update";
import "./styles.css";

type Insets = { top: number; bottom: number; left: number; right: number };

declare global {
  interface Window {
    FlywayChrome?: { insets: () => string };
    __FLYWAY_INSETS__?: Insets;
    __FLYWAY_APPLY_INSETS__?: (top: number, bottom: number, left: number, right: number) => void;
  }
}

function applyInsets(top = 0, bottom = 0, left = 0, right = 0) {
  const root = document.documentElement.style;
  root.setProperty("--flyway-inset-top", `${top}px`);
  root.setProperty("--flyway-inset-bottom", `${bottom}px`);
  root.setProperty("--flyway-inset-left", `${left}px`);
  root.setProperty("--flyway-inset-right", `${right}px`);
}

function readNativeInsets(): Insets | null {
  try {
    const raw = window.FlywayChrome?.insets?.();
    if (raw) return JSON.parse(raw) as Insets;
  } catch {
    /* bridge not ready */
  }
  return window.__FLYWAY_INSETS__ ?? null;
}

function syncNativeInsets() {
  const next = readNativeInsets();
  if (!next) return;
  applyInsets(next.top || 0, next.bottom || 0, next.left || 0, next.right || 0);
}

window.__FLYWAY_APPLY_INSETS__ = applyInsets;
syncNativeInsets();

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
  syncNativeInsets();
  window.addEventListener("resize", syncNativeInsets);
  window.visualViewport?.addEventListener("resize", syncNativeInsets);
  void pingAllUsers();
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
