import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as ArrowLeft, d as Search, f as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as cn, n as Button, t as AppChrome } from "./app-chrome-D89wH6B7.mjs";
import { t as Input } from "./input-Cja8Jzwt.mjs";
import { t as Badge } from "./badge-CaCNsHuC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/id-TN101b_q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MARK_LABEL = {
	"green-head": "Green head",
	"rusty-head": "Rusty / chestnut head",
	"white-crown": "White forehead",
	"white-crescent": "White face crescent",
	"spatula-bill": "Spoon bill",
	"needle-tail": "Needle tail",
	"yellow-bill": "Yellow / orange bill",
	"ring-bill": "Ring on the bill",
	"white-chinstrap": "White chinstrap",
	"speckle-belly": "Speckled belly",
	"white-goose": "White goose",
	crested: "Crest / hood",
	"white-head-patch": "Big white head patch",
	cinnamon: "Cinnamon all over",
	sooty: "Sooty dark body",
	"gray-body": "Gray body",
	"black-back": "Black back",
	"long-bill": "Long sloping bill"
};
var BIRDS = [
	{
		id: "mall",
		name: "Mallard",
		aka: ["greenhead", "susie"],
		group: "dabbler",
		size: "duck",
		image: "/id/mall.jpg",
		henImage: "/id/mall-hen.jpg",
		marks: [
			"green-head",
			"yellow-bill",
			"gray-body"
		],
		bill: "Drake: solid yellow. Hen: orange with a dark saddle on top.",
		speculum: "Bright blue, bordered white on both edges.",
		drake: "Bottle-green head, thin white neck ring, chestnut breast, gray flanks, curled black tail feathers, orange feet.",
		hen: "Mottled brown with a dark eyeline. Orange bill with a dark blotch. Orange feet.",
		inHand: [
			"Blue speculum with white bars front and back — the mallard trademark.",
			"Orange feet. Black duck feet are also orange; use plumage and speculum.",
			"Hen bill has a dark saddle; gadwall hen bill is orange-sided with a dark center and a white speculum."
		],
		lookalikes: [{
			id: "gadw",
			why: "Gray ducks. Gadwall speculum is white, not blue."
		}, {
			id: "abdu",
			why: "Black ducks are sooty overall with a darker speculum and an olive bill."
		}],
		note: "The bird most hunters already know. Confirm hens by the blue-and-white speculum before you tag a gray duck as a mallard."
	},
	{
		id: "gadw",
		name: "Gadwall",
		aka: ["gray duck"],
		group: "dabbler",
		size: "duck",
		image: "/id/gadw.jpg",
		henImage: "/id/gadw-hen.jpg",
		marks: ["gray-body"],
		bill: "Drake: dark gray to black. Hen: orange sides, dark center.",
		speculum: "White. Visible in flight and on the folded wing.",
		drake: "Mostly gray, black rump and undertail, warm brown cap, black bill.",
		hen: "Mottled brown like a mallard hen, but the bill is orange-sided and the speculum is white.",
		inHand: ["White speculum is the clincher versus mallard.", "Feet are yellow-orange. Smaller and blockier than a mallard."],
		lookalikes: [{
			id: "mall",
			why: "Hens look like mallard hens until you open the wing."
		}],
		note: "If it looks like a dull mallard and flashes white in the wing, it is a gray duck."
	},
	{
		id: "amwi",
		name: "American wigeon",
		aka: ["baldpate"],
		group: "dabbler",
		size: "duck",
		image: "/id/amwi.jpg",
		henImage: "/id/amwi-hen.jpg",
		marks: ["white-crown", "gray-body"],
		bill: "Blue-gray with a black tip. Short and goose-like.",
		speculum: "Green, with a large white shoulder patch on drakes.",
		drake: "White forehead, green slash through the eye, pinkish-brown body, gray bill.",
		hen: "Warm gray-brown head, pinkish flanks, gray bill with a black tip. No green head.",
		inHand: ["Short, dark-tipped gray bill is distinctive in both sexes.", "White coverts on the drake wing — a big white patch."],
		lookalikes: [{
			id: "gadw",
			why: "Both grayish. Wigeon bill is shorter and blue-gray with a black nail."
		}],
		note: "Baldpate. The white forehead reads at a hundred yards on a drake."
	},
	{
		id: "nopi",
		name: "Northern pintail",
		aka: ["sprig"],
		group: "dabbler",
		size: "duck",
		image: "/id/nopi.jpg",
		henImage: "/id/nopi-hen.jpg",
		marks: ["needle-tail", "gray-body"],
		bill: "Blue-gray with a black stripe down the top.",
		speculum: "Bronze-green with a cream bar in front.",
		drake: "Chocolate head, white neck stripe, long needle tail, slim gray body.",
		hen: "Sandy mottled brown, gray bill, longer neck and pointed tail than a mallard hen.",
		inHand: ["Long, slim neck. Tail is pointed even on hens.", "Blue-gray bill with a black center stripe on drakes."],
		lookalikes: [{
			id: "mall",
			why: "Hens can pass for mallards. Pintail hens are slimmer with a longer tail and a gray bill."
		}],
		note: "Sprig. Some units cap pintails — confirm before you keep a second one."
	},
	{
		id: "nsho",
		name: "Northern shoveler",
		aka: ["spoonbill", "spoony"],
		group: "dabbler",
		size: "duck",
		image: "/id/nsho.jpg",
		henImage: "/id/nsho-hen.jpg",
		marks: ["spatula-bill", "green-head"],
		bill: "Huge spatula. Drake dark; hen orange-brown. Unmistakable in hand.",
		speculum: "Green, with a powder-blue shoulder like a teal.",
		drake: "Green head, white breast, chestnut flanks, yellow eye, spoon bill.",
		hen: "Mottled brown with the same oversized bill.",
		inHand: ["If the bill looks like a spoon, you are done. Nothing else wears this hardware."],
		lookalikes: [{
			id: "mall",
			why: "Green head only. The bill settles it immediately."
		}],
		note: "Spoonbill. Early-season bird on dirty, shallow water."
	},
	{
		id: "bwte",
		name: "Blue-winged teal",
		aka: ["bluewing"],
		group: "dabbler",
		size: "teal",
		image: "/id/bwte.jpg",
		henImage: "/id/bwte-hen.jpg",
		marks: ["white-crescent"],
		bill: "Dark gray, modest, teal-sized.",
		speculum: "Green. Big powder-blue shoulder patch on both sexes.",
		drake: "Slate head, bold white crescent in front of the eye, spotted brown body.",
		hen: "Small mottled brown duck with a pale spot at the bill base and a blue shoulder.",
		inHand: ["Fits in one hand. Blue shoulder patch is the group mark versus green-wing.", "White crescent is only on the drake."],
		lookalikes: [{
			id: "cinte",
			why: "Same blue wing. Cinnamon drakes are brick-red; hens are nearly identical — bill is slightly longer and broader on cinnamon."
		}, {
			id: "gwte",
			why: "Green-wings lack the blue shoulder and are even smaller."
		}],
		note: "First duck of fall. Often gone before the mallards show."
	},
	{
		id: "gwte",
		name: "Green-winged teal",
		aka: ["greenwing"],
		group: "dabbler",
		size: "teal",
		image: "/id/gwte.jpg",
		henImage: "/id/gwte-hen.jpg",
		marks: ["rusty-head"],
		bill: "Dark, small, fine.",
		speculum: "Iridescent green. No blue on the shoulder.",
		drake: "Chestnut head with a green ear patch, vertical white bar on the side, gray body.",
		hen: "Tiny mottled brown duck. Dark speculum with a green flash. No blue wing.",
		inHand: ["Smallest puddle duck. If there is no blue on the wing, it is a green-wing, not a blue-wing.", "Drake has a cream-colored vertical slash on the flank."],
		lookalikes: [{
			id: "bwte",
			why: "Both are tiny. Blue-wings show powder-blue coverts."
		}],
		note: "Hang later than blue-wings. Work sheet water after a rain."
	},
	{
		id: "cinte",
		name: "Cinnamon teal",
		aka: ["cinammon"],
		group: "dabbler",
		size: "teal",
		image: "/id/cinte.jpg",
		henImage: "/id/cinte-hen.jpg",
		marks: ["cinnamon"],
		bill: "Dark, a touch longer and wider than a blue-wing.",
		speculum: "Green, with the same powder-blue shoulder as a blue-wing.",
		drake: "Entire head and body rich cinnamon-red, red eye, dark bill.",
		hen: "Nearly identical to a blue-winged teal hen. Bill is slightly larger.",
		inHand: ["Drake is obvious. Hen: compare bill size to a known blue-wing and look for a warmer, more cinnamon wash.", "Western bird. Rare on the Atlantic."],
		lookalikes: [{
			id: "bwte",
			why: "Hens are the hard pair. Drakes are not."
		}],
		note: "West of the 100th meridian this is a regular early-season bird."
	},
	{
		id: "wodu",
		name: "Wood duck",
		aka: ["woodie"],
		group: "dabbler",
		size: "duck",
		image: "/id/wodu.jpg",
		henImage: "/id/wodu-hen.jpg",
		marks: ["crested"],
		bill: "Red, white, and black on the drake. Gray with a dark tip on the hen.",
		speculum: "Blue-green, not as cleanly barred as a mallard.",
		drake: "Crested iridescent head, white bridle, red eye, spotted chestnut breast.",
		hen: "Gray-brown with a crested nape and a bold white teardrop around the eye.",
		inHand: ["Crest and the white eye-patch on hens. Nothing else looks like a woodie in hand."],
		lookalikes: [],
		note: "Timber duck. If you shot it over a beaver pond, start here."
	},
	{
		id: "abdu",
		name: "American black duck",
		aka: ["black duck"],
		group: "dabbler",
		size: "duck",
		image: "/id/abdu.jpg",
		henImage: "/id/abdu-hen.jpg",
		marks: ["sooty", "yellow-bill"],
		bill: "Drake: yellow-olive. Hen: duller olive.",
		speculum: "Deep violet, with little or no white edge.",
		drake: "Sooty dark-brown body, paler brown head, yellow-olive bill, orange feet.",
		hen: "Same sooty look, slightly duller bill.",
		inHand: ["Much darker than a mallard hen. Silver lining on the speculum is thin or missing.", "Silver underwing lining in flight; mallards show white."],
		lookalikes: [{
			id: "mall",
			why: "Mallard hens are paler and flash a blue speculum with fat white bars."
		}],
		note: "East and Mississippi Flyway bird. Hybrids with mallards exist — when in doubt, treat it as a black duck."
	},
	{
		id: "canvas",
		name: "Canvasback",
		aka: ["can"],
		group: "diver",
		size: "duck",
		image: "/id/canvas.jpg",
		henImage: "/id/canvas-hen.jpg",
		marks: ["rusty-head", "long-bill"],
		bill: "Long, black, runs straight into the forehead. Wedge profile.",
		speculum: "Pale gray, not a color patch.",
		drake: "Rusty-red head, black breast, white canvas back, red eye, sloping forehead.",
		hen: "Brown head and chest, grayish back, same long sloping bill.",
		inHand: ["Profile is the ID. Bill and forehead make one straight line.", "Redhead has a steep forehead and a tricolored bill."],
		lookalikes: [{
			id: "redhead",
			why: "Redheads are round-headed with a blue-gray bill and a white ring."
		}],
		note: "Cans. Check the regs — many states still special-restrict canvasbacks."
	},
	{
		id: "redhead",
		name: "Redhead",
		aka: [],
		group: "diver",
		size: "duck",
		image: "/id/redhead.jpg",
		henImage: "/id/redhead-hen.jpg",
		marks: ["rusty-head", "ring-bill"],
		bill: "Blue-gray with a white ring and a black tip. Steep forehead.",
		speculum: "Gray.",
		drake: "Round rusty head, yellow eye, black breast, gray back.",
		hen: "Plain brown with a duller version of the tricolored bill and a light face smudge.",
		inHand: ["Steep forehead. Canvasback bill would look twice as long.", "Tricolored bill matches ring-necked, but ring-necks have a black back and a peaked head."],
		lookalikes: [{
			id: "canvas",
			why: "Same rusty head. Canvasback is the wedge; redhead is the round."
		}, {
			id: "ringneck",
			why: "Same bill pattern. Ring-neck is black-backed with a peaked crown."
		}],
		note: "Prairie diver. Shows on big lakes after a north blow."
	},
	{
		id: "scaup",
		name: "Lesser scaup",
		aka: ["bluebill"],
		group: "diver",
		size: "duck",
		image: "/id/scaup.jpg",
		henImage: "/id/scaup-hen.jpg",
		marks: ["black-back", "ring-bill"],
		bill: "Blue with a tiny black nail. No bold white ring.",
		speculum: "White, long on the wing.",
		drake: "Glossy purple-black round head, black breast, vermiculated gray back, yellow eye.",
		hen: "Brown with a clean white patch at the base of the bill.",
		inHand: ["Blue bill, yellow eye, white wing stripe.", "Greater scaup is rarer inland — rounder green-black head, bigger nail, longer white wing stripe. If you are on a prairie reservoir it is almost always a lesser."],
		lookalikes: [{
			id: "ringneck",
			why: "Ring-necks have a peaked head, a white bill ring, and a black back."
		}],
		note: "Bluebill. Late bird on big water."
	},
	{
		id: "ringneck",
		name: "Ring-necked duck",
		aka: ["ringbill"],
		group: "diver",
		size: "duck",
		image: "/id/ringneck.jpg",
		henImage: "/id/ringneck-hen.jpg",
		marks: ["ring-bill", "black-back"],
		bill: "Tricolored: dark with a bold white ring and black tip.",
		speculum: "Gray. Not the long white stripe of a scaup.",
		drake: "Peaked black head, black back, gray flanks with a white spur at the shoulder, yellow eye.",
		hen: "Brown with a peaked head, white eye-ring, and the same bill ring.",
		inHand: ["The ring is on the bill, not the neck. The neck ring is nearly invisible.", "Peaked crown versus the round scaup head."],
		lookalikes: [{
			id: "scaup",
			why: "Scaup has a gray back and a blue bill without the fat white ring."
		}, {
			id: "redhead",
			why: "Redhead is rusty-headed with a gray back."
		}],
		note: "Timber and marsh diver. Often mixed with mallards on smaller water."
	},
	{
		id: "buff",
		name: "Bufflehead",
		aka: ["butterball"],
		group: "diver",
		size: "teal",
		image: "/id/buff.jpg",
		henImage: "/id/buff-hen.jpg",
		marks: ["white-head-patch"],
		bill: "Tiny, gray-blue.",
		speculum: "White patch on a black wing.",
		drake: "Black head with a huge white wedge from the eye to the back of the head, white sides.",
		hen: "Dark brown with a small elongated white cheek patch.",
		inHand: ["Smallest diver. That white head wedge on a drake ends the conversation."],
		lookalikes: [{
			id: "home",
			why: "Hooded merganser has a fan crest and a thin serrated bill."
		}],
		note: "Butterball. Late, on open holes."
	},
	{
		id: "home",
		name: "Hooded merganser",
		aka: ["hoodie"],
		group: "diver",
		size: "duck",
		image: "/id/home.jpg",
		henImage: "/id/home-hen.jpg",
		marks: ["crested", "white-head-patch"],
		bill: "Thin, dark, serrated. Sawbill.",
		speculum: "White on black.",
		drake: "Black head, fan-shaped white crest outlined in black, white breast with two black bars, chestnut flanks.",
		hen: "Cinnamon-brown crest, gray body, thin serrated bill.",
		inHand: ["Sawbill. If the bill has teeth, it is a merganser. The hood settles which one."],
		lookalikes: [{
			id: "buff",
			why: "Bufflehead is smaller with a stubby bill, not a sawbill."
		}],
		note: "Wooded ponds and rivers. Not a puddle duck even if you shot it in the timber."
	},
	{
		id: "cago",
		name: "Canada goose",
		aka: ["honker", "Canadian"],
		group: "goose",
		size: "goose",
		image: "/id/cago.jpg",
		marks: ["white-chinstrap"],
		bill: "Black, stout.",
		speculum: "None. Dark brown wing.",
		drake: "Black head and neck, white chinstrap, brown-gray body. Sexes alike.",
		hen: "Same plumage. Females run smaller; do not use size alone versus cacklers.",
		inHand: ["White chinstrap. Specklebellies have orange bills and barred bellies.", "Cackling geese look like miniature Canadas — same paint job, stubbier bill, shorter neck. If it looks like a Canada the size of a mallard, it is a cackler."],
		lookalikes: [{
			id: "gwfgo",
			why: "White-fronts have orange bills and speckle bellies, no chinstrap."
		}],
		note: "Locals plus migrants. Hard freezes up north send the big flocks."
	},
	{
		id: "gwfgo",
		name: "Greater white-fronted goose",
		aka: ["specklebelly", "speck"],
		group: "goose",
		size: "goose",
		image: "/id/gwfgo.jpg",
		marks: ["speckle-belly"],
		bill: "Pink-orange with a white band at the base.",
		speculum: "None.",
		drake: "Brown-gray, white face around the bill, black bars on the belly, orange legs. Sexes alike.",
		hen: "Same plumage.",
		inHand: ["White front is the white ring at the bill, not a chinstrap.", "Black belly bars — specklebelly."],
		lookalikes: [{
			id: "cago",
			why: "Canadas wear a black neck and a white chinstrap."
		}],
		note: "Specks. Move with the first real cold. Rice and wheat country hold them south."
	},
	{
		id: "snago",
		name: "Snow goose",
		aka: ["white goose", "blue goose"],
		group: "goose",
		size: "goose",
		image: "/id/snago.jpg",
		marks: ["white-goose"],
		bill: "Pink with a black grinning patch along the sides.",
		speculum: "Black wingtips on a white wing.",
		drake: "White morph: all white with black wingtips. Blue morph: dark body, white head. Sexes alike.",
		hen: "Same plumage.",
		inHand: ["Grinning patch (black smile line on the bill) separates snows from Ross's.", "Ross's goose is smaller, with a stubbier bill and warty bumps at the bill base, no grin."],
		lookalikes: [],
		note: "Weather bird. A prairie storm can dump thousands overnight. Ross's is the small white lookalike — check the bill."
	}
];
var GROUP_LABEL = {
	dabbler: "Puddle duck",
	diver: "Diver",
	goose: "Goose"
};
var SIZE_LABEL = {
	teal: "Teal-size",
	duck: "Mallard-size",
	goose: "Goose"
};
function birdById(id) {
	return BIRDS.find((b) => b.id === id);
}
function matchBirds(filters) {
	const q = filters.query.trim().toLowerCase();
	return BIRDS.filter((b) => {
		if (filters.group && b.group !== filters.group) return false;
		if (filters.size && b.size !== filters.size) return false;
		if (filters.marks.some((m) => !b.marks.includes(m))) return false;
		if (!q) return true;
		return `${b.name} ${b.aka.join(" ")} ${b.drake} ${b.hen}`.toLowerCase().includes(q);
	});
}
function marksForGroup(group) {
	if (group === "goose") return [
		"white-chinstrap",
		"speckle-belly",
		"white-goose"
	];
	if (group === "diver") return [
		"rusty-head",
		"ring-bill",
		"long-bill",
		"black-back",
		"white-head-patch",
		"crested"
	];
	if (group === "dabbler") return [
		"green-head",
		"yellow-bill",
		"white-crescent",
		"spatula-bill",
		"needle-tail",
		"white-crown",
		"cinnamon",
		"crested",
		"sooty",
		"gray-body"
	];
	return [
		"green-head",
		"rusty-head",
		"yellow-bill",
		"spatula-bill",
		"needle-tail",
		"white-chinstrap",
		"white-goose",
		"crested"
	];
}
function IdGuide({ apk = false, onPage }) {
	const [group, setGroup] = (0, import_react.useState)(null);
	const [size, setSize] = (0, import_react.useState)(null);
	const [marks, setMarks] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const results = (0, import_react.useMemo)(() => matchBirds({
		group,
		size,
		marks,
		query
	}), [
		group,
		size,
		marks,
		query
	]);
	const selected = openId ? birdById(openId) : void 0;
	const filtering = Boolean(group || size || marks.length || query.trim());
	function toggleMark(mark) {
		setMarks((prev) => prev.includes(mark) ? prev.filter((m) => m !== mark) : [...prev, mark]);
	}
	function reset() {
		setGroup(null);
		setSize(null);
		setMarks([]);
		setQuery("");
		setOpenId(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppChrome, {
			page: "id",
			apk,
			onPage
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10",
			children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BirdDetail, {
				bird: selected,
				onBack: () => setOpenId(null),
				onOpen: (id) => setOpenId(id)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-subtle uppercase",
							children: "In-hand identification"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl leading-tight text-fg sm:text-4xl",
							children: "What did you shoot?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base",
							children: "Work the bird in hand: family, size, then the mark that jumps out. This is a field key, not a regs book — confirm limits for your unit."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								label: "1",
								title: "Family",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, { children: [
									"dabbler",
									"diver",
									"goose"
								].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: group === g,
									onClick: () => {
										setGroup(group === g ? null : g);
										setSize(null);
										setMarks([]);
									},
									children: GROUP_LABEL[g]
								}, g)) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								label: "2",
								title: "Size in hand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, { children: (group === "goose" ? ["goose"] : group === "dabbler" || group === "diver" ? ["teal", "duck"] : [
									"teal",
									"duck",
									"goose"
								]).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: size === s,
									onClick: () => setSize(size === s ? null : s),
									children: SIZE_LABEL[s]
								}, s)) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								label: "3",
								title: "The mark you can see",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, { children: marksForGroup(group).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									active: marks.includes(m),
									onClick: () => toggleMark(m),
									children: MARK_LABEL[m]
								}, m)) })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "relative block min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search name or nickname",
								className: "pl-10",
								"aria-label": "Search birds"
							})]
						}), filtering ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							onClick: reset,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Clear key"]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-fg",
							children: filtering ? `${results.length} match${results.length === 1 ? "" : "es"}` : "All birds"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [BIRDS.length, " in the guide"]
						})]
					}), results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md bg-surface px-4 py-6 text-sm text-muted shadow-border",
						children: "Nothing in the key for that mix. Clear a mark or try family only."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: results.map((bird) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOpenId(bird.id),
							className: "w-full overflow-hidden rounded-lg bg-surface text-left shadow-border transition-colors hover:bg-elevated",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SexPlates, { bird }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg text-fg",
									children: bird.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs tracking-wide text-muted uppercase",
									children: [
										GROUP_LABEL[bird.group],
										" · ",
										SIZE_LABEL[bird.size],
										bird.aka[0] ? ` · ${bird.aka[0]}` : ""
									]
								})]
							})]
						}) }, bird.id))
					})] })
				]
			})
		})]
	});
}
function BirdDetail({ bird, onBack, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				className: "-ml-2",
				onClick: onBack,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "Back to key"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-lg bg-surface shadow-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SexPlates, { bird })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-widest text-subtle uppercase",
					children: [
						GROUP_LABEL[bird.group],
						" · ",
						SIZE_LABEL[bird.size]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl text-fg",
					children: bird.name
				}),
				bird.aka.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: ["Also called ", bird.aka.join(", ")]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: bird.note
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Bill",
						value: bird.bill
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Speculum / wing",
						value: bird.speculum
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Drake",
						value: bird.drake
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Hen",
						value: bird.hen
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "In the hand"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: bird.inHand.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 text-sm leading-relaxed text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 rounded-full bg-sage" }), line]
				}, line))
			})] }),
			bird.lookalikes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Don’t confuse with"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: bird.lookalikes.map((look) => {
					const other = birdById(look.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpen(look.id),
						className: "w-full rounded-md bg-surface px-4 py-3 text-left shadow-border hover:bg-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: other?.name ?? look.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Lookalike" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: look.why
						})]
					}) }, look.id);
				})
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-subtle",
				children: "ID only. Seasons, sex restrictions, and bag limits change by flyway and unit — check the current abstract before you tag it."
			})
		]
	});
}
function SexPlates({ bird }) {
	if (!bird.henImage) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: bird.image,
		alt: `${bird.name} — sexes alike`,
		className: "aspect-plate w-full object-cover",
		crossOrigin: "anonymous"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
		className: "px-3 py-2 text-xs tracking-widest text-subtle uppercase",
		children: "Sexes alike"
	})] });
	const labelClass = "px-3 py-2 text-xs tracking-widest text-subtle uppercase";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "min-w-0 border-r border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: bird.image,
				alt: `${bird.name} drake`,
				className: "aspect-plate w-full object-cover",
				crossOrigin: "anonymous"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: labelClass,
				children: "Drake"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: bird.henImage,
				alt: `${bird.name} hen`,
				className: "aspect-plate w-full object-cover",
				crossOrigin: "anonymous"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: labelClass,
				children: "Hen"
			})]
		})]
	});
}
function Step({ label, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mb-2 flex items-center gap-2 text-xs tracking-widest text-subtle uppercase",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-6 items-center justify-center rounded-full bg-elevated font-display text-fg",
			children: label
		}), title]
	}), children] });
}
function ChipRow({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-11 rounded-full px-4 text-sm transition-colors", active ? "bg-sage text-sage-fg" : "bg-elevated text-fg hover:bg-elevated/80"),
		children
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface px-4 py-3 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs tracking-widest text-subtle uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 text-sm leading-relaxed text-fg",
			children: value
		})]
	});
}
function IdPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdGuide, {});
}
//#endregion
export { IdPage as component };
