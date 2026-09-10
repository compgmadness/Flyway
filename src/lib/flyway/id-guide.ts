export type BirdGroup = "dabbler" | "diver" | "goose";
export type BirdSize = "teal" | "duck" | "goose";

export type BirdMark =
  | "green-head"
  | "rusty-head"
  | "white-crown"
  | "white-crescent"
  | "spatula-bill"
  | "needle-tail"
  | "yellow-bill"
  | "ring-bill"
  | "white-chinstrap"
  | "speckle-belly"
  | "white-goose"
  | "crested"
  | "white-head-patch"
  | "cinnamon"
  | "sooty"
  | "gray-body"
  | "black-back"
  | "long-bill";

export type BirdId = {
  id: string;
  name: string;
  aka: string[];
  group: BirdGroup;
  size: BirdSize;
  image: string;
  henImage?: string;
  marks: BirdMark[];
  bill: string;
  speculum: string;
  drake: string;
  hen: string;
  inHand: string[];
  lookalikes: { id: string; why: string }[];
  note: string;
};

export const MARK_LABEL: Record<BirdMark, string> = {
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
  "long-bill": "Long sloping bill",
};

export const BIRDS: BirdId[] = [
  {
    id: "mall",
    name: "Mallard",
    aka: ["greenhead", "susie"],
    group: "dabbler",
    size: "duck",
    image: "/id/mall.jpg",
    henImage: "/id/mall-hen.jpg",
    marks: ["green-head", "yellow-bill", "gray-body"],
    bill: "Drake: solid yellow. Hen: orange with a dark saddle on top.",
    speculum: "Bright blue, bordered white on both edges.",
    drake: "Bottle-green head, thin white neck ring, chestnut breast, gray flanks, curled black tail feathers, orange feet.",
    hen: "Mottled brown with a dark eyeline. Orange bill with a dark blotch. Orange feet.",
    inHand: [
      "Blue speculum with white bars front and back — the mallard trademark.",
      "Orange feet. Black duck feet are also orange; use plumage and speculum.",
      "Hen bill has a dark saddle; gadwall hen bill is orange-sided with a dark center and a white speculum.",
    ],
    lookalikes: [
      { id: "gadw", why: "Gray ducks. Gadwall speculum is white, not blue." },
      { id: "abdu", why: "Black ducks are sooty overall with a darker speculum and an olive bill." },
    ],
    note: "The bird most hunters already know. Confirm hens by the blue-and-white speculum before you tag a gray duck as a mallard.",
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
    inHand: [
      "White speculum is the clincher versus mallard.",
      "Feet are yellow-orange. Smaller and blockier than a mallard.",
    ],
    lookalikes: [{ id: "mall", why: "Hens look like mallard hens until you open the wing." }],
    note: "If it looks like a dull mallard and flashes white in the wing, it is a gray duck.",
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
    inHand: [
      "Short, dark-tipped gray bill is distinctive in both sexes.",
      "White coverts on the drake wing — a big white patch.",
    ],
    lookalikes: [{ id: "gadw", why: "Both grayish. Wigeon bill is shorter and blue-gray with a black nail." }],
    note: "Baldpate. The white forehead reads at a hundred yards on a drake.",
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
    inHand: [
      "Long, slim neck. Tail is pointed even on hens.",
      "Blue-gray bill with a black center stripe on drakes.",
    ],
    lookalikes: [{ id: "mall", why: "Hens can pass for mallards. Pintail hens are slimmer with a longer tail and a gray bill." }],
    note: "Sprig. Some units cap pintails — confirm before you keep a second one.",
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
    lookalikes: [{ id: "mall", why: "Green head only. The bill settles it immediately." }],
    note: "Spoonbill. Early-season bird on dirty, shallow water.",
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
    inHand: [
      "Fits in one hand. Blue shoulder patch is the group mark versus green-wing.",
      "White crescent is only on the drake.",
    ],
    lookalikes: [
      { id: "cinte", why: "Same blue wing. Cinnamon drakes are brick-red; hens are nearly identical — bill is slightly longer and broader on cinnamon." },
      { id: "gwte", why: "Green-wings lack the blue shoulder and are even smaller." },
    ],
    note: "First duck of fall. Often gone before the mallards show.",
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
    inHand: [
      "Smallest puddle duck. If there is no blue on the wing, it is a green-wing, not a blue-wing.",
      "Drake has a cream-colored vertical slash on the flank.",
    ],
    lookalikes: [{ id: "bwte", why: "Both are tiny. Blue-wings show powder-blue coverts." }],
    note: "Hang later than blue-wings. Work sheet water after a rain.",
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
    inHand: [
      "Drake is obvious. Hen: compare bill size to a known blue-wing and look for a warmer, more cinnamon wash.",
      "Western bird. Rare on the Atlantic.",
    ],
    lookalikes: [{ id: "bwte", why: "Hens are the hard pair. Drakes are not." }],
    note: "West of the 100th meridian this is a regular early-season bird.",
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
    note: "Timber duck. If you shot it over a beaver pond, start here.",
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
    inHand: [
      "Much darker than a mallard hen. Silver lining on the speculum is thin or missing.",
      "Silver underwing lining in flight; mallards show white.",
    ],
    lookalikes: [{ id: "mall", why: "Mallard hens are paler and flash a blue speculum with fat white bars." }],
    note: "East and Mississippi Flyway bird. Hybrids with mallards exist — when in doubt, treat it as a black duck.",
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
    inHand: [
      "Profile is the ID. Bill and forehead make one straight line.",
      "Redhead has a steep forehead and a tricolored bill.",
    ],
    lookalikes: [{ id: "redhead", why: "Redheads are round-headed with a blue-gray bill and a white ring." }],
    note: "Cans. Check the regs — many states still special-restrict canvasbacks.",
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
    inHand: [
      "Steep forehead. Canvasback bill would look twice as long.",
      "Tricolored bill matches ring-necked, but ring-necks have a black back and a peaked head.",
    ],
    lookalikes: [
      { id: "canvas", why: "Same rusty head. Canvasback is the wedge; redhead is the round." },
      { id: "ringneck", why: "Same bill pattern. Ring-neck is black-backed with a peaked crown." },
    ],
    note: "Prairie diver. Shows on big lakes after a north blow.",
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
    inHand: [
      "Blue bill, yellow eye, white wing stripe.",
      "Greater scaup is rarer inland — rounder green-black head, bigger nail, longer white wing stripe. If you are on a prairie reservoir it is almost always a lesser.",
    ],
    lookalikes: [{ id: "ringneck", why: "Ring-necks have a peaked head, a white bill ring, and a black back." }],
    note: "Bluebill. Late bird on big water.",
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
    inHand: [
      "The ring is on the bill, not the neck. The neck ring is nearly invisible.",
      "Peaked crown versus the round scaup head.",
    ],
    lookalikes: [
      { id: "scaup", why: "Scaup has a gray back and a blue bill without the fat white ring." },
      { id: "redhead", why: "Redhead is rusty-headed with a gray back." },
    ],
    note: "Timber and marsh diver. Often mixed with mallards on smaller water.",
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
    lookalikes: [{ id: "home", why: "Hooded merganser has a fan crest and a thin serrated bill." }],
    note: "Butterball. Late, on open holes.",
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
    lookalikes: [{ id: "buff", why: "Bufflehead is smaller with a stubby bill, not a sawbill." }],
    note: "Wooded ponds and rivers. Not a puddle duck even if you shot it in the timber.",
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
    inHand: [
      "White chinstrap. Specklebellies have orange bills and barred bellies.",
      "Cackling geese look like miniature Canadas — same paint job, stubbier bill, shorter neck. If it looks like a Canada the size of a mallard, it is a cackler.",
    ],
    lookalikes: [{ id: "gwfgo", why: "White-fronts have orange bills and speckle bellies, no chinstrap." }],
    note: "Locals plus migrants. Hard freezes up north send the big flocks.",
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
    inHand: [
      "White front is the white ring at the bill, not a chinstrap.",
      "Black belly bars — specklebelly.",
    ],
    lookalikes: [{ id: "cago", why: "Canadas wear a black neck and a white chinstrap." }],
    note: "Specks. Move with the first real cold. Rice and wheat country hold them south.",
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
    inHand: [
      "Grinning patch (black smile line on the bill) separates snows from Ross's.",
      "Ross's goose is smaller, with a stubbier bill and warty bumps at the bill base, no grin.",
    ],
    lookalikes: [],
    note: "Weather bird. A prairie storm can dump thousands overnight. Ross's is the small white lookalike — check the bill.",
  },
];

