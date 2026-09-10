import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { _ as Gauge, a as Thermometer, b as Cloud, d as Search, g as LoaderCircle, h as MapPin, m as Moon, n as Wind, o as Sunset, p as Navigation, s as Sunrise, t as X, u as Share2, x as ChevronDown, y as Compass } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, t as AppChrome } from "./app-chrome-D89wH6B7.mjs";
import { t as Input } from "./input-Cja8Jzwt.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { c as placeShareUrl, i as detectFlyway, l as upstreamStations, n as FEATURED_SPOTS, o as placeFromSearch, s as placeSearch, t as DEFAULT_PLACE } from "./places-CS7nVL2c.mjs";
import { t as shareApp } from "./share-app-s2MtjDV9.mjs";
import { t as Badge } from "./badge-CaCNsHuC.mjs";
import { i as scoreTone, n as fetchForecasts, r as longDate, t as buildBrief } from "./scoring-B1AhrkeL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-KqZIOyO6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function searchPlaces(q) {
	const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
	url.searchParams.set("name", q);
	url.searchParams.set("count", "7");
	url.searchParams.set("language", "en");
	url.searchParams.set("format", "json");
	const res = await fetch(url);
	if (!res.ok) return [];
	return ((await res.json()).results ?? []).map((r) => ({
		name: r.name,
		lat: r.latitude,
		lon: r.longitude,
		region: r.admin1 ?? r.country
	}));
}
async function reverseGeocode(lat, lon) {
	const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
	url.searchParams.set("latitude", String(lat));
	url.searchParams.set("longitude", String(lon));
	url.searchParams.set("language", "en");
	url.searchParams.set("format", "json");
	const res = await fetch(url);
	if (!res.ok) return {
		name: "My location",
		lat,
		lon
	};
	const r = (await res.json()).results?.[0];
	if (!r) return {
		name: "My location",
		lat,
		lon
	};
	return {
		name: r.name,
		lat: r.latitude,
		lon: r.longitude,
		region: r.admin1 ?? r.country
	};
}
function LocationDialog({ open, onOpenChange, recents, onSelect }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [geoError, setGeoError] = (0, import_react.useState)(null);
	const [geoBusy, setGeoBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		if (q.length < 2) {
			setHits([]);
			return;
		}
		let cancelled = false;
		setSearching(true);
		const t = window.setTimeout(() => {
			searchPlaces(q).then((rows) => {
				if (!cancelled) setHits(rows);
			}).finally(() => {
				if (!cancelled) setSearching(false);
			});
		}, 220);
		return () => {
			cancelled = true;
			window.clearTimeout(t);
		};
	}, [query]);
	const colorado = (0, import_react.useMemo)(() => FEATURED_SPOTS.filter((s) => s.region === "Colorado"), []);
	const classic = (0, import_react.useMemo)(() => FEATURED_SPOTS.filter((s) => s.region !== "Colorado"), []);
	function pick(place) {
		onSelect(place);
		onOpenChange(false);
		setQuery("");
		setHits([]);
	}
	function useMyLocation() {
		setGeoError(null);
		if (!navigator.geolocation) {
			setGeoError("Location is not available in this browser.");
			return;
		}
		setGeoBusy(true);
		navigator.geolocation.getCurrentPosition((pos) => {
			reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((place) => pick(place)).catch(() => pick({
				name: "My location",
				lat: pos.coords.latitude,
				lon: pos.coords.longitude
			})).finally(() => setGeoBusy(false));
		}, () => {
			setGeoBusy(false);
			setGeoError("Could not read your location. Search a marsh instead.");
		}, {
			enableHighAccuracy: false,
			timeout: 8e3
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-border sm:inset-y-auto sm:top-1/2 sm:bottom-auto sm:max-h-[80dvh] sm:-translate-y-1/2 sm:rounded-2xl sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-xl text-fg",
						children: "Hunt location"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "mt-1 text-sm text-muted",
						children: "Search a town or jump to a known flyway marsh."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search city or refuge",
						className: "pl-10",
						autoFocus: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					className: "mt-3 w-full",
					onClick: useMyLocation,
					disabled: geoBusy,
					children: [geoBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, {}), "Use my location"]
				}),
				geoError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-hunt-poor",
					children: geoError
				}) : null,
				query.trim().length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1",
					children: searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-2 py-3 text-sm text-muted",
						children: "Searching…"
					}) : hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-2 py-3 text-sm text-muted",
						children: "No places found."
					}) : hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceRow, {
						place: hit,
						onClick: () => pick(hit)
					}) }, `${hit.name}-${hit.lat}`))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-5",
					children: [
						recents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotGroup, {
							title: "Recent",
							spots: recents,
							onPick: pick
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotGroup, {
							title: "Colorado",
							spots: colorado,
							onPick: pick
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotGroup, {
							title: "Classic flyway hunts",
							spots: classic,
							onPick: pick
						})
					]
				})
			]
		})] })
	});
}
function SpotGroup({ title, spots, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "mb-2 text-xs font-medium tracking-widest text-subtle uppercase",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1",
		children: spots.map((spot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceRow, {
			place: spot,
			onClick: () => onPick(spot)
		}) }, `${spot.name}-${spot.lat}`))
	})] });
}
function PlaceRow({ place, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left hover:bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 shrink-0 text-sage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm text-fg",
				children: place.name
			}), place.region ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-xs text-muted",
				children: place.region
			}) : null]
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-elevated", className),
		...props
	});
}
var memory = /* @__PURE__ */ new Map();
var TTL_MS = 18e5;
var DISK_TTL_MS = 216e5;
var LS_KEY = "flyway:wx-cache";
function cacheKey(place) {
	const hour = (/* @__PURE__ */ new Date()).toISOString().slice(0, 13);
	return `${place.lat.toFixed(2)},${place.lon.toFixed(2)}:${hour}`;
}
function placeKey(place) {
	return `${place.lat.toFixed(2)}_${place.lon.toFixed(2)}`;
}
function readLocal(place) {
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return null;
		const hit = JSON.parse(raw)[placeKey(place)];
		if (!hit?.brief || typeof hit.at !== "number") return null;
		if (Date.now() - hit.at > DISK_TTL_MS) return null;
		return hit;
	} catch {
		return null;
	}
}
function writeLocal(place, brief) {
	try {
		const raw = localStorage.getItem(LS_KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		parsed[placeKey(place)] = {
			at: Date.now(),
			brief
		};
		localStorage.setItem(LS_KEY, JSON.stringify(parsed));
	} catch {}
}
async function loadBrief(place) {
	const key = cacheKey(place);
	const hit = memory.get(key);
	if (hit && Date.now() - hit.at < TTL_MS) return hit.brief;
	const stored = readLocal(place);
	if (stored && Date.now() - stored.at < TTL_MS) {
		memory.set(key, stored);
		return stored.brief;
	}
	const flyway = detectFlyway(place.lon);
	const north = upstreamStations(place, flyway);
	try {
		const forecasts = await fetchForecasts([place, ...north]);
		const local = forecasts[0];
		if (!local) throw new Error("Weather service returned no data");
		const up = north.map((station, i) => ({
			place: station,
			wx: forecasts[i + 1] ?? local
		})).filter((row) => row.wx);
		const brief = buildBrief(place, local, up);
		const entry = {
			at: Date.now(),
			brief
		};
		memory.set(key, entry);
		writeLocal(place, brief);
		return brief;
	} catch (err) {
		if (hit) return hit.brief;
		if (stored) return stored.brief;
		throw err;
	}
}
var LOC_KEY = "flyway:location";
var RECENTS_KEY = "flyway:recents";
function loadStoredPlace() {
	try {
		const raw = localStorage.getItem(LOC_KEY);
		if (!raw) return DEFAULT_PLACE;
		const parsed = JSON.parse(raw);
		if (typeof parsed.lat === "number" && typeof parsed.lon === "number") return parsed;
	} catch {}
	return DEFAULT_PLACE;
}
function loadRecents() {
	try {
		const raw = localStorage.getItem(RECENTS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
	} catch {
		return [];
	}
}
function persist(place, recents) {
	localStorage.setItem(LOC_KEY, JSON.stringify(place));
	const next = [place, ...recents.filter((r) => r.name !== place.name || r.lat !== place.lat)].slice(0, 5);
	localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
	return next;
}
function ratingTone(rating) {
	if (rating === "Prime" || rating === "Exceptional") return "sage";
	if (rating === "Good") return "good";
	if (rating === "Fair") return "fair";
	return "poor";
}
function writePlaceUrl(place) {
	if (typeof window === "undefined") return;
	const next = placeSearch(place);
	if (`${window.location.search}` !== next) window.history.replaceState(null, "", `${window.location.pathname}${next}`);
}
async function shareSit(place, brief) {
	const host = typeof window !== "undefined" ? window.location.hostname : "";
	const url = host !== "" && host !== "app.flyway.brief" ? placeShareUrl(place) : void 0;
	const title = `Flyway — ${place.name}`;
	const text = brief ? `${brief.score.value} ${brief.score.rating} at ${place.name}. ${brief.score.headline}` : `Live waterfowl migration brief for ${place.name}`;
	try {
		if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
			await navigator.share(url ? {
				title,
				text,
				url
			} : {
				title,
				text
			});
			return "shared";
		}
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") return "cancelled";
	}
	const payload = url ? `${title}\n${text}\n${url}` : `${title}\n${text}`;
	await navigator.clipboard.writeText(payload);
	return "copied";
}
function Dashboard({ initialBrief, apk = false, extra, onPage }) {
	const [place, setPlace] = (0, import_react.useState)(DEFAULT_PLACE);
	const [recents, setRecents] = (0, import_react.useState)([]);
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const [shareNote, setShareNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const fromUrl = placeFromSearch(window.location.search);
		if (fromUrl) {
			setPlace(fromUrl);
			setRecents(persist(fromUrl, loadRecents()));
			return;
		}
		const stored = loadStoredPlace();
		setPlace(stored);
		setRecents(loadRecents());
		writePlaceUrl(stored);
	}, []);
	const matchesInitial = !!initialBrief && Math.abs(place.lat - initialBrief.location.lat) < .05 && Math.abs(place.lon - initialBrief.location.lon) < .05;
	const brief = useQuery({
		queryKey: [
			"brief",
			place.lat,
			place.lon,
			place.name
		],
		queryFn: () => loadBrief(place),
		initialData: matchesInitial && initialBrief ? initialBrief : void 0,
		initialDataUpdatedAt: matchesInitial ? Date.now() : void 0,
		retry: 1,
		retryDelay: 2e3,
		placeholderData: keepPreviousData
	});
	function selectPlace(next) {
		setPlace(next);
		setRecents(persist(next, recents));
		writePlaceUrl(next);
	}
	async function onShareApp() {
		const result = await shareApp(place);
		if (result === "shared-file") setShareNote("Pick a chat — Flyway.apk is attached");
		if (result === "shared-link") setShareNote("Install link sent");
		if (result === "copied") setShareNote("Install link copied — send it to testers");
		if (result !== "cancelled") window.setTimeout(() => setShareNote(null), 3200);
	}
	async function onShareSit() {
		const result = await shareSit(place, brief.data);
		if (result === "copied") setShareNote("Sit link copied");
		if (result === "shared") setShareNote("Shared");
		if (result !== "cancelled") window.setTimeout(() => setShareNote(null), 2800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppChrome, {
				page: "brief",
				apk,
				onPage,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPickerOpen(true),
					className: "flex min-h-11 max-w-28 items-center gap-2 rounded-md px-2 text-right hover:bg-elevated sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm text-fg",
							children: place.name
						}), place.region ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-xs text-muted",
							children: place.region
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-muted" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "shrink-0",
					"aria-label": apk ? "Share this marsh" : "Share Flyway app",
					onClick: () => void (apk ? onShareSit() : onShareApp()),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationDialog, {
				open: pickerOpen,
				onOpenChange: setPickerOpen,
				recents,
				onSelect: selectPlace
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10",
				children: [
					!brief.data && brief.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefSkeleton, {}) : null,
					brief.isError && !brief.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorPanel, {
						message: brief.error instanceof Error ? brief.error.message : "The live forecast didn’t load. Check the pin and try again.",
						onRetry: () => void brief.refetch()
					}) : null,
					brief.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefView, {
						data: brief.data,
						extra,
						onShare: () => void onShareSit()
					}) : null
				]
			}),
			shareNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-4 z-50 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md bg-elevated px-4 py-2 text-sm text-fg shadow-border",
					children: shareNote
				})
			}) : null
		]
	});
}
function BriefView({ data, extra, onShare }) {
	const bestDay = (0, import_react.useMemo)(() => {
		return data.days.reduce((best, day) => day.score > best.score ? day : best, data.days[0] ?? {
			score: 0,
			date: ""
		});
	}, [data.days]);
	const glass = data.now.pressureChange24h;
	const glassLabel = glass <= -1.5 ? "falling" : glass >= 1.5 ? "rising" : "steady";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid items-center gap-8 lg:grid-cols-[auto_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
					value: data.score.value,
					rating: data.score.rating
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium tracking-widest text-subtle uppercase",
						children: [
							data.flyway.name,
							" · ",
							data.season.name,
							" · ",
							longDate(data.now.time.slice(0, 10))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 max-w-2xl font-display text-3xl leading-tight text-fg sm:text-4xl",
						children: data.score.headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base",
						children: data.score.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: ratingTone(data.score.rating),
								children: [data.score.rating, " sit"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: data.incoming.headline }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [
								data.now.weatherLabel,
								" · ",
								data.now.windCardinal,
								" ",
								data.now.windMph.toFixed(0),
								" mph"
							] })
						]
					}),
					onShare ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						className: "mt-4",
						onClick: onShare,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {}), "Share this sit"]
					}) : null
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "size-4" }),
						label: "Temperature",
						value: `${data.now.tempF.toFixed(0)}°`,
						hint: `Feels ${data.now.feelsF.toFixed(0)}°`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "size-4" }),
						label: "Wind",
						value: `${data.now.windMph.toFixed(0)} mph`,
						hint: `${data.now.windCardinal} · gusts ${data.now.windGustMph.toFixed(0)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-4" }),
						label: "The glass",
						value: `${data.now.pressureInHg.toFixed(2)}`,
						hint: `${glassLabel} · ${glass >= 0 ? "+" : ""}${glass.toFixed(1)} hPa`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-4" }),
						label: "Sky",
						value: `${data.now.cloudCover.toFixed(0)}%`,
						hint: data.now.weatherLabel
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-surface p-4 shadow-border lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, { children: "Coming down the flyway" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl text-fg",
							children: data.incoming.headline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: data.incoming.detail
						}),
						data.incoming.stations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "No upflyway stations north of this pin. You’re hunting the top of the corridor."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-2 sm:grid-cols-3",
							children: data.incoming.stations.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md bg-elevated px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs tracking-widest text-subtle uppercase",
										children: [s.distanceMi.toFixed(0), " mi north"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 truncate text-sm text-fg",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-display text-2xl tabular-nums leading-none",
										children: [s.tempF.toFixed(0), "°"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-muted",
										children: [
											s.windCardinal,
											" ",
											s.windMph.toFixed(0),
											" · ",
											s.weatherLabel,
											s.freezing ? " · freeze" : ""
										]
									})
								]
							}, s.name))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-surface p-4 shadow-border lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, { children: "Moon & legal light" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "mt-1 size-4 text-sage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-fg",
								children: [
									data.moon.phase,
									" · ",
									Math.round(data.moon.illumination * 100),
									"% lit"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: data.moon.huntingNote
							})] })]
						}),
						data.days[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-elevated px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "flex items-center gap-1.5 text-xs text-subtle",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sunrise, { className: "size-3.5" }), " Dawn"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-display text-lg tabular-nums",
										children: data.days[0].legalAm
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "30 min before sunrise"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-elevated px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "flex items-center gap-1.5 text-xs text-subtle",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sunset, { className: "size-3.5" }), " Dusk"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-display text-lg tabular-nums",
										children: data.days[0].legalPm
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Sunset, federal framework"
									})
								]
							})]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex items-end justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, { children: "Seven-day hunt odds" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl text-fg",
					children: "When to sit"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0",
				children: data.days.map((day) => {
					const isBest = day.date === bestDay.date;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cn("w-32 shrink-0 rounded-xl bg-surface p-3 shadow-border sm:w-auto sm:min-w-0 sm:flex-1", isBest && "ring-1 ring-sage/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-subtle uppercase",
								children: day.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-2 font-display text-3xl tabular-nums leading-none", scoreTone(day.rating)),
								children: day.score
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: day.rating
							}),
							isBest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-sage",
								children: "Best sit"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: [
									day.tempMin.toFixed(0),
									"° / ",
									day.tempMax.toFixed(0),
									"°"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									day.windCardinal,
									" ",
									day.windMph.toFixed(0)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-subtle",
								children: day.weatherLabel
							})
						]
					}, day.date);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-surface p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, { children: "Species in play" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl text-fg",
							children: "What’s on the wing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 divide-y divide-border",
							children: data.species.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-fg",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs leading-relaxed text-muted",
										children: s.note
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: s.inPlay ? "sage" : "muted",
									children: s.statusLabel
								})]
							}, s.id))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-surface p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, { children: "Why this number" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl text-fg",
							children: "Weather model"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-4",
							children: data.score.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-fg",
										children: f.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs tabular-nums text-muted",
										children: [
											f.score,
											"/",
											f.max
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-sage",
										style: { width: `${Math.min(100, f.score / f.max * 100)}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs leading-relaxed text-muted",
									children: f.detail
								})
							] }, f.id))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-surface p-4 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, { children: "Hunt windows" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl text-fg",
						children: "Dawn and dusk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
						children: data.windows.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md bg-elevated px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs tracking-widest text-subtle uppercase",
										children: w.kind === "dawn" ? "Dawn" : "Dusk"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("text-sm tabular-nums", scoreTone(w.score >= 65 ? "Prime" : w.score >= 50 ? "Good" : w.score >= 30 ? "Fair" : "Poor")),
										children: w.score
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-fg",
									children: w.when
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: w.note
								})
							]
						}, `${w.when}-${w.kind}`))
					})
				]
			}),
			extra ? extra(data) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border pt-6 pb-10 text-xs leading-relaxed text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Hunt odds combine live weather (Open-Meteo), upflyway stations, moon phase, and typical species calendars shifted for latitude. This is a field model, not a count of birds and not legal advice. Check your state’s season, shooting hours, and bag limits before you go." })
			})
		]
	});
}
function ScoreRing({ value, rating }) {
	const r = 52;
	const c = 2 * Math.PI * r;
	const dash = value / 100 * c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto size-44 sm:mx-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 128 128",
			className: "size-full -rotate-90",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "64",
				cy: "64",
				r,
				fill: "none",
				className: "stroke-elevated",
				strokeWidth: "8"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "64",
				cy: "64",
				r,
				fill: "none",
				className: cn("stroke-current", scoreTone(rating)),
				strokeWidth: "8",
				strokeLinecap: "round",
				strokeDasharray: `${dash} ${c}`
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-5xl tabular-nums leading-none text-fg",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 text-xs tracking-widest text-muted uppercase",
				children: rating
			})]
		})]
	});
}
function Stat({ icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-1.5 text-xs tracking-widest text-subtle uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sage",
					children: icon
				}), label]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl tabular-nums leading-none text-fg",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: hint
			})
		]
	});
}
function SectionKicker({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-medium tracking-widest text-subtle uppercase",
		children
	});
}
function BriefSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Reading the glass…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-6 sm:flex-row",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-44 rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-48" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full max-w-md" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full max-w-xl" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" })
		]
	});
}
function ErrorPanel({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface p-6 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl text-fg",
				children: "Could not reach the weather desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				onClick: onRetry,
				children: "Try again"
			})
		]
	});
}
function parsePlace(input) {
	const o = input;
	if (typeof o?.lat !== "number" || typeof o?.lon !== "number") throw new Error("lat and lon required");
	if (!Number.isFinite(o.lat) || !Number.isFinite(o.lon)) throw new Error("invalid coordinates");
	if (o.lat < -90 || o.lat > 90 || o.lon < -180 || o.lon > 180) throw new Error("coordinates out of range");
	return {
		lat: o.lat,
		lon: o.lon,
		name: typeof o.name === "string" && o.name.trim() ? o.name.trim().slice(0, 80) : "Pinned location",
		region: typeof o.region === "string" ? o.region.slice(0, 80) : void 0
	};
}
createServerFn({ method: "POST" }).validator((input) => parsePlace(input)).handler(createSsrRpc("9e34ef1942c2c728c4aaf635e5406c451847ee6831927bf889a0cf8dd6a720a0"));
var writeScoutReport = createServerFn({ method: "POST" }).validator((input) => {
	const o = input;
	if (!o?.brief || typeof o.brief !== "object") throw new Error("brief required");
	return { brief: o.brief };
}).handler(createSsrRpc("0441062ac7f6f3d77fa58ba404b8dada76c8f559070cd6d732719d7d122a3c82"));
function ScoutReport({ brief }) {
	const [text, setText] = (0, import_react.useState)(null);
	const mutation = useMutation({
		mutationFn: () => writeScoutReport({ data: { brief } }),
		onSuccess: (res) => {
			if (res.ok) setText(res.text);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-surface p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-subtle uppercase",
				children: "Scout desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl text-fg",
				children: "Morning report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Turn the numbers into a short sit brief — what’s moving, how the weather will hunt, and which morning looks best."
			}),
			text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3 font-display text-base leading-relaxed text-fg italic",
				children: text.split(/\n{2,}/).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4",
				onClick: () => mutation.mutate(),
				disabled: mutation.isPending,
				children: [mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {}), "Write scout report"]
			}),
			mutation.isError || mutation.data && !mutation.data.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-hunt-poor",
				children: mutation.data && !mutation.data.ok ? mutation.data.error : "Could not write the report. Try again in a moment."
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
		initialBrief: null,
		extra: (brief) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoutReport, { brief })
	});
}
//#endregion
export { Home as component };
