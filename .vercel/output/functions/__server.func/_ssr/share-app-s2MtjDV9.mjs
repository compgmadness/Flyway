import { s as placeSearch } from "./places-CS7nVL2c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-app-s2MtjDV9.js
var APK_TYPE = "application/vnd.android.package-archive";
function installUrl(place) {
	if (typeof window === "undefined") return place ? `/get${placeSearch(place)}` : "/get";
	const origin = window.location.origin;
	if (!place) return `${origin}/get`;
	return `${origin}/get${placeSearch(place)}`;
}
async function loadApkFile() {
	try {
		const res = await fetch("/flyway.apk");
		if (!res.ok) return null;
		const buf = await res.arrayBuffer();
		return new File([buf], "Flyway.apk", { type: APK_TYPE });
	} catch {
		return null;
	}
}
async function shareApp(place) {
	const pageUrl = installUrl(place);
	const apkUrl = originApkUrl();
	const title = "Flyway for Android";
	const text = `Install Flyway — waterfowl brief and bag ID.\n\nDownload the app:\n${apkUrl}\n\nOr open in a browser:\n${pageUrl}`;
	if (typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([/* @__PURE__ */ new Uint8Array(0)], "Flyway.apk", { type: APK_TYPE })] })) {
		const file = await loadApkFile();
		if (file) try {
			await navigator.share({
				title,
				text,
				files: [file]
			});
			return "shared-file";
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") return "cancelled";
		}
	}
	try {
		if (typeof navigator.share === "function") {
			await navigator.share({
				title,
				text,
				url: apkUrl
			});
			return "shared-link";
		}
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") return "cancelled";
	}
	await navigator.clipboard.writeText(text);
	return "copied";
}
function originApkUrl() {
	if (typeof window === "undefined") return "/flyway.apk";
	return `${window.location.origin}/flyway.apk`;
}
//#endregion
export { shareApp as t };
