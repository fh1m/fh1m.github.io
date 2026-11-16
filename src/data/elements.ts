/**
 * The four elements of autonomy, and the projects that live in each.
 * Fire is silicon: the energy we make and spend (firmware, compute, chips, tools).
 */
import { lessons, type Element } from "./lessons";

export interface Project {
  slug: string; element: Element; title: string; years: string; role: string;
  summary: string; repo?: string; commitsKey?: string; hero?: string; heroAlt?: string;
  notes: { href: string; label: string }[]; status: string; private?: boolean;
  place?: string; figures?: [string, string][]; gallery?: [string, string][]; bench?: [string, string, string];
}

export const projects: Project[] = [
  // Air
  { slug: "aerd", element: "air", title: "Amateur Experimental Rocketry", years: "2023 – 2025", role: "A&GNC, trajectory, parachute, procurement", status: "team · flown", summary: "Guidance, navigation and control for student rockets: a ROS 2 data stack, a monocopter flight computer (V1), visual SLAM for flying without GPS, and trajectories checked against real flights.", hero: "/media/aerd/cover.webp", heroAlt: "The AERD team outdoors with a weather balloon", notes: [{ href: "/notes/rockets", label: "before the water, a rocket" }] },
  { slug: "gimbal", element: "air", title: "A thrust-vector gimbal", years: "2024", role: "controller and code", status: "bench · re-read 2026", summary: "Two servos, one IMU, a PID loop holding a rocket motor upright, written for BRAC University's LASSET lab. The public code is two gists; reading them again in 2026 found a filter with no memory.", notes: [{ href: "/lessons/a-filter-with-no-memory", label: "LL-13: a filter with no memory" }] },
  { slug: "meghdhut", element: "air", title: "Meghdhut", years: "2026 →", role: "author", status: "private · early", private: true, summary: "GPS-denied autonomy for a drone, named for the cloud messenger. A private workspace in its first weeks: the engineering foundations and the harness, no flight yet. Described here, not linked.", notes: [] },
  // Water
  { slug: "duburi", element: "water", title: "BRACU Duburi", years: "2023 – 2026", role: "vision → vision lead → engineering lead", status: "team · competed", repo: "fh1m/duburi-rnd", commitsKey: "duburi", summary: "Bangladesh's autonomous underwater vehicle team. Three RoboSubs in Irvine; 8th of 58 in 2025 and 2026. The research codebase for Duburi 4.2 is public.", hero: "/media/duburi/pool-test.webp", heroAlt: "A Duburi vehicle on a pool deck", notes: [{ href: "/notes/duburi", label: "how Duburi learned to see" }] },
  { slug: "mongla", element: "water", title: "Mongla", years: "2026 →", role: "author (board and firmware: Rakibul Islam)", status: "bench · 0 dives", repo: "fh1m/mongla_ws", commitsKey: "mongla", summary: "An independent autonomy stack for underwater vehicles, where every number carries its measurement and the retractions stay in the ledger.", hero: "/media/mongla-docs/mongla-iso.webp", heroAlt: "The Mongla hull CAD", notes: [{ href: "/notes/mongla", label: "the tour" }, { href: "/notes/the-engine-room", label: "the engine room" }] },
  { slug: "mongla-sim", element: "water", title: "Mongla Sim", years: "2026", role: "author", status: "sim", repo: "fh1m/mongla_sim", commitsKey: "mongla-sim", summary: "Gazebo and ArduSub SITL with six courses, a native DVL and an operator lab; refereed against the autonomy by a contract test.", hero: "/media/mongla/sim-gate-course.webp", heroAlt: "A simulated gate course", notes: [{ href: "/notes/mongla-sim", label: "the pool we built" }] },
  { slug: "green-at-depth", element: "water", title: "Green, at depth", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/green-at-depth", summary: "A 2023 colour threshold, sunk metre by metre through a model of water. Its first failure is a hallucination, not blindness.", hero: "/media/notes/green-at-depth-desk-2023-arrow.webp", heroAlt: "A 2023 green arrow detection", notes: [{ href: "/notes/green-at-depth", label: "the note" }] },
  { slug: "interview-bottle", element: "water", title: "The interview bottle", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/interview-bottle", summary: "The team's entry task, graded properly: the test set was the training set.", hero: "/media/notes/interview-bottle-dry_vs_3m.webp", heroAlt: "Bottles dry and under water", notes: [{ href: "/notes/interview-bottle", label: "the note" }] },
  // Earth
  { slug: "rupsha", element: "earth", title: "Rupsha", years: "2026 →", role: "author", status: "sim · chassis in build", repo: "fh1m/rupsha_ws", commitsKey: "rupsha", summary: "A rover stack named for the river upstream of Mongla: same fundamentals, a different vehicle. Nothing is FIELD yet.", hero: "/media/rupsha/range.svg", heroAlt: "Tag range in simulation", notes: [] },
  { slug: "mongol-tori", element: "earth", title: "A rover arm that types", years: "2024 – 2025", role: "IK, vision unit, OCR, dataset", status: "team · competed", summary: "BRACU Mongol-Tori's autonomous typing task at the University Rover Challenge: find a keyboard, solve the arm, press the key.", hero: "/media/lab/detect-keyboard.webp", heroAlt: "Keys detected on a keyboard", notes: [{ href: "/notes/rovers", label: "the note" }] },
  { slug: "e-bhapa", element: "earth", title: "E-Bhapa", years: "2024 → 2026", role: "author", status: "re-graded", repo: "fh1m/E-Bhapa", summary: "One night, one sensor, a campus cat for a role model, and a robot that never turned.", hero: "/media/e-bhapa/e-bhapa.webp", heroAlt: "E-Bhapa", notes: [{ href: "/notes/e-bhapa", label: "the note" }] },
  { slug: "four-leds", element: "earth", title: "Four LEDs", years: "2024 → 2026", role: "author", status: "re-graded", repo: "fh1m/four-leds", summary: "A person steering a camera by four LEDs is a control loop with a 250 ms delay, and it hunts.", hero: "/media/notes/four-leds-one_try.webp", heroAlt: "Error traces", notes: [{ href: "/notes/four-leds", label: "the note" }] },
  // Fire
  { slug: "dristy", element: "fire", title: "Dristy", years: "2026", role: "author", status: "bench · paused", repo: "fh1m/Dristy", commitsKey: "dristy", summary: "Open firmware for a K210 camera that answers with a number, not a video stream. 8 MiB of SRAM, placed by hand.", hero: "/media/dristy/object.webp", heroAlt: "On-device detection on the K210 LCD", notes: [{ href: "/notes/dristy", label: "the note" }] },
  { slug: "den", element: "fire", title: "The Den", years: "always", role: "author", status: "in use daily", repo: "fh1m/.dotfiles", commitsKey: "den", summary: "Two machines, five panels, one keyboard: the workstation everything else is built on, kept in version control.", hero: "/media/den/den-layout.webp", heroAlt: "The Digital Den layout", notes: [{ href: "/notes/workshop", label: "the workshop" }] },
  { slug: "pareidolia", element: "fire", title: "Pareidolia", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/pareidolia", summary: "What a 2001 face detector actually looks at: nine rectangles, and two backpacks.", hero: "/media/notes/pareidolia-rerun.webp", heroAlt: "Detections on a webcam frame", notes: [{ href: "/notes/pareidolia", label: "the note" }] },
  { slug: "half-a-second", element: "fire", title: "Half a second", years: "2024 → 2026", role: "author", status: "re-graded", repo: "fh1m/half-a-second", summary: "A tracker that narrated a bottle with two decimal places of confidence, measured against a Kalman filter.", hero: "/media/notes/half-a-second-run-2024-1.webp", heroAlt: "A tracked bottle", notes: [{ href: "/notes/half-a-second", label: "the note" }] },
  { slug: "trust-issues", element: "fire", title: "Trust issues", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/trust-issues", summary: "How many lying readings a calibration survives: least squares leaves on the first lie.", hero: "/media/notes/trust-issues-thirty.webp", heroAlt: "A calibration fit with outliers", notes: [{ href: "/notes/trust-issues", label: "the note" }] },
  { slug: "tools", element: "fire", title: "Small sharp tools", years: "2023 – 2026", role: "author", status: "in use", summary: "A start page, a WebAuthn login with nothing worth stealing, a terminal chat you can watch turn into noise.", hero: "/media/notes/passless-ceremony.webp", heroAlt: "A passkey ceremony", notes: [{ href: "/notes/passless", label: "passless" }, { href: "/notes/secure-p2p-chat", label: "what Wireshark sees" }] },
];

/** Numbers copied from sources (mongla.json, READMEs, the TRUTH ledger); galleries are real media only. */
const extra: Record<string, Pick<Project, "place" | "figures" | "gallery">> = {
  mongla: { place: "mongla", figures: [["500 Hz", "board loop"], ["53.9 Hz", "detection"], ["18.0 ms", "photon to detection"], ["4,742", "tests passing"], ["5", "thrusters"], ["0", "dives, so far"]], gallery: [["/media/mongla-docs/mongla-iso.webp", "Hull CAD"], ["/media/mongla-docs/mongla-bow.webp", "The bow"], ["/media/mongla/sim-gate-course.webp", "Simulated gate course"], ["/media/mongla-docs/hud_murky.webp", "Operator HUD in murky water"], ["/media/mongla/flow-lab.webp", "Optical-flow lab"], ["/media/mongla-docs/mirpur-gate.webp", "Mirpur pool footage"]] },
  duburi: { place: "irvine", figures: [["8th / 58", "RoboSub 2025"], ["8th / 58", "RoboSub 2026"], ["3", "RoboSubs in Irvine"], ["Sep 2023", "joined, junior AI & MV"]], gallery: [["/media/duburi/pool-test.webp", "Pool test"], ["/media/duburi/auv42.webp", "Duburi 4.2"], ["/media/duburi/robosub25-1.webp", "RoboSub 2025"], ["/media/duburi/torpedo.webp", "Torpedo"], ["/media/duburi/grabber.webp", "Grabber"], ["/media/certs/robosub-2026.webp", "RoboSub 2026 certificate"]] },
  "mongla-sim": { place: "mongla", figures: [["6", "courses"], ["43", "commits"]], gallery: [["/media/mongla/sim-gate-course.webp", "Gate course"], ["/media/mongla/sim-slalom.webp", "Slalom"], ["/media/mongla/sim-bins-torpedo.webp", "Bins and torpedo"], ["/media/mongla/sim-pool-overview.webp", "The pool"]] },
  rupsha: { place: "khulna", figures: [["~3 %", "tag range long, Gazebo"], ["4.5 m", "seen every frame"], ["8 m", "never seen"], ["0", "FIELD claims"]], gallery: [["/media/rupsha/rupsha-chassis.svg", "Chassis"], ["/media/rupsha/rupsha-states.svg", "State machine"], ["/media/rupsha/rupsha-failsafe.svg", "Failsafe"], ["/media/rupsha/range.svg", "Tag range"]] },
  dristy: { place: "dhaka", figures: [["400 MHz", "PLL1"], ["8 MiB", "SRAM, placed by hand"], ["Sep 2026", "paused"]], gallery: [["/media/dristy/object.webp", "On-device detection"], ["/media/dristy/k210-budget.webp", "Memory budget"], ["/media/dristy/pipeline.webp", "Pipeline"], ["/media/dristy/qr.webp", "QR"]] },
  den: { place: "dhaka", figures: [["436", "commits"], ["2", "machines"], ["5", "panels"]], gallery: [["/media/den/den-layout.webp", "Layout"], ["/media/den/arete-main.webp", "Arete"], ["/media/den/radio-lab.webp", "Radio lab"]] },
  "e-bhapa": { place: "dhaka", figures: [["−255 → 1", "uint8 speed"], ["87 %", "of the run pinned to a wall"]], gallery: [["/media/e-bhapa/e-bhapa.webp", "E-Bhapa"], ["/media/e-bhapa/bhapa.webp", "Bhapa, the role model"], ["/media/notes/e-bhapa-three-minutes.webp", "Three minutes, simulated"]] },
  aerd: { place: "dhaka", gallery: [["/media/aerd/cover.webp", "AERD"], ["/media/aerd/mou-01.webp", "MoU"], ["/media/aerd/mou-02.webp", "MoU"]] },
  "mongol-tori": { place: "dhaka", gallery: [["/media/lab/detect-keyboard.webp", "Keys detected"], ["/media/lab/sim-rover-terrain.webp", "Rover terrain sim"]] },
};
/** The live instrument on each project page: [bench id, title, hint]. */
const benches: Record<string, [string, string, string]> = {
  gimbal: ["gimbal", "Hold a rocket upright against the wind", "push the wind, tune the gains"],
  "mongol-tori": ["ik-arm", "The arm solves for the key you pick", "click a key, or use the arrows"],
  "e-bhapa": ["ebhapa", "E-Bhapa as flashed in 2024, and as fixed", "watch both run"],
  "four-leds": ["delay", "A delayed human following four LEDs", "drag the delay"],
  "trust-issues": ["liars", "A calibration with lying readings", "add liars, compare the fits"],
  pareidolia: ["haar", "The nine features a 2001 face detector checks first", "hover a feature"],
  "green-at-depth": ["colour-depth", "Sink a colour card through water", "drag the depth"],
  duburi: ["robosub", "Where the RoboSub points came from", "pick a year, hover a task"],
  mongla: ["hull", "The Mongla hull, from its own CAD", "drag to turn it"],
  tools: ["query", "The start page's query grammar", "type a query"],
};
for (const p of projects) Object.assign(p, extra[p.slug] ?? { place: "dhaka" }, benches[p.slug] ? { bench: benches[p.slug] } : {});

export interface ElementInfo { id: Element; name: string; force: string; nature: string; glyph: string; intro: string; projects: Project[]; lessonCount: number; layer: Element }

const G = {
  air: `<path d="M6 18h22a6 6 0 1 0-6-6"/><path d="M6 26h32a6 6 0 1 1-6 6"/><path d="M10 34h12"/>`,
  water: `<path d="M4 18c5-4 9-4 14 0s9 4 14 0 9-4 12-2"/><path d="M4 27c5-4 9-4 14 0s9 4 14 0 9-4 12-2"/><path d="M4 36c5-4 9-4 14 0s9 4 14 0 9-4 12-2"/>`,
  earth: `<path d="M4 40 17 16l8 13 6-9 13 20Z"/><path d="M14 40l3-6M28 40l2-4"/>`,
  fire: `<path d="M24 6c2 8 12 12 12 22a12 12 0 0 1-24 0c0-6 4-9 6-14 2 4 2 7 6 9-1-6-1-11 0-17Z"/><path d="M24 40a5 5 0 0 1-5-5c0-3 3-5 5-9 2 4 5 6 5 9a5 5 0 0 1-5 5Z"/>`,
};

const meta: Record<Element, Omit<ElementInfo, "projects" | "lessonCount" | "id" | "layer">> = {
  air: { name: "Air", force: "gravity, wind, and no second try", nature: "Everything you throw up comes down. Decide what it does on the way.", glyph: G.air, intro: "Something that has to leave the ground is the hardest place to hide a mistake. Air is where I learned guidance and control: a loop isn't clever, it's patient, many times a second." },
  water: { name: "Water", force: "absorption, refraction, and no radio", nature: "I take red first, then your GPS, then your excuses.", glyph: G.water, intro: "Salt water eats radio in centimetres and red light in metres. There is no link home and no one to ask. Water is where I learned to trust nothing I hadn't measured." },
  earth: { name: "Earth", force: "friction, terrain, and slip", nature: "Your wheels said one metre. The ground disagrees.", glyph: G.earth, intro: "On land the world pushes back: wheels slip, arms can't reach, walls don't move. Earth is where I learned manipulation and vision, and that a demo is not a robot." },
  fire: { name: "Fire", force: "heat, power, and finite silicon", nature: "Every operation costs energy. I always collect.", glyph: G.fire, intro: "Fire is the energy we make and spend: firmware on tiny chips, neural accelerators, the machine I work on. It's where I learned that shared silicon is a schedule, and freshness beats throughput." },
};

export const elements: ElementInfo[] = (["water", "earth", "fire", "air"] as Element[]).map((id) => ({
  id, layer: id, ...meta[id], projects: projects.filter((p) => p.element === id), lessonCount: lessons.filter((l) => l.element === id).length,
}));
export const elementById = Object.fromEntries(elements.map((e) => [e.id, e])) as Record<Element, ElementInfo>;
