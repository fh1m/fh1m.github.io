/**
 * Downstream: the story as a river, source to sea. Chronological. Every chapter names
 * its sources; team chapters split what I did / what the team did / what others did.
 * Binding constraints: fh1m-rebuild TRUTH_LEDGER and MEDIA_AUDIT (see PLAN.md, revision 2026-11-16).
 */
import mongla from "./mongla.json";

export type Domain = "water" | "air" | "ground" | "sight" | "time" | "workshop";

export interface Media { src: string; alt: string; caption: string; tier: "Own" | "Bench" | "Sim" | "Team" | "Doc" | "Water"; wide?: boolean }
export interface Split { me: string; team?: string; others?: string }
export interface Chapter {
  id: string;
  n: number;
  when: string;
  bn: string;          // the Bangla marker for this reach of the river
  bnGloss: string;     // what it means
  domain: Domain;
  title: string;
  kicker: string;
  body: string[];      // inline HTML allowed: <a>, <em>, <span class="k ...">
  split?: Split;
  media: Media[];
  benches?: { key: string; title: string }[];
  notes: { href: string; label: string }[];
  lesson: string;      // one line: what the water taught here
}

const mCommits = mongla.provenance.commits.toLocaleString("en-US");
const mTests = mongla.tests.passed.toLocaleString("en-US");

