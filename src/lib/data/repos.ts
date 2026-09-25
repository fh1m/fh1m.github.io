/**
 * Real public repositories (github.com/fh1m), verified via the GitHub API.
 * Descriptions are the repos' own. Honest flags: `fork`, `noLang`.
 */

export interface Repo {
  name: string;
  desc: string;
  lang: string | null;
  stars: number;
  pushed: string; // YYYY-MM
  created: string; // YYYY-MM
  url: string;
  fork?: boolean;
  featured?: boolean;
  topics?: string[];
}

const base = 'https://github.com/fh1m/';

export const REPOS: Repo[] = [
  {
    name: 'mongla_ws',
    desc: 'Independent ROS 2 autonomy stack for AUVs — custom board firmware (500 Hz), Hailo-8 vision, right-invariant EKF. No number ships without its measurement.',
    lang: 'Python',
    stars: 1,
    pushed: '2026-09',
    created: '2026-04',
    url: base + 'mongla_ws',
    featured: true,
    topics: ['auv', 'ros2', 'mavlink', 'jetson-orin', 'robotics', 'bangladesh'],
  },
  {
    name: 'duburi-codebase_RND',
    desc: 'AUV research & experimental concepts tested on Duburi 4.2 — the R&D bench behind the competition stack.',
    lang: 'Python',
    stars: 1,
    pushed: '2026-04',
    created: '2026-03',
    url: base + 'duburi-codebase_RND',
    featured: true,
  },
  {
    name: 'duburi-sim_ws',
    desc: 'Gazebo simulation workspace for the Duburi AUV — courses, props, both cameras, ground truth.',
    lang: 'Python',
    stars: 0,
    pushed: '2026-09',
    created: '2026-08',
    url: base + 'duburi-sim_ws',
    featured: true,
  },
  {
    name: 'Dristy',
    desc: 'Systems-level C — low-level tooling. (Dristy = “vision/sight”.)',
    lang: 'C',
    stars: 1,
    pushed: '2026-09',
    created: '2026-09',
    url: base + 'Dristy',
  },
  {
    name: 'passless',
    desc: 'Python/Flask proof-of-concept for passwordless WebAuthn authentication.',
    lang: 'Python',
    stars: 0,
    pushed: '2026-05',
    created: '2026-05',
    url: base + 'passless',
    featured: true,
  },
  {
    name: 'cipher-project',
    desc: 'Encryption tool implementing 4 classical ciphers (Caesar, Affine, Playfair, Hill) with a PyQt6 GUI, a CLI, and Hill-cipher key recovery via known-plaintext attack.',
    lang: 'Python',
    stars: 0,
    pushed: '2025-12',
    created: '2025-12',
    url: base + 'cipher-project',
    featured: true,
  },
  {
    name: 'secure-terminal-p2p-chat',
    desc: 'Secure terminal-based P2P chat in Python — RSA key exchange, AES-GCM messaging.',
    lang: 'Python',
    stars: 0,
    pushed: '2026-04',
    created: '2026-04',
    url: base + 'secure-terminal-p2p-chat',
    featured: true,
  },
  {
    name: 'Track_and_Predict',
    desc: 'A system that not only tracks objects but predicts their direction and speed.',
    lang: 'Jupyter',
    stars: 0,
    pushed: '2024-03',
    created: '2024-03',
    url: base + 'Track_and_Predict',
    featured: true,
  },
  {
    name: 'Detect-color-signs',
    desc: 'Night-vision, in software only — detecting colour signs in the dark with computer vision.',
    lang: 'Python',
    stars: 0,
    pushed: '2023-11',
    created: '2023-11',
    url: base + 'Detect-color-signs',
  },
  {
    name: 'Arduino-Vision',
    desc: 'A vision system built on something as simple as an Arduino Uno — ML + microcontroller.',
    lang: 'Python',
    stars: 0,
    pushed: '2024-04',
    created: '2024-03',
    url: base + 'Arduino-Vision',
    featured: true,
  },
  {
    name: 'E_Bhapa',
    desc: 'A bare-bones bot showing what clever firmware can do with minimum sensory overload. Named after BracU’s beloved “Bhapa”.',
    lang: 'C',
    stars: 0,
    pushed: '2024-02',
    created: '2024-02',
    url: base + 'E_Bhapa',
  },
  {
    name: 'calib_challenge_fh1m',
    desc: 'My run at comma.ai’s calibration challenge — estimating camera pitch/yaw from dashcam video. (Fork of commaai/calib_challenge.)',
    lang: null,
    stars: 0,
    pushed: '2023-11',
    created: '2023-11',
    url: base + 'calib_challenge_fh1m',
    fork: true,
    featured: true,
  },
  {
    name: 'Start-Page',
    desc: 'A custom browser start page, inspired by Tilde Enhanced. An early go at web.',
    lang: 'JavaScript',
    stars: 0,
    pushed: '2023-10',
    created: '2023-10',
    url: base + 'Start-Page',
  },
  {
    name: 'Duburi',
    desc: 'The AUV — the platform behind the RoboSub campaigns.',
    lang: null,
    stars: 2,
    pushed: '2025-03',
    created: '2025-03',
    url: base + 'Duburi',
    topics: ['auv', 'rov'],
  },
  {
    name: 'Duburi-AI-Machine-Vision',
    desc: 'AI & machine-vision work for the Duburi subteam.',
    lang: 'Python',
    stars: 0,
    pushed: '2024-07',
    created: '2024-07',
    url: base + 'Duburi-AI-Machine-Vision',
  },
  {
    name: 'Face-Regeneration',
    desc: 'Generative vision experiment — reconstructing faces.',
    lang: 'Python',
    stars: 0,
    pushed: '2023-11',
    created: '2023-11',
    url: base + 'Face-Regeneration',
  },
  {
    name: 'decision-tree-classifier',
    desc: 'A decision-tree classifier from the ground up.',
    lang: 'Python',
    stars: 0,
    pushed: '2023-11',
    created: '2023-11',
    url: base + 'decision-tree-classifier',
  },
  {
    name: 'Linear-Regression',
    desc: 'Linear regression from first principles.',
    lang: 'Python',
    stars: 0,
    pushed: '2023-11',
    created: '2023-11',
    url: base + 'Linear-Regression',
  },
];

export const REPO_COUNT_TOTAL = 24;
export const FEATURED_REPOS = REPOS.filter((r) => r.featured);
