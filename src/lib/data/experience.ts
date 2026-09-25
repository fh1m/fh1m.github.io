/**
 * Experience & education — from the résumé (2026). Dubotech is kept subtle
 * (subtle: true) per Fahim's request. Dates as written on the résumé.
 */

export interface Role {
  org: string;
  title: string;
  dates: string;
  url?: string;
  location: string;
  points: string[];
  tag: 'underwater' | 'ground' | 'air' | 'web' | 'club';
  subtle?: boolean;
}

export const EXPERIENCE: Role[] = [
  {
    org: 'BRACU Duburi',
    title: 'Team Lead — Engineering · former Sub-Team Lead, AI & Machine Vision',
    dates: 'Oct 2023 — Sep 2026',
    url: 'https://bracuduburi.com',
    location: 'Dhaka',
    tag: 'underwater',
    points: [
      'Rebuilt the vision stack on state-of-the-art CNN architecture with a custom dataset pipeline.',
      'Created a training pipeline that streamlines custom models with advanced hyperparameter control.',
      'Integrated Domain-Specific Pretraining and Source-Free Domain Adaptation.',
      'Deployed on edge devices for efficient on-vehicle inference.',
      'Built in-house dev tooling for management and deployment.',
    ],
  },
  {
    org: 'BRACU Mongol-Tori',
    title: 'Contributor — Autonomous Subteam',
    dates: 'Dec 2024 — May 2025',
    url: 'https://www.bracu-mongoltori.com',
    location: 'Dhaka',
    tag: 'ground',
    points: [
      'Implemented inverse kinematics for a 2-DOF arm for autonomous typing tasks.',
      'Built and deployed a lightweight vision unit for arm alignment, separate from the rover.',
      'Wrote custom OCR + image processing to identify and differentiate keys.',
      'Built an in-house GUI and sim environment for calibration and early testing.',
      'Managed the dataset pipeline for URC 2025.',
    ],
  },
  {
    org: 'Amateur Experimental Rocketry (AERD)',
    title: 'Core Member — A&GNC, Trajectory Prediction, Parachute & Procurement',
    dates: 'Feb 2023 — Feb 2025',
    url: 'https://www.facebook.com/profile.php?id=61550725171921',
    location: 'Dhaka',
    tag: 'air',
    points: [
      'Implemented a ROS 2 (Humble) stack for data acquisition.',
      'Worked with flight controllers (Pixhawk, Betaflight); led V1 of an in-house flight computer for a monocopter UAV.',
      'Worked on a VSLAM software stack for GPS-denied autonomous navigation.',
      'Ran trajectory prediction with RocketPy against real flight-test data.',
    ],
  },
  {
    org: 'BRACU Rocketry — LASSET Lab',
    title: 'Sub-Team Member — Controls & Trajectory Prediction',
    dates: 'Sep 2024 — Feb 2025',
    location: 'BRAC University',
    tag: 'air',
    points: [
      'Built an in-house PID controller for a TVC gimbal; submitted the demo to the Research Excellence Awards Initiative for funding.',
      'Implemented a 2-axis controller.',
      'Built a custom GUI for tracking and monitoring.',
    ],
  },
  {
    org: 'Dubotech',
    title: 'Jr Autonomous Engineer',
    dates: 'Oct 2025 — Feb 2026',
    location: 'Dhaka',
    tag: 'underwater',
    subtle: true,
    points: [
      'Developed custom firmware for sonar tech.',
      'Created a navigation stack for deep-water monitoring.',
      'Built and maintained backends for the sonar stack; started in-house tooling documentation.',
    ],
  },
  {
    org: 'Thinkit Inc',
    title: 'Web Dev Intern',
    dates: 'Mar 2021 — Jun 2021',
    location: 'Dhaka',
    tag: 'web',
    points: [
      'Wrote back-end code for a transition to MongoDB.',
      'Fixed front-end bugs.',
    ],
  },
  {
    org: 'ICT Club — SOS Hermann Gmeiner College',
    title: 'General Secretary',
    dates: 'Jan 2022 — Sep 2022',
    location: 'Dhaka',
    tag: 'club',
    points: [
      'Ran the club end to end — seminars, programs, operations.',
      'Automated content management with the YouTube / Facebook APIs.',
    ],
  },
];

export interface Edu {
  org: string;
  degree: string;
  dates: string;
  location: string;
  note?: string;
}

export const EDUCATION: Edu[] = [
  {
    org: 'BRAC University',
    degree: 'BSc Computer Science — Minor: Electrical & Electronic Engineering',
    dates: 'Sep 2023 — present',
    location: 'Dhaka, Bangladesh',
    note: 'Currently in the 6th semester.',
  },
  {
    org: 'IU International University of Applied Sciences',
    degree: 'BSc — Autonomous Systems',
    dates: '2024',
    location: 'Bad Honnef, Germany',
    note: 'One semester, on campus.',
  },
];
