/**
 * Facts: the one source of truth for the site, the /cv page and the CV PDF.
 * Every entry says where it came from. If a claim can't name a source, it
 * doesn't ship.
 *
 * Sources:
 *   cv26   = the 2026 CV PDF (main branch, static/fahim-faisal-cv.pdf)
 *   mongla = https://fh1m.github.io/mongla_ws/ (RoboSub records read from RoboNation score sheets)
 *   repo   = the named GitHub repository
 *   user   = told by Fahim during the 2026-11-16 rebuild interview
 */

export const person = {
  name: "Fahim Faisal",
  fullName: "Muhammad Fahim Faisal",
  handle: "fh1m",
  email: "fh1m.faisal.work@gmail.com",
  github: "https://github.com/fh1m",
  linkedin: "https://www.linkedin.com/in/fahim-faisal-10615322a/" as string | null, // as listed on bracuduburi.com/team/2026
  place: "Dhaka, Bangladesh",
  line: "Autonomy and robotics: perception, control, embedded.",
  source: "cv26",
} as const;

export interface Education {
  org: string;
  degree: string;
  dates: string;
  note?: string;
  current?: boolean;
  source: string;
}

export const education: Education[] = [
  { org: "United International University (UIU)", degree: "B.Sc. Computer Science and Engineering", dates: "Fall 2026 – present", current: true, source: "user" },
  { org: "BRAC University", degree: "B.Sc. Computer Science, minor in Electrical and Electronic Engineering", dates: "Sep 2023 – Aug 2026", note: "Left in 2026, a decision made on principle.", source: "cv26, user, mongla" },
  { org: "IU International University of Applied Sciences", degree: "B.Sc. Autonomous Systems (one semester, on campus)", dates: "2024", note: "Bad Honnef, Germany.", source: "cv26" },
];

export interface Role {
  org: string;
  title: string;
  dates: string;
  url?: string;
  points: string[];
  source: string;
}

export const roles: Role[] = [
  {
    org: "BRACU Duburi", title: "Engineering Team Lead · formerly Sub-Team Lead, AI & Machine Vision", dates: "Sep 2023 – 2026", url: "https://bracuduburi.com",
    points: [
      "Rebuilt the AUV vision stack on modern CNN detectors with a custom dataset pipeline, domain-specific pretraining and source-free domain adaptation.",
      "Deployed detection on edge hardware for on-vehicle inference; built the team's dev and deployment tooling.",
      "Led engineering for the 2026 RoboSub campaign: 8th of 58 teams, best round 6,234 points.",
      "Two-vehicle 2026 campaign: Duburi 4.5 and Dubomini 2.0 share one ROS 2 stack and coordinate mid-run over an in-house inter-vehicle link; YOLO26 replaced YOLOv11 for NMS-free inference on a Jetson Orin Nano.",
      "Co-author of the team's Technical Design Reports for RoboSub 2025 and 2026.",
    ],
    source: "cv26, mongla",
  },
  {
    org: "Mongla (independent)", title: "Author · autonomy stack for AUVs", dates: "Apr 2026 – present", url: "https://github.com/fh1m/mongla_ws",
    points: [
      "Independent ROS 2 autonomy stack: perception, estimation and a mission language over MAVLink to a 500 Hz control board.",
      "Hailo-8 detection at 53.9 Hz through the live ROS graph; 18.0 ms photon-to-detection median latency. The control board and its firmware are Rakibul Islam's.",
      "Every capability carries the file or the measurement behind it; the blocked rows stay visible.",
      "Contributor to the SROT control board's Hengla firmware and its Bondor ground station (Rakibul Islam's projects).",
    ],
    source: "mongla, repo",
  },
  {
    org: "Dubotech", title: "Junior Autonomous Engineer", dates: "Oct 2025 – Feb 2026",
    points: ["Custom firmware for sonar hardware; a navigation stack for deep-water monitoring; backends for the sonar stack."],
    source: "cv26",
  },
  {
    org: "BRACU Mongol-Tori", title: "Contributor, Autonomous Subteam", dates: "Dec 2024 – May 2025",
    points: [
      "Inverse kinematics for a 2-DOF arm that types on a keyboard; a separate lightweight vision unit for alignment; custom OCR to tell keys apart.",
      "Ran the dataset pipeline for URC 2025, where the team ranked in the global top 10.",
    ],
    source: "cv26",
  },
  {
    org: "Amateur Experimental Rocketry (AERD)", title: "Core Member · A&GNC, trajectory, parachute, procurement", dates: "Feb 2023 – Feb 2025",
    points: [
      "ROS 2 (Humble) data acquisition; flight controllers (Pixhawk, Betaflight); led V1 of an in-house flight computer for a monocopter UAV.",
      "VSLAM for GPS-denied navigation; trajectory prediction with RocketPy against real flight-test data.",
    ],
    source: "cv26",
  },
  {
    org: "BRACU Rocketry, LASSET Lab", title: "Controls & trajectory", dates: "Sep 2024 – Feb 2025",
    points: ["An in-house PID controller for a thrust-vector-control gimbal (2-axis), with a tracking GUI; the demo went to the Research Excellence Awards Initiative."],
    source: "cv26",
  },
  {
    org: "Thinkit Inc", title: "Web Development Intern", dates: "Mar 2021 – Jun 2021",
    points: ["Back-end work for a move to MongoDB; front-end bug fixes. The first code of mine that someone else depended on."],
    source: "cv26",
  },
];

