/**
 * Work — the machines and projects, deep entries. Featured items get full
 * bodies, galleries, stacks and status matrices; the rest are lighter cards.
 * Image paths point at vendored assets (see scripts/fetch-media.mjs).
 * status: state-chip class (water | bench | soft | blocked).
 */

export type WorkStatus = 'water' | 'bench' | 'soft' | 'blocked';

export interface WorkItem {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  domain: 'underwater' | 'air' | 'ground' | 'security' | 'ml' | 'web';
  years: string;
  status: WorkStatus;
  statusLabel: string;
  featured?: boolean;
  summary: string;
  body?: string[];
  stack?: { name: string; weight: number }[];
  subsystems?: { name: string; status: 'ok' | 'warn' | 'fail' | 'off' }[];
  metrics?: { label: string; value: string }[];
  images?: { src: string; alt: string; credit?: string }[];
  links: { label: string; url: string }[];
  tags: string[];
}

export const WORK: WorkItem[] = [
  {
    slug: 'mongla',
    name: 'Mongla',
    tagline: 'An AUV autonomy stack that has to be right when nobody is watching.',
    category: 'Autonomous Underwater Vehicle',
    domain: 'underwater',
    years: '2026 — present',
    status: 'bench',
    statusLabel: 'built · bench-validated',
    featured: true,
    summary:
      'An independent ROS 2 control, mission and vision stack for AUVs — a control board with firmware I wrote, a Hailo-8 neural accelerator that does nothing but see, and a rule that no number appears without the measurement that produced it.',
    body: [
      'Mongla is the stack I would build if I controlled the whole architecture. Reflexes live on the board — a 500 Hz control loop on an ESP32 core handling sensors, control and DShot — and thinking lives on a Raspberry Pi 5 with a Hailo-8 AI HAT. The two are joined by a single USB-C cable speaking MAVLink 2, and exactly one node is allowed to touch the board.',
      'The philosophy is the point: absence renders as “--”, never 0.0; a verb that reports success while the vehicle does nothing is treated as the worst failure there is; and every shipped threshold is backed by a measurement with its method and conditions written next to it. The test suite is 3,756 checks, and the honest status badge reads “in water: never”.',
      'Vision runs at a measured 53.9 Hz through the ROS graph (18.0 ms photon-to-detection), with per-camera calibration measured in water — 46.7°, not the datasheet’s 63.8° in air. A right-invariant EKF predicts on the board IMU and corrects with depth, optical-flow velocity and heading, replaying late measurements at the instant they describe rather than on arrival.',
    ],
    stack: [
      { name: 'Python', weight: 62 },
      { name: 'C / C++ (firmware)', weight: 22 },
      { name: 'GLSL / CUDA', weight: 8 },
      { name: 'Shell / CI', weight: 8 },
    ],
    subsystems: [
      { name: 'PERCEPTION', status: 'ok' },
      { name: 'CONTROL', status: 'ok' },
      { name: 'LOCALIZATION', status: 'warn' },
      { name: 'DEPTH LOOP', status: 'off' },
      { name: 'MISSION DSL', status: 'ok' },
    ],
    metrics: [
      { label: 'CONTROL LOOP', value: '500 Hz' },
      { label: 'VISION (GRAPH)', value: '53.9 Hz' },
      { label: 'TESTS', value: '3,756' },
      { label: 'COMMITS', value: '1,038' },
    ],
    images: [
      { src: '/media/mongla/sim-pool-overview.webp', alt: 'Mongla simulator — pool overview', credit: 'fh1m/mongla_ws' },
      { src: '/media/mongla/sim-gate-course.webp', alt: 'Simulated gate course', credit: 'fh1m/mongla_ws' },
      { src: '/media/mongla/sim-bins-torpedo.webp', alt: 'Bins and torpedo task', credit: 'fh1m/mongla_ws' },
      { src: '/media/mongla/sim-slalom.webp', alt: 'Slalom course', credit: 'fh1m/mongla_ws' },
    ],
    links: [
      { label: 'Repository', url: 'https://github.com/fh1m/mongla_ws' },
      { label: 'Live docs', url: 'https://fh1m.github.io/mongla_ws/' },
      { label: 'The Shift', url: 'https://fh1m.github.io/mongla_ws/the-shift.html' },
    ],
    tags: ['auv', 'ros2', 'vision', 'ekf', 'firmware'],
  },
  {
    slug: 'duburi',
    name: 'Duburi',
    tagline: 'The AUV that put Bangladesh on the RoboSub stage.',
    category: 'Competition AUV',
    domain: 'underwater',
    years: '2023 — 2026',
    status: 'water',
    statusLabel: 'competed · in water',
    featured: true,
    summary:
      'BRACU Duburi’s underwater vehicle — a ROS 2 control, mission and vision platform (Jetson Orin + Pixhawk / ArduSub) I led the vision and later the engineering on across three RoboSub campaigns.',
    body: [
      'Duburi is the competition vehicle behind the press: direct-qualified for the RoboSub 2025 semi-finals, won a special “Entrepreneurship” award, and qualified two vehicles for the 2026 semi-finals. I started on AI & Machine Vision and moved to Engineering Team Lead.',
      'The vision stack was rebuilt on modern CNN architecture with a custom dataset pipeline, Domain-Specific Pretraining and Source-Free Domain Adaptation, and deployed to edge inference on the vehicle. Everything was wrapped in in-house tooling so the team could train, deploy and debug without me in the loop.',
    ],
    metrics: [
      { label: 'ROBOSUB', value: '2023 · 25 · 26' },
      { label: 'AWARD', value: 'Entrepreneurship' },
      { label: 'PLATFORM', value: 'Jetson Orin' },
    ],
    links: [
      { label: 'Team', url: 'https://bracuduburi.com' },
      { label: 'Repo', url: 'https://github.com/fh1m/Duburi' },
      { label: 'Press · TBS 2026', url: 'https://www.tbsnews.net/economy/corporates/bracu-duburi-qualifies-two-underwater-vehicles-robosub-2026-semi-finals-1467436' },
    ],
    tags: ['auv', 'robosub', 'computer-vision', 'edge'],
  },
  {
    slug: 'air-gnc',
    name: 'Air · GNC',
    tagline: 'Guidance, navigation & control for rockets and GPS-denied flight.',
    category: 'Aerospace GNC',
    domain: 'air',
    years: '2023 — 2025',
    status: 'water',
    statusLabel: 'flown · flight-tested',
    featured: true,
    summary:
      'GNC work across Amateur Experimental Rocketry and BRACU LASSET: a ROS 2 DAQ stack, an in-house flight computer for a monocopter UAV, a VSLAM navigation stack, TVC gimbal control, and RocketPy trajectory prediction validated against real flights.',
    body: [
      'Part of the team behind Bangladesh’s first successfully tested hybrid rocket engine, and the AIUB/AERD first weather balloon. I worked A&GNC, trajectory prediction, procurement and parachute development.',
      'On controls: an in-house PID controller for a TVC gimbal and a 2-axis controller, submitted to the Research Excellence Awards Initiative for funding, plus a custom GUI for tracking and monitoring. On navigation: a VSLAM stack for GPS-denied flight and V1 of a flight computer for a monocopter UAV.',
    ],
    metrics: [
      { label: 'FIRST IN BD', value: 'Hybrid engine' },
      { label: 'STACK', value: 'ROS 2 Humble' },
      { label: 'SIM', value: 'RocketPy' },
    ],
    links: [
      { label: 'AERD', url: 'https://www.facebook.com/profile.php?id=61550725171921' },
      { label: 'Press · Daily Star', url: 'https://www.thedailystar.net/campus/news/first-hybrid-rocket-engine-bangladesh-tested-successfully-3418016' },
    ],
    tags: ['gnc', 'vslam', 'tvc', 'uav', 'rocketry'],
  },
  {
    slug: 'mongoltori-arm',
    name: 'Mongol-Tori · Arm',
    tagline: 'A rover arm that types on its own.',
    category: 'Rover Autonomy',
    domain: 'ground',
    years: '2024 — 2025',
    status: 'water',
    statusLabel: 'competed · URC 2025',
    featured: true,
    summary:
      'Autonomous typing for BRACU Mongol-Tori’s rover — inverse kinematics for a 2-DOF arm, a standalone lightweight vision unit for alignment, custom OCR to identify keys, and the dataset pipeline behind a global-top-10 University Rover Challenge run.',
    body: [
      'The autonomous task: find a keyboard, align to it, and type — without a human. I implemented the inverse kinematics for the 2-DOF arm and built a separate, lightweight vision unit (independent of the rover’s main compute) purely for alignment and key detection.',
      'Custom OCR and image processing differentiated and located individual keys; an in-house GUI and sim environment made calibration and early testing possible before the hardware existed. Mongol-Tori ranked among the global top 10 at URC 2025 and were first runner-up at the Bangladesh ICT & Innovation Awards.',
    ],
    metrics: [
      { label: 'URC 2025', value: 'Global top 10' },
      { label: 'ARM', value: '2-DOF IK' },
      { label: 'VISION', value: 'Edge unit' },
    ],
    links: [
      { label: 'Team', url: 'https://www.bracu-mongoltori.com' },
      { label: 'Press · URC', url: 'https://www.bracu.ac.bd/news/brac-universitys-mongol-tori-team-ranks-among-global-top-10-university-rover-challenge-2025' },
    ],
    tags: ['rover', 'inverse-kinematics', 'ocr', 'urc'],
  },
  {
    slug: 'passless',
    name: 'Passless',
    tagline: 'Passwords are the vulnerability. Remove them.',
    category: 'Security',
    domain: 'security',
    years: '2026',
    status: 'soft',
    statusLabel: 'proof of concept',
    featured: true,
    summary:
      'A Python/Flask proof-of-concept for passwordless WebAuthn authentication — public-key credentials instead of a shared secret to steal.',
    metrics: [
      { label: 'AUTH', value: 'WebAuthn' },
      { label: 'STACK', value: 'Python · Flask' },
    ],
    links: [{ label: 'Repository', url: 'https://github.com/fh1m/passless' }],
    tags: ['webauthn', 'security', 'flask'],
  },
  {
    slug: 'cipher-project',
    name: 'Cipher Project',
    tagline: 'Four classical ciphers — and the attack that breaks one.',
    category: 'Cryptography',
    domain: 'security',
    years: '2025',
    status: 'soft',
    statusLabel: 'released',
    featured: true,
    summary:
      'An encryption tool implementing Caesar, Affine, Playfair and Hill ciphers — with a PyQt6 GUI, a CLI, and Hill-cipher key recovery via a known-plaintext attack.',
    metrics: [
      { label: 'CIPHERS', value: '4' },
      { label: 'GUI', value: 'PyQt6' },
      { label: 'ATTACK', value: 'Known-plaintext' },
    ],
    links: [{ label: 'Repository', url: 'https://github.com/fh1m/cipher-project' }],
    tags: ['cryptography', 'pyqt6', 'cli'],
  },
  {
    slug: 'secure-p2p-chat',
    name: 'Secure P2P Chat',
    tagline: 'End-to-end, in the terminal, no server in the middle.',
    category: 'Security',
    domain: 'security',
    years: '2026',
    status: 'soft',
    statusLabel: 'released',
    summary:
      'A secure terminal-based peer-to-peer chat in Python — RSA key exchange, AES-GCM messaging. No central server holds the plaintext.',
    metrics: [
      { label: 'KEY EXCHANGE', value: 'RSA' },
      { label: 'MESSAGING', value: 'AES-GCM' },
    ],
    links: [{ label: 'Repository', url: 'https://github.com/fh1m/secure-terminal-p2p-chat' }],
    tags: ['cryptography', 'p2p', 'networking'],
  },
  {
    slug: 'arduino-vision',
    name: 'Arduino Vision',
    tagline: 'A vision system on an Arduino Uno.',
    category: 'Embedded ML',
    domain: 'ml',
    years: '2024',
    status: 'soft',
    statusLabel: 'released',
    summary:
      'Proof that a vision system does not need a GPU — machine learning plus an Arduino Uno, squeezing perception onto the smallest possible compute.',
    links: [{ label: 'Repository', url: 'https://github.com/fh1m/Arduino-Vision' }],
    tags: ['embedded', 'ml', 'arduino'],
  },
  {
    slug: 'track-and-predict',
    name: 'Track & Predict',
    tagline: 'Don’t just track it — predict where it’s going.',
    category: 'Computer Vision',
    domain: 'ml',
    years: '2024',
    status: 'soft',
    statusLabel: 'released',
    summary:
      'A system that tracks objects and predicts their direction and speed — the seed of the motion-estimation thinking that later showed up underwater.',
    links: [{ label: 'Repository', url: 'https://github.com/fh1m/Track_and_Predict' }],
    tags: ['tracking', 'prediction', 'cv'],
  },
  {
    slug: 'calib-challenge',
    name: 'comma.ai Calib Challenge',
    tagline: 'Estimating camera pitch & yaw from dashcam video.',
    category: 'Computer Vision',
    domain: 'ml',
    years: '2023',
    status: 'soft',
    statusLabel: 'attempted (fork)',
    summary:
      'My attempt at comma.ai’s open calibration challenge — recovering the direction of travel from a moving camera. A fork of commaai/calib_challenge; the fun was in the estimation, not the leaderboard.',
    links: [
      { label: 'My fork', url: 'https://github.com/fh1m/calib_challenge_fh1m' },
      { label: 'Original challenge', url: 'https://github.com/commaai/calib_challenge' },
    ],
    tags: ['self-driving', 'calibration', 'cv'],
  },
];

export const FEATURED_WORK = WORK.filter((w) => w.featured);