export const GROUP_LABEL: Record<BirdGroup, string> = {
  dabbler: "Puddle duck",
  diver: "Diver",
  goose: "Goose",
};

export const SIZE_LABEL: Record<BirdSize, string> = {
  teal: "Teal-size",
  duck: "Mallard-size",
  goose: "Goose",
};

export function birdById(id: string): BirdId | undefined {
  return BIRDS.find((b) => b.id === id);
}

export function matchBirds(filters: {
  group?: BirdGroup | null;
  size?: BirdSize | null;
  marks: BirdMark[];
  query: string;
}): BirdId[] {
  const q = filters.query.trim().toLowerCase();
  return BIRDS.filter((b) => {
    if (filters.group && b.group !== filters.group) return false;
    if (filters.size && b.size !== filters.size) return false;
    if (filters.marks.some((m) => !b.marks.includes(m))) return false;
    if (!q) return true;
    const hay = `${b.name} ${b.aka.join(" ")} ${b.drake} ${b.hen}`.toLowerCase();
    return hay.includes(q);
  });
}

export function marksForGroup(group: BirdGroup | null): BirdMark[] {
  if (group === "goose") {
    return ["white-chinstrap", "speckle-belly", "white-goose"];
  }
  if (group === "diver") {
    return ["rusty-head", "ring-bill", "long-bill", "black-back", "white-head-patch", "crested"];
  }
  if (group === "dabbler") {
    return [
      "green-head",
      "yellow-bill",
      "white-crescent",
      "spatula-bill",
      "needle-tail",
      "white-crown",
      "cinnamon",
      "crested",
      "sooty",
      "gray-body",
    ];
  }
  return [
    "green-head",
    "rusty-head",
    "yellow-bill",
    "spatula-bill",
    "needle-tail",
    "white-chinstrap",
    "white-goose",
    "crested",
  ];
}
