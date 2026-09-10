import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CIT8-xkv.mjs";
import { g as LoaderCircle, h as MapPin, i as Trash2 } from "../_libs/lucide-react.mjs";
import { a as useCurrentUserState, i as cn, n as Button, t as AppChrome } from "./app-chrome-D89wH6B7.mjs";
import { t as Input } from "./input-Cja8Jzwt.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-B8MSnb52.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLYWAYS = [
	"pacific",
	"central",
	"mississippi",
	"atlantic"
];
function clean(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function parseFlyway(value) {
	if (typeof value === "string" && FLYWAYS.includes(value)) return value;
	throw new Error("Unknown flyway");
}
function parseHandle(value) {
	const handle = clean(value, 20).toLowerCase();
	if (!/^[a-z0-9_]{3,20}$/.test(handle)) throw new Error("Handle must be 3–20 letters, numbers, or underscores.");
	return handle;
}
var listReports = createServerFn({ method: "POST" }).validator((input) => {
	const o = input ?? {};
	return {
		flyway: parseFlyway(o.flyway),
		state: clean(o.state, 8).toUpperCase(),
		city: clean(o.city, 48)
	};
}).handler(createSsrRpc("8362918a5a19e3ab3a5946f1c46c4509752426586acb1aa76f7f09bd2b21df33"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1cc2c623df8466285a8cd790bf6ea84db42951134c4c132707649bbf913a5d15"));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = input ?? {};
	const displayName = clean(o.displayName, 32);
	if (displayName.length < 2) throw new Error("Give a name the lodge can call you.");
	const homeCity = clean(o.homeCity, 48);
	if (homeCity.length < 2) throw new Error("City is required.");
	const homeState = clean(o.homeState, 8).toUpperCase();
	if (homeState.length !== 2) throw new Error("Pick a state.");
	return {
		handle: parseHandle(o.handle),
		displayName,
		homeFlyway: parseFlyway(o.homeFlyway),
		homeState,
		homeCity,
		bio: clean(o.bio, 160)
	};
}).handler(createSsrRpc("04bb0a6347fc6cd85d629f60d725fb042646896c5f29247f0163961c29665fe0"));
var createReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = input ?? {};
	const city = clean(o.city, 48);
	if (city.length < 2) throw new Error("City is required.");
	const state = clean(o.state, 8).toUpperCase();
	if (state.length !== 2) throw new Error("Pick a state.");
	const body = clean(o.body, 500);
	if (body.length < 8) throw new Error("Tell the lodge a little more.");
	return {
		flyway: parseFlyway(o.flyway),
		state,
		city,
		species: clean(o.species, 40),
		body
	};
}).handler(createSsrRpc("c973b615e1d05f70701a2b0825ae571ddf34277eb3fb3b165021c5e4a21f829d"));
var deleteReport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const id = typeof input === "number" ? input : Number(input?.id);
	if (!Number.isInteger(id) || id < 1) throw new Error("Missing report");
	return id;
}).handler(createSsrRpc("beb4909c5136d07a4c4f0d534a60146c93e67fd7fff53c0ffd158d5f086f75b0"));
var FLYWAY_OPTIONS = [
	{
		id: "pacific",
		label: "Pacific"
	},
	{
		id: "central",
		label: "Central"
	},
	{
		id: "mississippi",
		label: "Mississippi"
	},
	{
		id: "atlantic",
		label: "Atlantic"
	}
];
var STATES_BY_FLYWAY = {
	pacific: [
		{
			code: "AK",
			name: "Alaska"
		},
		{
			code: "WA",
			name: "Washington"
		},
		{
			code: "OR",
			name: "Oregon"
		},
		{
			code: "CA",
			name: "California"
		},
		{
			code: "ID",
			name: "Idaho"
		},
		{
			code: "NV",
			name: "Nevada"
		},
		{
			code: "UT",
			name: "Utah"
		},
		{
			code: "AZ",
			name: "Arizona"
		}
	],
	central: [
		{
			code: "MT",
			name: "Montana"
		},
		{
			code: "WY",
			name: "Wyoming"
		},
		{
			code: "CO",
			name: "Colorado"
		},
		{
			code: "NM",
			name: "New Mexico"
		},
		{
			code: "ND",
			name: "North Dakota"
		},
		{
			code: "SD",
			name: "South Dakota"
		},
		{
			code: "NE",
			name: "Nebraska"
		},
		{
			code: "KS",
			name: "Kansas"
		},
		{
			code: "OK",
			name: "Oklahoma"
		},
		{
			code: "TX",
			name: "Texas"
		}
	],
	mississippi: [
		{
			code: "MN",
			name: "Minnesota"
		},
		{
			code: "WI",
			name: "Wisconsin"
		},
		{
			code: "IA",
			name: "Iowa"
		},
		{
			code: "MO",
			name: "Missouri"
		},
		{
			code: "AR",
			name: "Arkansas"
		},
		{
			code: "LA",
			name: "Louisiana"
		},
		{
			code: "MS",
			name: "Mississippi"
		},
		{
			code: "AL",
			name: "Alabama"
		},
		{
			code: "IL",
			name: "Illinois"
		},
		{
			code: "IN",
			name: "Indiana"
		},
		{
			code: "KY",
			name: "Kentucky"
		},
		{
			code: "TN",
			name: "Tennessee"
		},
		{
			code: "MI",
			name: "Michigan"
		},
		{
			code: "OH",
			name: "Ohio"
		}
	],
	atlantic: [
		{
			code: "ME",
			name: "Maine"
		},
		{
			code: "NH",
			name: "New Hampshire"
		},
		{
			code: "VT",
			name: "Vermont"
		},
		{
			code: "MA",
			name: "Massachusetts"
		},
		{
			code: "NY",
			name: "New York"
		},
		{
			code: "NJ",
			name: "New Jersey"
		},
		{
			code: "PA",
			name: "Pennsylvania"
		},
		{
			code: "DE",
			name: "Delaware"
		},
		{
			code: "MD",
			name: "Maryland"
		},
		{
			code: "VA",
			name: "Virginia"
		},
		{
			code: "NC",
			name: "North Carolina"
		},
		{
			code: "SC",
			name: "South Carolina"
		},
		{
			code: "GA",
			name: "Georgia"
		},
		{
			code: "FL",
			name: "Florida"
		},
		{
			code: "WV",
			name: "West Virginia"
		}
	]
};
var CITIES_BY_STATE = {
	CO: [
		"Denver",
		"Pueblo",
		"Sterling",
		"Fort Morgan",
		"Alamosa",
		"Lamar"
	],
	ND: [
		"Bismarck",
		"Minot",
		"Devils Lake",
		"Fargo"
	],
	SD: [
		"Pierre",
		"Aberdeen",
		"Sand Lake"
	],
	NE: [
		"North Platte",
		"Valentine",
		"Kearney"
	],
	TX: [
		"Amarillo",
		"Lubbock",
		"Midland",
		"Anahuac"
	],
	AR: ["Stuttgart", "St. Charles"],
	LA: [
		"Lafayette",
		"Monroe",
		"Gueydan"
	],
	MN: ["Minneapolis", "Thief River Falls"],
	WI: ["Horicon", "Green Bay"],
	MO: ["Squaw Creek", "St. Louis"],
	IA: ["Des Moines", "Forney Lake"],
	CA: [
		"Sacramento",
		"Los Banos",
		"Klamath"
	],
	OR: ["Klamath Falls", "Columbia River"],
	WA: ["Puget Sound", "Othello"],
	UT: ["Great Salt Lake", "Delta"],
	MD: ["Chesapeake Bay", "Eastern Shore"],
	NC: ["Mattamuskeet", "Currituck"],
	NY: ["Montezuma", "Long Island"],
	FL: ["Lake Okeechobee", "Tampa Bay"]
};
var REPORT_SPECIES = [
	"Mallard",
	"Gadwall",
	"Wigeon",
	"Pintail",
	"Shoveler",
	"Blue-winged teal",
	"Green-winged teal",
	"Canvasback",
	"Redhead",
	"Scaup",
	"Canada goose",
	"Snow goose",
	"White-front",
	"Mixed bag",
	"Other"
];
function stateName(code) {
	for (const list of Object.values(STATES_BY_FLYWAY)) {
		const hit = list.find((s) => s.code === code);
		if (hit) return hit.name;
	}
	return code;
}
var APK = false;
var selectClass = "flex h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-border outline-none focus-visible:ring-2 focus-visible:ring-ring/70";
var areaClass = "min-h-28 w-full rounded-md bg-elevated px-3 py-3 text-sm leading-relaxed text-fg shadow-border outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/70";
function CommunityPage({ apk = APK, onPage }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppChrome, {
			page: "community",
			apk,
			onPage
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8",
			children: apk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApkNote, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lodge, {})
		})]
	});
}
function ApkNote() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg bg-surface px-4 py-6 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-subtle uppercase",
				children: "The lodge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl text-fg",
				children: "Community lives on the live desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: "Field reports need a signed-in hunter. Open Flyway in a browser, tap Community, and post what you saw on your flyway."
			})
		]
	});
}
function Lodge() {
	const queryClient = useQueryClient();
	const { user, isPending } = useCurrentUserState();
	const [flyway, setFlyway] = (0, import_react.useState)("central");
	const [state, setState] = (0, import_react.useState)("CO");
	const [city, setCity] = (0, import_react.useState)("");
	const [placed, setPlaced] = (0, import_react.useState)(false);
	const profileQuery = useQuery({
		queryKey: ["lodge-profile"],
		queryFn: () => getMyProfile(),
		enabled: !!user,
		retry: false
	});
	(0, import_react.useEffect)(() => {
		if (placed || !profileQuery.data) return;
		setFlyway(profileQuery.data.homeFlyway);
		setState(profileQuery.data.homeState);
		setCity(profileQuery.data.homeCity);
		setPlaced(true);
	}, [placed, profileQuery.data]);
	const reportsQuery = useQuery({
		queryKey: [
			"lodge-reports",
			flyway,
			state,
			city
		],
		queryFn: () => listReports({ data: {
			flyway,
			state,
			city
		} })
	});
	const states = STATES_BY_FLYWAY[flyway];
	const cities = CITIES_BY_STATE[state] ?? [];
	function pickFlyway(next) {
		setFlyway(next);
		const first = STATES_BY_FLYWAY[next][0];
		setState(first.code);
		setCity("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-subtle uppercase",
					children: "The lodge"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl text-fg sm:text-4xl",
					children: "What are you seeing?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Hunters post by flyway, state, and town. Filter the board to the water you hunt."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-surface p-4 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-subtle uppercase",
						children: "Board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: FLYWAY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => pickFlyway(opt.id),
							className: cn("h-11 rounded-md text-sm font-medium", flyway === opt.id ? "bg-sage text-sage-fg" : "bg-elevated text-fg"),
							children: opt.label
						}, opt.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
								children: "State"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: selectClass,
								value: state,
								onChange: (e) => {
									setState(e.target.value);
									setCity("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Whole flyway"
								}), states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.code,
									children: s.name
								}, s.code))]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
									children: "City"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: city,
									onChange: (e) => setCity(e.target.value),
									list: "lodge-cities",
									placeholder: "All towns"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "lodge-cities",
									children: cities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
								})
							]
						})]
					})
				]
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-lg bg-surface" }) : !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg bg-surface p-4 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-fg",
						children: "Sign in to post"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Anyone can read the board. You need a handle to pin a report."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "mt-4 inline-flex h-11 items-center rounded-md bg-sage px-4 text-sm font-medium text-sage-fg",
						children: "Sign in"
					})
				]
			}) : profileQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-lg bg-surface" }) : profileQuery.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
				profile: profileQuery.data,
				flyway,
				state,
				city,
				onPosted: () => void queryClient.invalidateQueries({ queryKey: ["lodge-reports"] }),
				onProfile: () => void queryClient.invalidateQueries({ queryKey: ["lodge-profile"] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, { onSaved: () => void queryClient.invalidateQueries({ queryKey: ["lodge-profile"] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-xl text-fg",
				children: [
					state ? `${stateName(state)}${city ? ` · ${city}` : ""}` : FLYWAY_OPTIONS.find((f) => f.id === flyway)?.label,
					" ",
					"reports"
				]
			}), reportsQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-lg bg-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-lg bg-surface" })]
			}) : reportsQuery.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-lg bg-surface px-4 py-5 text-sm text-muted shadow-border",
				children: "Couldn’t load the lodge. Try again in a minute."
			}) : reportsQuery.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: reportsQuery.data.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
					report,
					mine: report.handle === profileQuery.data?.handle,
					onDelete: () => deleteReport({ data: report.id }).then(() => queryClient.invalidateQueries({ queryKey: ["lodge-reports"] }))
				}, report.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-lg bg-surface px-4 py-5 text-sm text-muted shadow-border",
				children: "Quiet on this water. Be the first to post what you saw."
			})] })
		]
	});
}
function ProfileForm({ initial, onSaved }) {
	const [handle, setHandle] = (0, import_react.useState)(initial?.handle ?? "");
	const [displayName, setDisplayName] = (0, import_react.useState)(initial?.displayName ?? "");
	const [homeFlyway, setHomeFlyway] = (0, import_react.useState)(initial?.homeFlyway ?? "central");
	const [homeState, setHomeState] = (0, import_react.useState)(initial?.homeState ?? "CO");
	const [homeCity, setHomeCity] = (0, import_react.useState)(initial?.homeCity ?? "");
	const [bio, setBio] = (0, import_react.useState)(initial?.bio ?? "");
	const [error, setError] = (0, import_react.useState)(null);
	const mutation = useMutation({
		mutationFn: () => saveProfile({ data: {
			handle,
			displayName,
			homeFlyway,
			homeState,
			homeCity,
			bio
		} }),
		onSuccess: (res) => {
			if (res.ok) onSaved();
			else setError(res.error);
		},
		onError: (err) => setError(err instanceof Error ? err.message : "Could not save")
	});
	const states = STATES_BY_FLYWAY[homeFlyway];
	const cities = CITIES_BY_STATE[homeState] ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg bg-surface p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Cut a handle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "One profile per hunter. Home marsh is where your reports start."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					setError(null);
					mutation.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
							children: "Handle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: handle,
							onChange: (e) => setHandle(e.target.value),
							placeholder: "greenhead_co"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value),
							placeholder: "What they call you"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
									children: "Flyway"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: selectClass,
									value: homeFlyway,
									onChange: (e) => {
										const next = e.target.value;
										setHomeFlyway(next);
										setHomeState(STATES_BY_FLYWAY[next][0].code);
									},
									children: FLYWAY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: opt.id,
										children: opt.label
									}, opt.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
									children: "State"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: selectClass,
									value: homeState,
									onChange: (e) => setHomeState(e.target.value),
									children: states.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.code,
										children: s.name
									}, s.code))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
										children: "City"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: homeCity,
										onChange: (e) => setHomeCity(e.target.value),
										list: "profile-cities",
										placeholder: "Town"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
										id: "profile-cities",
										children: cities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-xs tracking-widest text-subtle uppercase",
							children: "Bio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: bio,
							onChange: (e) => setBio(e.target.value),
							placeholder: "Puddle-duck man, Front Range"
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-hunt-poor",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: mutation.isPending,
						children: [mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : null, "Save profile"]
					})
				]
			})
		]
	});
}
function Composer({ profile, flyway, state, city, onPosted, onProfile }) {
	const [body, setBody] = (0, import_react.useState)("");
	const [species, setSpecies] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const postCity = city.trim();
	const postState = state;
	const mutation = useMutation({
		mutationFn: () => createReport({ data: {
			flyway,
			state: postState,
			city: postCity,
			species,
			body
		} }),
		onSuccess: (res) => {
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setBody("");
			setSpecies("");
			setError(null);
			onPosted();
		},
		onError: (err) => setError(err instanceof Error ? err.message : "Could not post")
	});
	if (editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, {
		initial: profile,
		onSaved: () => {
			setEditing(false);
			onProfile();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg bg-surface p-4 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Posting as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-fg",
						children: ["@", profile.handle]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-subtle",
						children: [
							" ",
							"· ",
							stateName(postState),
							" · ",
							postCity
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: () => setEditing(true),
				children: "Edit profile"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				setError(null);
				mutation.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: areaClass,
					value: body,
					onChange: (e) => setBody(e.target.value),
					maxLength: 500,
					placeholder: "Teal buzzing the sheet water at legal. North wind, low ceiling."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: cn(selectClass, "max-w-56"),
						value: species,
						onChange: (e) => setSpecies(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Species (optional)"
						}), REPORT_SPECIES.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: name,
							children: name
						}, name))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: mutation.isPending || !postCity || !postState,
						children: [mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : null, "Post to the lodge"]
					})]
				}),
				!postState || !postCity ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Pick a state and city on the board, then post."
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-hunt-poor",
					children: error
				}) : null
			]
		})]
	});
}
function ReportCard({ report, mine, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-lg bg-surface p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg text-fg",
					children: report.displayName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 flex items-center gap-1 text-xs tracking-wide text-muted uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
						"@",
						report.handle,
						" · ",
						stateName(report.state),
						" · ",
						report.city,
						" · ",
						ago(report.createdAtMs)
					]
				})] }), mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					"aria-label": "Delete report",
					onClick: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-fg",
				children: report.body
			}),
			report.species ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs tracking-widest text-sage uppercase",
				children: report.species
			}) : null
		]
	});
}
function ago(ms) {
	const delta = Math.max(0, Date.now() - ms) / 1e3;
	if (delta < 60) return "just now";
	if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
	if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
	return `${Math.floor(delta / 86400)}d ago`;
}
var SplitComponent = CommunityPage;
//#endregion
export { SplitComponent as component };
