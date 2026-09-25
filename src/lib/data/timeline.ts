/**
 * Log — the career as a commit history. Rendered as a git graph. Newest first.
 * `kind`: commit | merge | tag | branch. `hash` is decorative (7-char).
 */

export interface LogEntry {
  hash: string;
  date: string; // YYYY-MM
  kind: 'commit' | 'merge' | 'tag' | 'branch';
  branch: string;
  title: string;
  body: string;
  refs?: string[];
}

export const LOG: LogEntry[] = [
  {
    hash: 'a1f0c3e',
    date: '2026-09',
    kind: 'tag',
    branch: 'main',
    title: 'Mongla: 1,038 commits, 3,756 tests, in water: never',
    body: 'Independent AUV stack reaches bench-validated. The discipline held: no number without its measurement.',
    refs: ['v-mongla', 'HEAD'],
  },
  {
    hash: 'd42b9a7',
    date: '2026-07',
    kind: 'commit',
    branch: 'duburi',
    title: 'RoboSub 2026 — two vehicles to the semi-finals',
    body: 'BRACU Duburi qualifies two underwater vehicles for the RoboSub 2026 semi-finals. Engineering lead.',
  },
  {
    hash: 'c7e1f20',
    date: '2026-04',
    kind: 'branch',
    branch: 'mongla',
    title: 'Started Mongla — build the stack from scratch',
    body: 'Fork the thinking, keep the lessons. A control board with firmware I write, vision on a Hailo-8, and one rule about numbers.',
  },
  {
    hash: 'b93a5c1',
    date: '2026-01',
    kind: 'commit',
    branch: 'duburi',
    title: 'Promoted to Engineering Team Lead — BRACU Duburi',
    body: 'From vision subteam to owning the whole machine’s reliability.',
  },
  {
    hash: 'f18d0aa',
    date: '2025-08',
    kind: 'merge',
    branch: 'duburi',
    title: 'RoboSub 2025 — semi-final + Entrepreneurship award',
    body: 'Direct-qualified for the semi-finals; won the special Entrepreneurship award in San Diego.',
  },
  {
    hash: 'e5c47b2',
    date: '2025-05',
    kind: 'merge',
    branch: 'mongol-tori',
    title: 'URC 2025 — global top 10',
    body: 'Autonomous arm typing task: 2-DOF IK, an edge vision unit, custom OCR. Mongol-Tori ranks top 10 worldwide.',
  },
  {
    hash: 'a0b6d33',
    date: '2024-12',
    kind: 'branch',
    branch: 'mongol-tori',
    title: 'Joined Mongol-Tori autonomous subteam',
    body: 'Rovers now too — inverse kinematics, edge vision, and the URC dataset pipeline.',
  },
  {
    hash: '9c2e81f',
    date: '2024-06',
    kind: 'commit',
    branch: 'aerd',
    title: 'First hybrid rocket engine in Bangladesh — tested',
    body: 'A&GNC, trajectory prediction, parachute. RocketPy against real flight data; a flight computer for a monocopter UAV.',
  },
  {
    hash: '7b1a940',
    date: '2023-10',
    kind: 'branch',
    branch: 'duburi',
    title: 'Joined BRACU Duburi — AI & Machine Vision',
    body: 'Rebuild the vision stack on modern CNNs; custom dataset pipeline; domain adaptation; edge deployment.',
  },
  {
    hash: '3f5c0d8',
    date: '2023-02',
    kind: 'branch',
    branch: 'aerd',
    title: 'Joined Amateur Experimental Rocketry',
    body: 'How do machines move? Start at the hardest place to hide: something that has to leave the ground.',
  },
  {
    hash: '1a2b3c4',
    date: '2021-03',
    kind: 'commit',
    branch: 'main',
    title: 'First internship — web dev at Thinkit',
    body: 'MongoDB transition on the back end, bug-fixing on the front. The first time code I wrote ran for someone else.',
  },
];
