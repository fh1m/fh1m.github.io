/**
 * The Range: ten arenas. Each is one natural force, one real machine, one piece
 * of evidence and one test bench. The DOM chapter is the authority; the 3D scene
 * renders whichever chapter is in view.
 */

export type Signal = "measured" | "failure" | "medium" | "estimate";

export interface Evidence {
  value: string;      // short, typeset as a number
  label: string;
  source: string;     // human-readable provenance
  href?: string;
}

export interface Arena {
  id: string;
  n: number;
  bn: string;         // Bangla numeral, for the hover easter egg
  force: string;      // what nature does here
  title: string;
  kicker: string;     // one line: the bet
  story: string[];    // paragraphs (simple inline HTML allowed: <em>, <a>, <code>)
  margin: string;     // the calm notebook note, often the joke
  evidence: Evidence[];
  bench: string;      // test bench component key
  benchTitle: string;
  notes: { href: string; label: string }[];
  photos: { src: string; alt: string; caption: string }[];
  signal: Signal;
}

const bn = (n: number) => "০১২৩৪৫৬৭৮৯"[n];

export const arenas: Arena[] = [
  {
    id: "bench-zero", n: 0, bn: bn(0), force: "curiosity", signal: "estimate",
    title: "Bench zero",
    kicker: "Everything with screws in it was, at some point, open on my floor.",
    story: [
      "It started the usual way: remote-control cars, then anything else with a circuit board. Most of them did not survive the investigation. The ones that did taught me the first rule of this whole site: a machine is a set of guesses about the world, and the world grades them.",
      "The earliest robot still on record is <a href=\"https://github.com/fh1m/E-Bhapa\">E-Bhapa</a>, built for a university contest in one sleepless night in February 2024 after the team bailed and the last servo burnt out. One ultrasonic sensor, four wheels, an Arduino and a motor shield. Named after Bhapa, the campus cat, who it resembles closely and imitates poorly.",
      "Two years later I read its code properly. It could never turn: the wiring sent the same speed to both sides. It could never reverse: a negative speed wrapped through an unsigned byte into a polite crawl forward. And its \"object following\" drove into objects. The fixed v2 compiles to 5,030 bytes and spends 1 % of its time pinned to walls instead of 87 %.",
    ],
    margin: "Two bugs that cancel out are still two bugs. I learned that here, then relearned it on every robot since.",
    evidence: [
      { value: "87 % → 1 %", label: "time pinned against a wall, v1 vs v2 (simulated, 10 × 3 min)", source: "fh1m/E-Bhapa sim/run.py", href: "https://github.com/fh1m/E-Bhapa" },
      { value: "−255 → 1", label: "what a \"full reverse\" became in a uint8_t", source: "AFMotor setSpeed(uint8_t)" },
    ],
    bench: "ebhapa", benchTitle: "Drive E-Bhapa at a wall, v1 vs v2",
    notes: [{ href: "/notes/e-bhapa", label: "The six-hour robot, audited" }],
    photos: [{ src: "/media/e-bhapa/e-bhapa.webp", alt: "E-Bhapa: a 4WD acrylic chassis with an HC-SR04 sensor on a stalk", caption: "E-Bhapa, February 2024. The sonar is the face." }],
  },
  {
    id: "water", n: 1, bn: bn(1), force: "water", signal: "medium",
    title: "Water",
    kicker: "No radio, no GPS, no second chance to explain yourself.",
    story: [
      "Water is the strictest judge I have worked for. It absorbs red first, then everything. It bends light at the port glass, so a lens calibrated in air sees 27 % less once submerged. It weighs 800 times more than air, so a controller tuned for a drone simply loses. And it moves while you are deciding.",
      "For three years I worked on BRACU Duburi's autonomous underwater vehicles: first the vision stack (rebuilt on modern detectors, trained on our own footage, adapted across pools), then the whole machine as engineering lead. At RoboSub, in San Diego, against 58 teams, we placed <strong>8th in 2025</strong> and <strong>8th again in 2026</strong>, on 53 % more points. 2025 also brought a special Entrepreneurship award.",
      "The colour card on the right is the problem in miniature. Drag it deeper and watch the red vanish while the green, the cheap way to find a gate marker, starts lying to you.",
    ],
    margin: "Most published underwater-vision advice did not survive being measured on our own footage. That sentence cost a year.",
    evidence: [
      { value: "8th / 58", label: "RoboSub 2025 · best round 4,083 points", source: "RoboNation score sheets via mongla_ws", href: "https://fh1m.github.io/mongla_ws/" },
      { value: "8th / 58", label: "RoboSub 2026 · best round 6,234 points (+53 %)", source: "RoboNation score sheets via mongla_ws", href: "https://fh1m.github.io/mongla_ws/" },
      { value: "63.8° → 46.7°", label: "one lens's field of view, air → water (Snell)", source: "mongla_ws, measured in air", href: "https://fh1m.github.io/mongla_ws/" },
    ],
    bench: "colour-depth", benchTitle: "Sink a colour card",
    notes: [
      { href: "/notes/duburi", label: "How Duburi learned to see" },
      { href: "/notes/green-at-depth", label: "How deep before the water lies to a colour threshold?" },
      { href: "/notes/interview-bottle", label: "The interview task, re-graded" },
    ],
    photos: [
      { src: "/media/mongla-docs/robosub-deploy.webp", alt: "Deploying the vehicle at RoboSub", caption: "Deployment at RoboSub, San Diego." },
      { src: "/media/mongla-docs/team-bd-flag.webp", alt: "The team with the flag of Bangladesh at RoboSub", caption: "The team, and the flag." },
    ],
  },
  {
    id: "mongla", n: 2, bn: bn(2), force: "the deep end", signal: "medium",
    title: "Mongla",
    kicker: "Machines that have to work when nobody is watching.",
    story: [
      "In April 2026 I started <a href=\"https://github.com/fh1m/mongla_ws\">Mongla</a>: an independent ROS 2 autonomy stack for AUVs, named for the port of Mongla on the Pasur river, the gateway to the Sundarbans. The fast loop lives where it belongs, on a 500 Hz board whose firmware (Hengla, by Rakibul Islam) nothing else may interrupt. The Pi 5 and its Hailo-8 only think.",
      "The rule of the project is the one the water taught: every capability carries the file or the measurement behind it, and the rows that are blocked stay visible. A capability map that hides the blocked rows is marketing.",
      "The hull is 702 mm of red fairing over a grey pressure can, five thrusters in the CAD and seven on the finished machine. The model on the right is that CAD, at 0.9 mm tessellation. Take it apart.",
    ],
    margin: "In water: 0 dives. Its predecessors competed at RoboSub 2025 and 2026. This one has only met a bench, and it says so on its front page.",
    evidence: [
      { value: "500 Hz", label: "control loop, on a core nothing else may interrupt", source: "mongla_ws", href: "https://fh1m.github.io/mongla_ws/" },
      { value: "53.9 Hz", label: "Hailo-8 detection through the live ROS graph", source: "mongla_ws, bench", href: "https://fh1m.github.io/mongla_ws/" },
      { value: "18.0 ms", label: "photon to detection, median", source: "mongla_ws, bench", href: "https://fh1m.github.io/mongla_ws/" },
    ],
    bench: "hull", benchTitle: "Take the hull apart",
    notes: [
      { href: "/notes/mongla", label: "Mongla, from the inside" },
      { href: "/notes/the-71-transposes", label: "The 71 transposes that were one operation" },
      { href: "/notes/mongla-sim", label: "The simulator it rehearsed in" },
    ],
    photos: [
      { src: "/media/mongla-docs/mongla-iso.webp", alt: "The Mongla hull CAD, isometric", caption: "The CAD in its livery. Not a render made for this page; the same mesh as the model." },
      { src: "/media/mongla/sim-gate-course.webp", alt: "Mongla Sim: a gate course in the simulated pool", caption: "Mongla Sim: 13 courses and an operator lab." },
    ],
  },
  {
    id: "air", n: 3, bn: bn(3), force: "gravity", signal: "failure",
    title: "Air",
    kicker: "Something that has to leave the ground is the hardest place to hide.",
    story: [
      "Before water there was air. From 2023 I was a core member of Amateur Experimental Rocketry (AERD): avionics, guidance, navigation and control, trajectory prediction, parachutes, and the less glamorous art of procurement. I worked with Pixhawk and Betaflight flight controllers, led V1 of an in-house flight computer for a monocopter UAV, and ran RocketPy trajectory predictions against real flight data.",
      "AERD tested what was reported as Bangladesh's first hybrid rocket engine. At BRAC's LASSET lab I wrote an in-house PID controller for a two-axis thrust-vector-control gimbal, the demo that went to the Research Excellence Awards Initiative.",
      "A controller is not clever. It is patient, hundreds of times a second. The gimbal on the right is a toy with honest shapes: push it with wind and tune the three knobs.",
    ],
    margin: "P alone overshoots, because at the moment it is finally pointing the right way it is still turning. Most of my early tuning sessions, summarised.",
    evidence: [
      { value: "1st", label: "hybrid rocket engine tested in Bangladesh (AERD)", source: "The Daily Star", href: "https://www.thedailystar.net/campus/news/first-hybrid-rocket-engine-bangladesh-tested-successfully-3418016" },
      { value: "2-axis", label: "TVC gimbal, in-house PID", source: "CV 2026" },
    ],
    bench: "gimbal", benchTitle: "Hold a TVC gimbal against the wind",
    notes: [{ href: "/notes/rockets", label: "From rockets to water" }],
    photos: [
      { src: "/media/aerd/cover.webp", alt: "The AERD team at a launch event", caption: "AERD." },
      { src: "/media/press/dailystar-hybrid-rocket.webp", alt: "Daily Star article on the first hybrid rocket engine test in Bangladesh", caption: "The Daily Star on the hybrid engine test." },
    ],
  },
  {
    id: "ground", n: 4, bn: bn(4), force: "terrain", signal: "estimate",
    title: "Ground",
    kicker: "A rover that has to type on a keyboard, in a desert, on a timer.",
    story: [
      "In 2024–25 I joined BRACU Mongol-Tori's autonomous subteam for the University Rover Challenge. My piece: an arm that types. Inverse kinematics for a two-degree-of-freedom arm, a lightweight vision unit separate from the rover to align it, custom OCR to tell the keys apart, a GUI and a simulator for calibration, and the dataset pipeline behind the run. The team finished in the <strong>global top 10</strong>.",
      "Ground autonomy continues in <a href=\"https://github.com/fh1m/rupsha_ws\">Rupsha</a>, a stack for a small Ackermann rover that is still being built, which is the honest status of most good robots.",
      "Two links, two angles, one key. Drag the target on the right and the arm solves for it, or tells you, correctly, that the key is out of reach.",
    ],
    margin: "The arm was easy. Telling a 'B' from an '8' from three metres, in sunlight, was not.",
    evidence: [
      { value: "Top 10", label: "University Rover Challenge 2025, global (BRACU Mongol-Tori)", source: "BRAC University news", href: "https://www.bracu.ac.bd/news/brac-universitys-mongol-tori-team-ranks-among-global-top-10-university-rover-challenge-2025" },
      { value: "2-DOF", label: "typing arm, analytic IK", source: "CV 2026" },
    ],
    bench: "ik-arm", benchTitle: "Make the arm press a key",
    notes: [{ href: "/notes/rovers", label: "An arm that types" }],
    photos: [{ src: "/media/lab/detect-keyboard.webp", alt: "Keyboard key detection for the URC typing task", caption: "Key detection for the typing task, Mongol-Tori." }],
  },
  {
    id: "delay", n: 5, bn: bn(5), force: "time", signal: "estimate",
    title: "Delay",
    kicker: "At 20 Hz you are not steering. You are voting.",
    story: [
      "Every loop I have built has the same enemy: the gap between seeing and acting. In 2024 I built a rig where a laptop ran YOLO on a webcam and four LEDs told a person which way to move the camera. Analysed two years later, it turned out to be a human-in-the-loop controller that could almost never settle: at a comfortable 600 px/s and a 250 ms reaction time you travel 150 px past a 100 px target before your hand even hears the news.",
      "The fix on paper was dimming the LEDs as you approach. The fix in silicon met two Uno facts: PWM lives only on six pins, and <code>tone()</code> borrows the timer that drives two of them.",
      "Mongla's answer to delay was architectural: the reflexes sit on a 500 Hz board one cable away from nothing, and the Pi only thinks. Slide the delay on the right and watch a perfectly obedient person start hunting.",
    ],
    margin: "A sign error is the only bug that can be fixed twice and thereby unfixed. Delay is the only one that gets worse the more carefully you react.",
    evidence: [
      { value: "95.5 % → 2.0 %", label: "tries that never settled, on/off LEDs vs dimmed (±50 px zone, simulated)", source: "fh1m/four-leds", href: "https://github.com/fh1m/four-leds" },
      { value: "19 %", label: "frames where the 2024 tracker changed its mind about left vs right (real recording)", source: "fh1m/half-a-second", href: "https://github.com/fh1m/half-a-second" },
    ],
    bench: "delay", benchTitle: "Steer with four LEDs and a delay",
    notes: [
      { href: "/notes/four-leds", label: "Four LEDs and a delay" },
      { href: "/notes/half-a-second", label: "Where will it be in half a second?" },
      { href: "/notes/the-frame-age-problem", label: "The frame-age problem" },
    ],
    photos: [{ src: "/media/mongla-docs/loop-rate.svg", alt: "The same disturbance drawn against a 20 Hz and a 500 Hz control comb", caption: "Neither architecture is cleverer. The one underneath simply gets to answer sooner." }],
  },
  {
    id: "noise", n: 6, bn: bn(6), force: "uncertainty", signal: "failure",
    title: "Noise",
    kicker: "Every sensor lies. The question is how many of them, and whether they agree.",
    story: [
      "My first machine-learning script fit a straight line through 100 polite points. On a robot, points are not polite: a depth sensor's calibration comes with bubbles, cable tugs and bit-flips. Least squares believes all of them. Five percent of liars move its depth by 23 cm; RANSAC shrugs off sixty percent, because it trusts the largest group that agrees.",
      "The same family of lessons lives in a decision tree that scored 100 % on Iris and learned nothing, a 2001 face detector that finds faces in Greek coins and in two backpacks hanging on my door, and an interview model whose test set turned out to be its training set, byte for byte.",
      "Add liars to the calibration on the right and watch which line keeps its nerve.",
    ],
    margin: "No estimator survives an organised lie. That is what a second, independent sensor is for.",
    evidence: [
      { value: "0 % / 60 %", label: "breakdown before 5 cm error: least squares vs RANSAC", source: "fh1m/trust-issues", href: "https://github.com/fh1m/trust-issues" },
      { value: "15 / 15", label: "'test' images that were training images (2023 interview model)", source: "fh1m/interview-bottle", href: "https://github.com/fh1m/interview-bottle" },
    ],
    bench: "liars", benchTitle: "Calibrate a sensor that lies",
    notes: [
      { href: "/notes/trust-issues", label: "Trust issues" },
      { href: "/notes/happy-little-trees", label: "Happy little trees" },
      { href: "/notes/pareidolia", label: "Pareidolia" },
      { href: "/notes/a-tighter-measurement", label: "A tighter measurement made it worse" },
    ],
    photos: [{ src: "/media/notes/trust-issues-breakdown.webp", alt: "Depth error vs fraction of lying readings for four estimators", caption: "Four estimators, one sensor, a growing crowd of liars." }],
  },
  {
    id: "sight", n: 7, bn: bn(7), force: "light", signal: "measured",
    title: "Sight",
    kicker: "A detector that sees the wrong thing is worse than one that sees nothing.",
    story: [
      "Most of my work is teaching machines to see things that do not want to be seen: gate markers under murky water, keyboard keys in the sun, a bottle waved in front of a webcam. The path ran from a Haar cascade in 2023, through an SSD-MobileNet trained on 15 photos for a team interview, to YOLO on Jetsons and, now, detection and feature matching compiled for a Hailo-8.",
      "<a href=\"https://github.com/fh1m/Dristy\">Dristy</a> (দৃষ্টি, sight) is the small end of the same question: vision firmware for a Kendryte K210, where the whole model has to fit in a budget you can count in kilobytes.",
      "On the right is what a 2001 face detector actually asks of every 24 × 24 window: nine light-versus-dark comparisons. That's the whole first stage.",
    ],
    margin: "The coins were right. They have faces. I was the one who assumed.",
    evidence: [
      { value: "701 FPS", label: "XFeat backbone on the Hailo-8, after one operator swap (23× the Pi's CPU)", source: "Mongla, bench", href: "/notes/the-71-transposes" },
      { value: "9 / 2,913", label: "Haar comparisons in stage 0 / in the whole cascade", source: "fh1m/pareidolia", href: "https://github.com/fh1m/pareidolia" },
    ],
    bench: "haar", benchTitle: "What a 2001 face detector looks for",
    notes: [
      { href: "/notes/turning-a-camera-into-a-sensor", label: "Turning a camera into a velocity sensor" },
      { href: "/notes/tracking-without-detection", label: "Tracking without detection" },
      { href: "/notes/dristy", label: "Dristy: sight in kilobytes" },
    ],
    photos: [
      { src: "/media/dristy/hero.webp", alt: "Dristy: K210 vision firmware", caption: "Dristy, on a K210." },
      { src: "/media/notes/pareidolia-coins.webp", alt: "Faces the Haar cascade found in coins, a clock and gravel", caption: "Faces in things: Greek coins (correct), a clock and gravel (pareidolia)." },
    ],
  },
  {
    id: "workshop", n: 8, bn: bn(8), force: "entropy", signal: "measured",
    title: "Workshop",
    kicker: "The tools you use every day are the ones that shape how you think.",
    story: [
      "Under every robot there is a desk, and under every desk an operating system someone configured at 2 a.m. Mine is <a href=\"https://github.com/fh1m/.dotfiles\">Sensei Robotics</a>: a documented, dual-display Arch Linux + Hyprland + Quickshell workstation with ROS 2 containers for each vehicle. Before that came a Neovim setup assembled over a year, a keyboard-first browser start page, and a drawer of shell scripts.",
      "Lately the workshop includes agents. I run coding agents across Claude Code, Codex and OMP with a portable harness: shared configuration, session continuity across tools, and a habit borrowed from Mongla, where no claim survives without the evidence that produced it.",
      "The start page on the right is real: the same parser that runs in my browser. Type <code>g:kalman</code>.",
    ],
    margin: "Typing a key is 1.38 characters on average. The domain it replaces is 13.3. I have, conservatively, saved several minutes.",
    evidence: [
      { value: "1.38 vs 13.3", label: "characters per shortcut vs the domain it replaces", source: "fh1m/start-page config", href: "https://github.com/fh1m/start-page" },
    ],
    bench: "query", benchTitle: "A new tab that understands you",
    notes: [
      { href: "/notes/workshop", label: "The workshop" },
      { href: "/notes/a-capability-is-only-real", label: "A capability is only real if the path to it is" },
    ],
    photos: [{ src: "/media/notes/start-page-2023.webp", alt: "October 2023: the start page on a riced bspwm desktop", caption: "October 2023: the start page in its natural habitat." }],
  },
  {
    id: "recorder", n: 9, bn: bn(9), force: "time, counted honestly", signal: "measured",
    title: "Flight recorder",
    kicker: "What actually happened, by date, from the public record.",
    story: [
      "Everything above is the story. This is the log: numbers rebuilt from GitHub every day by the site's own build, a contribution field you can scrub, and the dated record of where I have been.",
      "In 2026 I left BRAC University, a decision made on principle, and continued as an undergraduate in Computer Science and Engineering at United International University. Mongla continued with me.",
    ],
    margin: "If a number on this page is wrong, it is wrong in public, with a timestamp. That is the point.",
    evidence: [],
    bench: "recorder", benchTitle: "Scrub the year",
    notes: [{ href: "/log", label: "The full log" }, { href: "/cv", label: "CV" }],
    photos: [],
  },
];