export interface Result {
  year: number;
  event: string;
  team: string;
  result: string;
  detail?: string;
  source: string;
}

export const results: Result[] = [
  { year: 2026, event: "RoboSub 2026", team: "BRACU Duburi", result: "8th of 58 teams", detail: "Best round 6,234 points (semi-final 2). Two vehicles qualified for the semi-finals. Engineering lead.", source: "mongla, cv26" },
  { year: 2025, event: "RoboSub 2025", team: "BRACU Duburi", result: "8th of 58 teams, Entrepreneurship award", detail: "Best round 4,083 points (semi-final 1). Direct-qualified for the semi-finals. Vision sub-team lead.", source: "mongla, cv26" },
  { year: 2025, event: "University Rover Challenge 2025", team: "BRACU Mongol-Tori", result: "Global top 10, as reported by BRAC University", detail: "Autonomous subteam: typing arm, vision unit, dataset pipeline.", source: "cv26, bracu.ac.bd news" },
];

export const publications = [
  {
    title: "Color is Also Class Evidence: Re-evaluating Domain Generalization for Underwater Object Detection",
    authors: "T. M. Wasif Ishmam, Yaad Kamrul Bari, Muhammad Fahim Faisal, Md Khalilur Rhaman",
    venue: "OpenReview, 2025",
    source: "cv26",
  },
  {
    title: "E-Commerce Recommendation System Based on Demand Clues",
    authors: "I. N. Reeve, T. Alam, M. Rahman Munia, A. Atif Showmik, M. F. Faisal",
    venue: "Universe International Journal of Interdisciplinary Research, Vol. 4, Issue 11, 2024",
    source: "cv26",
  },
];

export const skills = {
  Languages: "Python, C, C++, Rust, TypeScript",
  "Robotics": "ROS 2, MAVLink, Nav2, Gazebo/ArduSub SITL, Pixhawk, ESP32, Jetson, Hailo-8",
  "Vision & ML": "PyTorch, OpenCV, YOLO, TensorRT, scikit-learn",
  "Embedded & hardware": "Arduino/AVR, ESP32, K210, KiCad, PCB design",
  Tools: "Linux (Arch), Git, Docker, Bash, Astro, Flask",
  source: "cv26, repos",
} as const;

/** Mongla's measured numbers, quoted with their own caveats (source: mongla). */
export const mongla = {
  loopHz: 500,
  detectHz: 53.9,
  latencyMs: 18.0,
  fovAirDeg: 63.8,
  fovWaterDeg: 46.7,
  tests: 4742,
  dives: 0,
  hullMm: 702,
  source: "mongla (fh1m.github.io/mongla_ws), measured; 'in water: 0 dives' is the project's own wording",
} as const;
