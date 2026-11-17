/**
 * The four elements of autonomy, and the projects that live in each.
 * Fire is silicon: the energy we make and spend (firmware, compute, chips, tools).
 */
import { lessons, type Element } from "./lessons";
import commitsData from "./commits.json";
/** Commit counts come from the snapshot (scripts/mine-commits.mjs), never typed in. */
export const commitCount = (key: string) => (commitsData.projects as Record<string, { commits: unknown[] }>)[key].commits.length.toLocaleString("en-US");

export interface Project {
  slug: string; element: Element; title: string; years: string; role: string;
  summary: string; repo?: string; commitsKey?: string; hero?: string; heroAlt?: string;
  notes: { href: string; label: string }[]; status: string; private?: boolean;
  place?: string; figures?: [string, string][]; gallery?: [string, string][]; bench?: [string, string, string];
  line?: string; stat?: string;
}

export const projects: Project[] = [
  // Air
  { slug: "aerd", element: "air", title: "Amateur Experimental Rocketry", years: "2023 – 2025", role: "A&GNC, trajectory, parachute, procurement", status: "team · flown", summary: "Guidance, navigation and control for student rockets: a ROS 2 data stack, a monocopter flight computer (V1), visual SLAM for flying without GPS, and trajectories checked against real flights.", notes: [{ href: "/notes/rockets", label: "before the water, a rocket" }] },
  { slug: "gimbal", element: "air", title: "A thrust-vector gimbal", years: "2024", role: "controller and code", status: "bench · re-read 2026", summary: "Two servos, one IMU, a PID loop holding a rocket motor upright, written for BRAC University's LASSET lab. The public code is two gists; reading them again in 2026 found a filter with no memory.", notes: [{ href: "/lessons/a-filter-with-no-memory", label: "LL-13: a filter with no memory" }] },
  { slug: "meghdhut", element: "air", title: "Meghdhut", years: "2026 →", role: "author", status: "private · early", private: true, summary: "GPS-denied autonomy for a drone, named for the cloud messenger. A private workspace in its first weeks: the engineering foundations and the harness, no flight yet. Described here, not linked.", notes: [] },
  // Water
  { slug: "duburi", element: "water", title: "BRACU Duburi", years: "2023 – 2026", role: "vision → vision lead → engineering lead", status: "team · competed", repo: "fh1m/duburi-rnd", commitsKey: "duburi", summary: "Bangladesh's autonomous underwater vehicle team. I joined the vision subteam in 2023, led it, and in 2026 was Team Lead (Engineering) for a two-vehicle campaign: Duburi 4.5 and Dubomini 2.0 coordinating mid-run. 8th of 58 at RoboSub in 2025 and 2026. The research codebase for Duburi 4.2 is public.", notes: [{ href: "/notes/duburi", label: "how Duburi learned to see" }] },
  { slug: "mongla", element: "water", title: "Mongla", years: "2026 →", role: "author (board and firmware: Rakibul Islam)", status: "bench · 0 dives", repo: "fh1m/mongla_ws", commitsKey: "mongla", summary: "An independent autonomy stack for underwater vehicles, where every number carries its measurement and the retractions stay in the ledger.", notes: [{ href: "/notes/mongla", label: "the tour" }, { href: "/notes/the-engine-room", label: "the engine room" }] },
  { slug: "mongla-sim", element: "water", title: "Mongla Sim", years: "2026", role: "author", status: "sim", repo: "fh1m/mongla_sim", commitsKey: "mongla-sim", summary: "Gazebo and ArduSub SITL with six courses, a native DVL and an operator lab; refereed against the autonomy by a contract test.", notes: [{ href: "/notes/mongla-sim", label: "the pool we built" }] },
  { slug: "green-at-depth", element: "water", title: "Green, at depth", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/green-at-depth", summary: "A 2023 colour threshold, sunk metre by metre through a model of water. Its first failure is a hallucination, not blindness.", notes: [{ href: "/notes/green-at-depth", label: "the note" }] },
  { slug: "interview-bottle", element: "water", title: "The interview bottle", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/interview-bottle", summary: "The team's entry task, graded properly: the test set was the training set.", notes: [{ href: "/notes/interview-bottle", label: "the note" }] },
  // Earth
  { slug: "rupsha", element: "earth", title: "Rupsha", years: "2026 →", role: "author", status: "sim · chassis in build", repo: "fh1m/rupsha_ws", commitsKey: "rupsha", summary: "A rover stack named for the river upstream of Mongla: same fundamentals, a different vehicle. Nothing is FIELD yet.", notes: [] },
  { slug: "mongol-tori", element: "earth", title: "A rover arm that types", years: "2024 – 2025", role: "IK, vision unit, OCR, dataset", status: "team · competed", summary: "BRACU Mongol-Tori's autonomous typing task at the University Rover Challenge: find a keyboard, solve the arm, press the key.", notes: [{ href: "/notes/rovers", label: "the note" }] },
  { slug: "e-bhapa", element: "earth", title: "E-Bhapa", years: "2024 → 2026", role: "author", status: "re-graded", repo: "fh1m/E-Bhapa", summary: "One night, one sensor, a campus cat for a role model, and a robot that never turned.", notes: [{ href: "/notes/e-bhapa", label: "the note" }] },
  { slug: "four-leds", element: "earth", title: "Four LEDs", years: "2024 → 2026", role: "author", status: "re-graded", repo: "fh1m/four-leds", summary: "A person steering a camera by four LEDs is a control loop with a 250 ms delay, and it hunts.", notes: [{ href: "/notes/four-leds", label: "the note" }] },
  // Fire
  { slug: "dristy", element: "fire", title: "Dristy", years: "2026", role: "author", status: "bench · paused", repo: "fh1m/Dristy", commitsKey: "dristy", summary: "Open firmware for a K210 camera that answers with a number, not a video stream. 8 MiB of SRAM, placed by hand.", notes: [{ href: "/notes/dristy", label: "the note" }] },
  { slug: "den", element: "fire", title: "The Den", years: "always", role: "author", status: "in use daily", repo: "fh1m/.dotfiles", commitsKey: "den", summary: "Two machines, five panels, one keyboard: the workstation everything else is built on, kept in version control.", notes: [{ href: "/notes/workshop", label: "the workshop" }] },
  { slug: "pareidolia", element: "fire", title: "Pareidolia", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/pareidolia", summary: "What a 2001 face detector actually looks at: nine rectangles, and two backpacks.", notes: [{ href: "/notes/pareidolia", label: "the note" }] },
  { slug: "half-a-second", element: "fire", title: "Half a second", years: "2024 → 2026", role: "author", status: "re-graded", repo: "fh1m/half-a-second", summary: "A tracker that narrated a bottle with two decimal places of confidence, measured against a Kalman filter.", notes: [{ href: "/notes/half-a-second", label: "the note" }] },
  { slug: "trust-issues", element: "fire", title: "Trust issues", years: "2023 → 2026", role: "author", status: "re-graded", repo: "fh1m/trust-issues", summary: "How many lying readings a calibration survives: least squares leaves on the first lie.", notes: [{ href: "/notes/trust-issues", label: "the note" }] },
  { slug: "tools", element: "fire", title: "Small sharp tools", years: "2023 – 2026", role: "author", status: "in use", summary: "A start page, a WebAuthn login with nothing worth stealing, a terminal chat you can watch turn into noise.", notes: [{ href: "/notes/passless", label: "passless" }, { href: "/notes/secure-p2p-chat", label: "what Wireshark sees" }] },
];

/** Numbers copied from sources (mongla.json, READMEs, the TRUTH ledger); galleries are real media only. */
const extra: Record<string, Pick<Project, "place" | "figures" | "gallery" | "hero" | "heroAlt">> = {
  mongla: { place: "mongla",
    figures: [["500 Hz", "board loop"], ["53.9 Hz", "detection"], ["18.0 ms", "photon to detection"], ["4,742", "tests passing"], ["5", "thrusters"], ["0", "dives, so far"]],
    gallery: [["/media/mongla-docs/mongla-plan.webp", "From above. The CAD is real; the water isn't, yet."], ["/media/mongla-docs/mirpur-gate.webp", "Mirpur, 2025: real pool footage replayed into today's detector. shark_gate, 0.85."], ["/media/mongla-docs/hud_murky.webp", "The operator display on a murky frame: four detections, the gate still held at 0.98."], ["/media/mongla/flow-lab.webp", "The flow lab: the floor as a speedometer."]] },
  duburi: { place: "irvine",
    figures: [["8th / 58", "RoboSub 2025"], ["8th / 58", "RoboSub 2026"], ["4,083 → 6,234", "best round, points"], ["Sep 2023", "joined, junior AI & MV"]],
    gallery: [["/media/mongla-docs/team-bd-flag.webp", "Walking in with the flag of Bangladesh."], ["/media/mongla-docs/robosub-tent.webp", "The pit. Most of RoboSub happens under a tent."], ["/media/mongla-docs/pool-dual-auvs.webp", "Two vehicles in the pool. Both the programme's."], ["/media/mongla-docs/robosub-torpedo.webp", "The vehicle's own camera at RoboSub, facing the torpedo board. The boxes and the display are today's Mongla detector, run on that footage later."], ["/media/mongla-docs/robosub-octagon.webp", "The same camera looking up at the octagon. Today's detector finds it at 0.91."], ["/media/duburi/pool-test.webp", "On the deck, dry, which is where vehicles spend most of their lives."], ["/media/duburi26/dubomini-render.webp", "Dubomini, the team's small second vehicle: eight T200s around a rectangular hull. Render: BRACU Duburi."], ["/media/duburi26/team-flag.webp", "BRACU Duburi with the flag. Photo: BRACU Duburi."], ["/media/duburi26/tent-brief.webp", "Under the tent at RoboSub 2026, before a run. Photo: BRACU Duburi."]] },
  "mongla-sim": { place: "mongla",
    figures: [["6", "courses"], [commitCount("mongla-sim"), "commits"]],
    gallery: [["/media/mongla-docs/water-clear.webp", "Clear water."], ["/media/mongla-docs/water-murky.webp", "The same gate, one turbidity parameter later."], ["/media/mongla/sim-slalom.webp", "Slalom."], ["/media/mongla/sim-bins-torpedo.webp", "Bins and torpedo."]] },
  rupsha: { place: "khulna",
    figures: [["~3 %", "tag range long, Gazebo"], ["4.5 m", "seen every frame"], ["8 m", "never seen"], ["0", "FIELD claims"]],
    gallery: [["/media/rupsha/range.svg", "A 20 cm tag, a 70° lens: seen every frame at 4.5 m, never at 8."], ["/media/rupsha/rupsha-failsafe.svg", "The Pi goes quiet. The board holds 3.6 s later."], ["/media/rupsha/rupsha-split.svg", "Two computers, one cable."], ["/media/rupsha/rupsha-states.svg", "One marker leg, four states."]] },
  dristy: { place: "dhaka",
    figures: [["400 MHz", "PLL1"], ["8 MiB", "SRAM, placed by hand"], ["Sep 2026", "paused"]],
    gallery: [["/media/dristy/pipeline.webp", "Light to a number to a robot."], ["/media/dristy/k210-budget.webp", "8 MiB, every byte accounted for."], ["/media/dristy/motion.webp", "Motion, at 99."], ["/media/dristy/colour.webp", "Colour blobs."]] },
  den: { place: "dhaka",
    figures: [[commitCount("den"), "commits"], ["2", "machines"], ["5", "panels"]],
    gallery: [["/media/den/den-layout.webp", "The layout: two machines, five panels."], ["/media/den/radio-lab.webp", "The radio lab panel."], ["/media/notes/nvim-2022-07-05.webp", "The editor in July 2022."], ["/media/notes/nvim-2022-10-12.webp", "Three months later."]] },
  "e-bhapa": { place: "dhaka",
    figures: [["1", "night to build"], ["−255 → 1", "uint8 speed"], ["87 %", "of the run pinned to a wall"]],
    gallery: [["/media/e-bhapa/e-bhapa-upright.webp", "E-Bhapa. One sensor, a lot of confidence."], ["/media/notes/e-bhapa-three-minutes.webp", "Three simulated minutes: as flashed, wiring fixed, everything fixed."]] },
  aerd: { place: "dhaka",
    gallery: [["/media/aerd/mou-03.webp", "The day the lab signed on."]] },
  "mongol-tori": { place: "dhaka", hero: "/media/lab/detect-keyboard.webp", heroAlt: "Keys detected and labelled on a keyboard" },
  "green-at-depth": { place: "dhaka",
    gallery: [["/media/notes/green-at-depth-desk-2023-arrow.webp", "2023, on a desk: it works."], ["/media/notes/green-at-depth-detect_2m.webp", "2 m of water later."], ["/media/notes/green-at-depth-iou_vs_depth.webp", "Where it stops working."]] },
  "interview-bottle": { place: "dhaka",
    gallery: [["/media/notes/interview-bottle-2023-shot.webp", "2023: the entry task."], ["/media/notes/interview-bottle-ap_vs_depth.webp", "Graded properly."]] },
  "four-leds": { place: "dhaka",
    gallery: [["/media/notes/four-leds-deadband_sweep.webp", "Widen the dead band and the hunting stops."]] },
  pareidolia: { place: "dhaka",
    gallery: [["/media/notes/face-2023.webp", "2023. Detected."], ["/media/notes/pareidolia-stage0.webp", "The nine rectangles it checks first."], ["/media/notes/pareidolia-rotation.webp", "Tilt your head 30° and you stop existing."]] },
  "half-a-second": { place: "dhaka",
    gallery: [["/media/notes/half-a-second-live_2024_rerun.webp", "The 2024 tracker, re-run."], ["/media/notes/half-a-second-error_vs_horizon.webp", "Error against how far ahead you guess."]] },
  "trust-issues": { place: "dhaka",
    gallery: [["/media/notes/trust-issues-2023.webp", "2023: one straight line, believed."], ["/media/notes/trust-issues-breakdown.webp", "How many liars each fit survives."]] },
  tools: { place: "dhaka",
    gallery: [["/media/notes/passless-ceremony.webp", "Passless: a login with nothing worth stealing."], ["/media/securechat/wireshark-clear.webp", "What Wireshark sees in clear."], ["/media/securechat/wireshark-sec.webp", "What it sees now."]] },
};
/** The lead photo per project, chosen by looking at each image (see DESIGN.md). */
const heroes: Record<string, [string, string]> = {
  mongla: ["/media/mongla-docs/mongla-iso.webp", "The Mongla hull, from its CAD"],
  duburi: ["/media/mongla-docs/robosub-deploy.webp", "Deploying the vehicle at RoboSub"],
  "mongla-sim": ["/media/mongla/sim-gate-course.webp", "The simulated gate course"],
  rupsha: ["/media/rupsha/rupsha-approach.svg", "Where the camera stops: side view of the rover approaching a tag"],
  dristy: ["/media/dristy/object.webp", "On-device detection on the K210's LCD: tvmonitor 61%"],
  den: ["/media/den/arete-main.webp", "The main screen of Arete, the laptop"],
  "e-bhapa": ["/media/e-bhapa/bhapa.webp", "Bhapa, the campus cat E-Bhapa was modelled on"],
  aerd: ["/media/aerd/cover.webp", "The AERD team outdoors with a balloon"],
  "mongol-tori": ["/media/lab/detect-keyboard.webp", "Keys detected and labelled on a keyboard"],
  "green-at-depth": ["/media/notes/green-at-depth-filmstrip.webp", "The green arrow, sunk metre by metre"],
  "interview-bottle": ["/media/notes/interview-bottle-dry_vs_3m.webp", "Bottles dry and through 3 m of water"],
  "four-leds": ["/media/notes/four-leds-one_try.webp", "Bang-bang versus proportional, error over time"],
  pareidolia: ["/media/notes/pareidolia-rerun.webp", "The 2023 detector re-run on a webcam frame"],
  "half-a-second": ["/media/notes/half-a-second-run-2024-1.webp", "A tracked bottle, 2024"],
  "trust-issues": ["/media/notes/trust-issues-thirty.webp", "A calibration with lying readings"],
  tools: ["/media/notes/start-page-2023.webp", "The 2023 start page: a clock"],
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
/** One line per track, in the voice, and the one number that matters. Every claim is sourced above or in the notes. */
const tracks: Record<string, [string, string]> = {
  aerd: ["Rockets: the only place a bug becomes a debris field.", "2023–25"],
  gimbal: ["A filter with no memory, holding a rocket upright. Mostly.", "2 gists"],
  meghdhut: ["GPS-denied, named for a cloud messenger. Not flying yet.", "private"],
  duburi: ["Three trips to Irvine to learn that water grades on a curve.", "8th / 58, twice"],
  mongla: ["4,742 tests. 0 dives. Nobody has told the ocean yet.", `${commitCount("mongla")} commits`],
  "mongla-sim": ["A pool that never closes, refereed by a contract test.", "6 courses"],
  "green-at-depth": ["Sink a green arrow until the threshold starts seeing things.", "re-graded"],
  "interview-bottle": ["The test set was the training set. I graded myself and passed.", "re-graded"],
  rupsha: ["A rover that has only ever driven inside a computer. It says so on the label.", "0 FIELD claims"],
  "mongol-tori": ["Finding the key is the task. Pressing it is arithmetic.", "URC 2025"],
  "e-bhapa": ["Built in one night, modelled on a cat. Never once turned.", "−255 → 1"],
  "four-leds": ["A human in the loop is a 250 ms delay with opinions.", "250 ms"],
  dristy: ["A camera that answers with a number, in 8 MiB.", "8 MiB"],
  den: ["Two machines, five panels, one keyboard. Where everything else happens.", `${commitCount("den")} commits`],
  pareidolia: ["A 2001 face detector checks nine rectangles. Two backpacks passed.", "9 features"],
  "half-a-second": ["Two decimal places of confidence, half a second late.", "0.5 s"],
  "trust-issues": ["Least squares believes everyone. One liar is enough.", "1 liar"],
  tools: ["Small sharp tools, because the shop didn't sell them.", "3 tools"],
};
for (const p of projects) Object.assign(p, extra[p.slug] ?? { place: "dhaka" }, heroes[p.slug] ? { hero: heroes[p.slug][0], heroAlt: heroes[p.slug][1] } : {}, benches[p.slug] ? { bench: benches[p.slug] } : {}, tracks[p.slug] ? { line: tracks[p.slug][0], stat: tracks[p.slug][1] } : {});

export interface ElementInfo { id: Element; name: string; bn: string; colour: string; force: string; nature: string; glyph: string; intro: string; projects: Project[]; lessonCount: number; layer: Element }

const G = {
  air: `<path d="M6 18h22a6 6 0 1 0-6-6"/><path d="M6 26h32a6 6 0 1 1-6 6"/><path d="M10 34h12"/>`,
  water: `<path d="M4 18c5-4 9-4 14 0s9 4 14 0 9-4 12-2"/><path d="M4 27c5-4 9-4 14 0s9 4 14 0 9-4 12-2"/><path d="M4 36c5-4 9-4 14 0s9 4 14 0 9-4 12-2"/>`,
  earth: `<path d="M4 40 17 16l8 13 6-9 13 20Z"/><path d="M14 40l3-6M28 40l2-4"/>`,
  fire: `<path d="M24 6c2 8 12 12 12 22a12 12 0 0 1-24 0c0-6 4-9 6-14 2 4 2 7 6 9-1-6-1-11 0-17Z"/><path d="M24 40a5 5 0 0 1-5-5c0-3 3-5 5-9 2 4 5 6 5 9a5 5 0 0 1-5 5Z"/>`,
};

const meta: Record<Element, Omit<ElementInfo, "projects" | "lessonCount" | "id" | "layer" | "bn" | "colour">> = {
  air: { name: "Air", force: "gravity", nature: "Everything you throw up comes down. Decide what it does on the way.", glyph: G.air, intro: "Something that has to leave the ground is the hardest place to hide a mistake. Air is where I learned guidance and control: a loop isn't clever, it's patient, many times a second." },
  water: { name: "Water", force: "no radio", nature: "Salt water eats radio in centimetres. Down here you are on your own.", glyph: G.water, intro: "Salt water eats radio in centimetres and red light in metres. There is no link home and no one to ask. Water is where I learned to trust nothing I hadn't measured." },
  earth: { name: "Earth", force: "slip", nature: "Your wheels said one metre. The ground disagrees.", glyph: G.earth, intro: "On land the world pushes back: wheels slip, arms can't reach, walls don't move. Earth is where I learned manipulation and vision, and that a demo is not a robot." },
  fire: { name: "Fire", force: "heat", nature: "Every operation costs energy. I always collect.", glyph: G.fire, intro: "Fire is the energy we make and spend: firmware on tiny chips, neural accelerators, the machine I work on. It's where I learned that shared silicon is a schedule, and freshness beats throughput." },
};

/** The four nations: the only colour on the site. */
const nation: Record<Element, { bn: string; colour: string }> = {
  water: { bn: "জল", colour: "#4f8fe0" }, earth: { bn: "মাটি", colour: "#79b35f" }, fire: { bn: "আগুন", colour: "#e5533d" }, air: { bn: "বাতাস", colour: "#eaa63b" },
};
export const elements: ElementInfo[] = (["air", "water", "earth", "fire"] as Element[]).map((id) => ({
  id, layer: id, ...meta[id], ...nation[id], projects: projects.filter((p) => p.element === id), lessonCount: lessons.filter((l) => l.element === id).length,
}));
export const elementById = Object.fromEntries(elements.map((e) => [e.id, e])) as Record<Element, ElementInfo>;
