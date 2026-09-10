import { placeSearch } from "./places";
import type { Place } from "./types";

const APK_TYPE = "application/vnd.android.package-archive";

export function installUrl(place?: Place): string {
  if (typeof window === "undefined") {
    return place ? `/get${placeSearch(place)}` : "/get";
  }
  const origin = window.location.origin;
  if (!place) return `${origin}/get`;
  return `${origin}/get${placeSearch(place)}`;
}

export async function loadApkFile(): Promise<File | null> {
  try {
    const res = await fetch("/flyway.apk");
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new File([buf], "Flyway.apk", { type: APK_TYPE });
  } catch {
    return null;
  }
}

export async function shareApp(
  place?: Place,
): Promise<"shared-file" | "shared-link" | "copied" | "cancelled"> {
  const pageUrl = installUrl(place);
  const apkUrl = originApkUrl();
  const title = "Flyway for Android";
  const text = `Install Flyway — waterfowl brief and bag ID.\n\nDownload the app:\n${apkUrl}\n\nOr open in a browser:\n${pageUrl}`;

  const fileShareOk =
    typeof navigator.canShare === "function" &&
    navigator.canShare({
      files: [new File([new Uint8Array(0)], "Flyway.apk", { type: APK_TYPE })],
    });

  if (fileShareOk) {
    const file = await loadApkFile();
    if (file) {
      try {
        await navigator.share({ title, text, files: [file] });
        return "shared-file";
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return "cancelled";
      }
    }
  }

  try {
    if (typeof navigator.share === "function") {
      await navigator.share({ title, text, url: apkUrl });
      return "shared-link";
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "cancelled";
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}

function originApkUrl(): string {
  if (typeof window === "undefined") return "/flyway.apk";
  return `${window.location.origin}/flyway.apk`;
}