export const chapters: Chapter[] = [
  {
    id: "source", n: 0, when: "2021 – 2022", bn: "উৎস", bnGloss: "the source", domain: "workshop",
    title: "The source",
    kicker: "Every river starts as something you could step over.",
    body: [
      "Mine starts in 2021 with a web internship at Thinkit: back-end code for a move to MongoDB and a pile of front-end bugs. It was the first time code I wrote ran for somebody who wasn't me, and the first time a bug of mine had a victim.",
      "In 2022 I ran my college's ICT club, wrote scripts for my Arch machine, and built a Neovim setup I screenshotted as it grew, the way some people photograph a plant. None of that is engineering yet. It's the habit underneath it: if a tool annoys you, open it up.",
    ],
    media: [
      { src: "/media/notes/nvim-2022-07-05.webp", alt: "A Neovim editor in July 2022 with a file tree and a code buffer", caption: "<b>July 2022.</b> The editor, early.", tier: "Own" },
      { src: "/media/notes/nvim-2022-10-12.webp", alt: "Neovim in October 2022 with split buffers and a darker theme", caption: "<b>October 2022.</b> Three months of opinions later.", tier: "Own" },
    ],
    notes: [{ href: "/notes/workshop", label: "the workshop" }],
    lesson: "If a tool annoys you, open it up.",
  },
  {
    id: "sky", n: 1, when: "Feb 2023 – Feb 2025", bn: "আকাশ", bnGloss: "sky", domain: "air",
    title: "Something that has to leave the ground",
    kicker: "Rockets taught me guidance and control.",
    body: [
      "In February 2023 I joined Amateur Experimental Rocketry Dhaka (AERD). I worked attitude, guidance, navigation and control, trajectory prediction with RocketPy checked against real flight data, the parachute, and procurement. I led V1 of an in-house flight computer for a monocopter UAV and worked on a visual-SLAM stack for flight without GPS.",
      "From September 2024, at BRAC University's LASSET lab, I built a PID controller for a thrust-vector-control gimbal and a 2-axis controller with a tracking GUI. A gimbal is a broom balanced on a fingertip, and it's where I learned that a controller isn't clever. It's patient, many times a second. Tune one yourself on the bench: <em>P only</em>, then <em>add D</em>, then <em>add I</em>.",
    ],
    split: {
      me: "A&GNC, trajectory prediction against flight data, parachute, procurement; V1 of a monocopter flight computer; the TVC gimbal PID at LASSET.",
      team: "AERD's hybrid engine test, which <a href=\"https://www.thedailystar.net/campus/news/first-hybrid-rocket-engine-bangladesh-tested-successfully-3418016\">The Daily Star reported</a> as the first in Bangladesh, and the AIUB weather-balloon launch.",
      others: "AIUB's research centre hosted the work.",
    },
    media: [
      { src: "/media/aerd/cover.webp", alt: "The AERD team outdoors in front of a white weather balloon and a launch banner", caption: "AERD on balloon-launch day.", tier: "Team" },
      { src: "/media/aerd/mou-03.webp", alt: "Eight people shaking hands over a signed AIUB and AERD agreement", caption: "The AIUB × AERD agreement: a student team turning into a programme.", tier: "Team" },
    ],
    benches: [{ key: "gimbal", title: "A TVC gimbal against the wind" }],
    notes: [{ href: "/notes/rockets", label: "before the water, a rocket" }],
    lesson: "A controller isn't clever. It's patient.",
  },
  {
    id: "water", n: 2, when: "Sep 2023 →", bn: "জল", bnGloss: "water", domain: "water",
    title: "The day the water started grading me",
    kicker: "Underwater there is no radio, no GPS, and no second chance to explain yourself.",
    body: [
      "In September 2023 I joined BRACU Duburi, Bangladesh's autonomous underwater vehicle team, as a junior member of AI and machine vision. Two months later I'd written forty lines of OpenCV that found green arrows by asking every pixel if its hue was between 50 and 70. It worked beautifully, on my desk.",
      "Water is a colour filter that gets thicker the further you look through it. <span class=\"k fail\">Red</span> goes first. Sink the card on the bench and watch the 2023 threshold die, and notice the stranger failure: before it goes blind, it starts seeing an orange post as a green arrow.",
      "That autumn I also made my first face detector, which three years later turned out to also be a backpack detector, and the team's interview task, whose test set turned out to be its training set. I went back to all of them in 2026 and graded them properly. The grades are in the notes.",
    ],
    split: { me: "Vision: detectors, datasets, the re-graded experiments below." , team: "BRACU Duburi's vehicles and their mechanical, electrical and control work." },
    media: [
      { src: "/media/notes/green-at-depth-desk-2023-arrow.webp", alt: "A 2023 screenshot: a hollow green arrow outlined by a colour threshold, plus green reflections", caption: "<b>November 2023.</b> The file was called arrow detection. It detected green.", tier: "Own" },
      { src: "/media/notes/pareidolia-rerun.webp", alt: "A 2023 webcam frame rerun through a Haar cascade: one box on a face, one on two backpacks", caption: "My first face detector, rerun in 2026: one face, two backpacks.", tier: "Own" },
      { src: "/media/notes/interview-bottle-dry_vs_3m.webp", alt: "Bottles with detector boxes, dry and under three metres of simulated water", caption: "The interview bottle, dry and at 3 m of simulated water.", tier: "Own" },
    ],
    benches: [{ key: "colour-depth", title: "Sink a colour card" }],
    notes: [
      { href: "/notes/green-at-depth", label: "green, at depth" },
      { href: "/notes/pareidolia", label: "pareidolia" },
      { href: "/notes/interview-bottle", label: "the interview bottle" },
      { href: "/notes/why-radar-doesnt-work-underwater", label: "why radar doesn't work underwater" },
    ],
    lesson: "The first failure is a hallucination, not blindness.",
  },
  {
    id: "cat", n: 3, when: "2024", bn: "বিড়াল", bnGloss: "cat", domain: "ground",
    title: "Small machines, big lessons",
    kicker: "Six hours, no team, one ultrasonic sensor, and a campus cat for a role model.",
    body: [
      "February 2024, a contest. The team bailed, the last servo burnt out, the cupboard was empty. What was left: a 4WD chassis, an Arduino, one ultrasonic sensor on a stalk, and a night. I named the robot after Bhapa, the campus cat, who has her own university ID and better obstacle avoidance.",
      "Two years later I read the code properly. The robot I'd demoed never turned and never reversed: both sides of the drive averaged to the same speed, and a negative speed wrapped to a polite crawl. Press <em>v1</em> on the bench and watch it find a wall and commit to it. Then press <em>v2</em>.",
      "The same year: a laptop that narrated a bottle (<em>\"probably move to right with speed of 98.41 px/s\"</em>) and four LEDs that told a person which way to move a camera. Both turned out to be control problems in disguise. A person who obeys four LEDs perfectly, with a normal 250 ms reaction time, sails straight through the target and back, forever.",
    ],
    media: [
      { src: "/media/e-bhapa/bhapa.webp", alt: "Bhapa, the BRAC University campus cat, wearing a student ID", caption: "<b>Bhapa.</b> Has her own university ID.", tier: "Own" },
      { src: "/media/e-bhapa/e-bhapa.webp", alt: "E-Bhapa: a 4WD acrylic chassis with an ultrasonic sensor on a stalk", caption: "<b>E-Bhapa.</b> Looks identical, wow.", tier: "Own" },
      { src: "/media/notes/half-a-second-run-2024-1.webp", alt: "A 2024 webcam frame: a bottle in a blue tracking box with a narrated speed", caption: "<b>2024.</b> Two decimal places of confidence.", tier: "Own" },
    ],
    benches: [{ key: "ebhapa", title: "E-Bhapa in a room" }, { key: "delay", title: "Four LEDs, one person, 250 ms late" }],
    notes: [
      { href: "/notes/e-bhapa", label: "E-Bhapa" },
      { href: "/notes/four-leds", label: "four LEDs" },
      { href: "/notes/half-a-second", label: "half a second" },
    ],
    lesson: "Wiring was the bug. The rule was the design mistake.",
  },
  {
    id: "ground", n: 4, when: "Dec 2024 – May 2025", bn: "মাটি", bnGloss: "earth", domain: "ground",
    title: "A rover arm that types",
    kicker: "Rovers taught me manipulation and vision.",
    body: [
      "The University Rover Challenge asks a rover to find a keyboard and type on it, alone. With BRACU Mongol-Tori's autonomous sub-team I wrote the inverse kinematics for the 2-DOF arm, built a lightweight vision unit kept separate from the rover's main computer (so typing could never starve driving), wrote OCR to tell the keys apart, and ran the dataset pipeline.",
      "Two links and a target is a closed-form problem: the law of cosines gives the elbow, two arctangents give the shoulder. The honest line in the solver is the one that says <em>out of reach</em> instead of stretching. Click a key on the bench; try the far corner.",
    ],
    split: {
      me: "2-DOF arm IK, the separate vision unit, key OCR, the URC 2025 dataset pipeline, a calibration GUI and sim.",
      team: "The rover, its drive and science systems. <a href=\"https://www.bracu.ac.bd/news/brac-universitys-mongol-tori-team-ranks-among-global-top-10-university-rover-challenge-2025\">BRAC University reported</a> a global top-10 finish at URC 2025.",
    },
    media: [
      { src: "/media/lab/detect-keyboard.webp", alt: "A keyboard with individual keys detected and boxed", caption: "Keys found, one box each.", tier: "Bench" },
      { src: "/media/lab/sim-rover-terrain.webp", alt: "A simulated rover on dune terrain beside a mission display", caption: "A rover on simulated dunes.", tier: "Sim" },
    ],
    benches: [{ key: "ik-arm", title: "Two-link IK over a keyboard" }],
    notes: [{ href: "/notes/rovers", label: "a rover arm that types" }],
    lesson: "Finding the keyboard is the task. Pressing it is arithmetic.",
  },
  {
    id: "current", n: 5, when: "2024 – 2026", bn: "স্রোত", bnGloss: "current", domain: "water",
    title: "Three RoboSubs",
    kicker: "Underwater vehicles taught me to trust nothing I hadn't measured.",
    body: [
      "RoboSub happens every summer at the Woollett Aquatics Center in Irvine, California. I was there with Duburi in 2024, 2025 and 2026: first as a junior vision member, then leading the vision sub-team, then as engineering team lead for the 2026 campaign.",
      "The vision years were a slow discovery: most published underwater-vision advice doesn't survive being measured on your own footage. On the team's 2025 competition video, all 25 archived training runs reported mAP50 = 0.995, and the gate model found the gate in <span class=\"k fail\">1.5 %</span> of real frames. The frames were 3.7× blurrier at identical brightness, and not one training config had ever shown the model a blurred image. That kind of gap became the work, and a paper with the team: <a href=\"https://openreview.net/forum?id=qiFAySNAsW\"><em>Color is Also Class Evidence</em></a>.",
      "The score sheets below are RoboNation's, read round by round. Eighth of 58 both years; the best round went up 53 %, and both years ended under the finals wild-card line. From October 2025 to February 2026 I also worked as a junior autonomous engineer at Dubotech, on sonar firmware and navigation.",
    ],
    split: {
      me: "2024: vision. 2025: vision sub-team lead. 2026: engineering team lead.",
      team: "The vehicles, mechanics, electronics and the control and mission code that flew them; the 2025 Entrepreneurship award.",
    },
    media: [
      { src: "/media/certs/robosub-2024.webp", alt: "Certificate of participation, 27th RoboSub, August 2024, Irvine", caption: "27th RoboSub, 2024.", tier: "Doc" },
      { src: "/media/certs/robosub-2025.webp", alt: "Certificate of participation, 28th RoboSub, August 2025", caption: "28th, 2025.", tier: "Doc" },
      { src: "/media/certs/robosub-2026.webp", alt: "Certificate of participation, 29th RoboSub, July 2026, Irvine", caption: "29th, 2026.", tier: "Doc" },
    ],
    benches: [{ key: "robosub", title: "Where the points came from" }],
    notes: [
      { href: "/notes/duburi", label: "how Duburi learned to see" },
      { href: "/notes/the-frame-age-problem", label: "the frame-age problem" },
      { href: "/notes/tracking-without-detection", label: "tracking without detection" },
    ],
    lesson: "Reality must take precedence over public relations.",
  },
  {
    id: "mongla", n: 6, when: "Apr 2026 →", bn: "মোংলা", bnGloss: "Mongla, the port", domain: "water",
    title: "Mongla",
    kicker: "The software I'd build if I controlled the whole architecture.",
    body: [
      "Mongla is named for the port on the Pasur river, the gateway to the Sundarbans. It's an independent ROS 2 autonomy stack for underwater vehicles: perception on a Hailo-8, a right-invariant EKF, a mission language whose vision verbs never raise, over MAVLink to a control board running a 500 Hz loop on a core nothing else may touch. The board and its firmware (<a href=\"https://github.com/RakibulIslam1/srot-control-board\">SROT, Hengla</a>) are Rakibul Islam's.",
      `Its rule is that no number appears without the measurement that produced it, and its front page says <span class="k fail">0 dives</span>, because it has never been in water. ${mCommits} commits since 18 April 2026; ${mTests} tests passing. The ledger keeps the retractions in the same file as the results.`,
      "Take the hull apart on the bench. It's the real CAD mesh, five thrusters on the centreplane, drawn by the same packing the project uses.",
    ],
    split: { me: "The autonomy stack: perception, estimation, missions, tooling, the measurements.", others: "Rakibul Islam: the SROT board, Hengla firmware, Bondor ground station." },
    media: [
      { src: "/media/mongla-docs/mongla-iso.webp", alt: "The Mongla hull CAD: red fairings over a grey pressure can", caption: "The hull, from its CAD.", tier: "Sim" },
      { src: "/media/mongla-docs/mirpur-gate.webp", alt: "Real footage from Mirpur: a gate in hazy turquoise water, boxed by the detector", caption: "Real 2025 footage, Mirpur: the gate at 0.85.", tier: "Water" },
      { src: "/media/lab/latency-verdict.webp", alt: "Latency table for both cameras ending in the verdict: sensor is the limit", caption: "Both cameras: the sensor is the limit.", tier: "Bench" },
    ],
    benches: [{ key: "hull", title: "Take the hull apart" }],
    notes: [
      { href: "/notes/mongla", label: "Mongla, the tour" },
      { href: "/notes/the-engine-room", label: "the engine room" },
      { href: "/notes/mongla-sim", label: "the pool we built" },
      { href: "/notes/the-71-transposes", label: "the 71 transposes" },
    ],
    lesson: "A capability is only real if the path to it is.",
  },
  {
    id: "dristy", n: 7, when: "Sep 2026", bn: "দৃষ্টি", bnGloss: "sight", domain: "sight",
    title: "A camera that answers with a number",
    kicker: "A mailbox, not a queue.",
    body: [
      "Dristy is open firmware for a Kendryte K210 camera that does the seeing itself and sends the robot four bytes (<em>target at error_x, error_y</em>) instead of a video stream. Tiny neural nets on the KPU, classical vision on two RISC-V cores, 8 MiB of SRAM placed by hand.",
      "It's the same idea as Mongla's board split at a smaller scale: keep the heavy thinking away from the thing that has to be on time. And it carries the same rule printed on its README: keep the newest frame, throw the rest away.",
      "Every detector I ever trained is a deeper, more opaque descendant of the 2001 face detector on this bench. Step through its first nine questions, computed on my own 2023 face.",
    ],
    media: [
      { src: "/media/dristy/object.webp", alt: "The K210 camera's own LCD: a laptop boxed and labelled tvmonitor 61 percent", caption: "On-device: a laptop, called a tvmonitor, at 61 %.", tier: "Bench" },
      { src: "/media/dristy/pipeline.webp", alt: "Five stages from light to a few bytes for the robot", caption: "Light to a number.", tier: "Own" },
      { src: "/media/dristy/k210-budget.webp", alt: "K210 SRAM budget diagram", caption: "The budget is the architecture.", tier: "Own" },
    ],
    benches: [{ key: "haar", title: "A face detector's first nine questions" }],
    notes: [{ href: "/notes/dristy", label: "Dristy" }, { href: "/notes/nobody-asked-what-the-camera-decided", label: "what the camera decided" }],
    lesson: "Freshness beats throughput.",
  },
  {
    id: "rupsha", n: 8, when: "Oct 2026 →", bn: "রূপসা", bnGloss: "Rupsha, upstream", domain: "ground",
    title: "Upstream, on dry land",
    kicker: "Same fundamentals, a different vehicle.",
    body: [
      "Rupsha is the river that flows past Khulna and becomes the Pasur, the river Mongla stands on. So Rupsha is the rover stack: upstream of Mongla, on dry land, carrying the same water. A small Ackermann chassis, one driven axle, a steering servo, a camera, an IMU and GPS; a Pi 5 that thinks and an ESP32 board that owns the loop.",
      "Every claim is FIELD, BENCH, BUILT or BLOCKED, and nothing is FIELD yet: the chassis is being built. In Gazebo, an ArUco tag reads about 3 % long, every frame to 4.5 m, flickering at 6 m, never at 8 m, and the whole stack finished a marker leg 1.69 m from the tag.",
    ],
    media: [
      { src: "/media/rupsha/range.svg", alt: "How far a 20 cm tag is seen: never at 8 m, flickering at 6 m, every frame at 4.5 and 3 m", caption: "Tag range, in simulation.", tier: "Sim", wide: true },
      { src: "/media/rupsha/rupsha-split.svg", alt: "The split between the Pi and the board in the rover stack", caption: "The same split as Mongla: the Pi thinks, the board drives.", tier: "Own" },
    ],
    notes: [],
    lesson: "Nothing is FIELD until it has been outdoors.",
  },
  {
    id: "den", n: 9, when: "always", bn: "ঘর", bnGloss: "home", domain: "workshop",
    title: "The Den",
    kicker: "read. derive. build. break. repeat.",
    body: [
      "Arete is the laptop that goes out. Homie is the home PC that holds the fort. Docked, they're five panels and one keyboard: Neovim and tmux, Obsidian for derivations, ROS docs, a radio waterfall, and a custom Quickshell desktop in a great deal of hot pink. Zondo, my illustrated desk-buddy, lives in it.",
      "The small sharp tools live here too: a new-tab page where every site I use daily is a key 1.38 characters long on average, a WebAuthn login with nothing worth stealing, a terminal chat you can watch turn into noise in Wireshark. Type into the start page's real grammar on the bench.",
    ],
    media: [
      { src: "/media/den/den-layout.webp", alt: "The Digital Den layout: two laptop displays, the home PC display, the ScreenPad, and a pixel avatar typing", caption: "Two hosts, five panels, one keyboard.", tier: "Own", wide: true },
      { src: "/media/den/arete-upper.webp", alt: "Obsidian with a rendered calibration equation and a connected canvas", caption: "Turning “I think” into something testable.", tier: "Own" },
    ],
    benches: [{ key: "query", title: "A new tab that takes a key" }],
    notes: [
      { href: "/notes/workshop", label: "the workshop" },
      { href: "/notes/passless", label: "passless" },
      { href: "/notes/secure-p2p-chat", label: "what Wireshark sees" },
    ],
    lesson: "A setup you can't rebuild is a setup you're afraid to change.",
  },
  {
    id: "mohona", n: 10, when: "now", bn: "মোহনা", bnGloss: "the river mouth", domain: "time",
    title: "Open water",
    kicker: "Hope is the decision to keep working on the better version while the current one is still broken.",
    body: [
      "In 2026 I left BRAC University, on principle, and kept building. Since fall 2026 I study computer science and engineering at UIU.",
      "What's next is the obvious and the hard: Mongla's first dive, Rupsha's first time outdoors, and the unglamorous list in between (a depth loop that has held in water, a thruster check that can fail, a velocity estimate with somewhere to go). The flight recorder below is the last year of public commits, rebuilt every day.",
    ],
    media: [],
    benches: [{ key: "recorder", title: "The flight recorder" }],
    notes: [{ href: "/log", label: "the full log" }, { href: "/cv", label: "cv" }],
    lesson: "The river keeps going.",
  },
];
