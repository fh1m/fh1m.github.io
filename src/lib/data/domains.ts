/** The three domains Fahim builds in — the "what I build" triptych. */

export interface Domain {
  key: 'underwater' | 'air' | 'ground';
  index: string;
  title: string;
  sub: string;
  body: string;
  bullets: string[];
  accent: string; // css var
}

export const DOMAINS: Domain[] = [
  {
    key: 'underwater',
    index: '01',
    title: 'Underwater',
    sub: 'AUVs that see without radio, GPS, or a second chance',
    body: 'Autonomous underwater vehicles for RoboSub — a full ROS 2 stack from the flight-controller firmware to the neural net that sees the course. Vision on a Hailo-8, control at 500 Hz on a board I wrote the firmware for, and a right-invariant EKF that fuses depth, optical flow and heading.',
    bullets: ['ROS 2 · MAVLink', 'Hailo-8 vision @ 53.9 Hz', 'Right-invariant EKF', 'Custom board firmware'],
    accent: 'var(--sea-lit)',
  },
  {
    key: 'air',
    index: '02',
    title: 'Air',
    sub: 'Rockets, GNC, and GPS-denied flight',
    body: 'Guidance, navigation & control for experimental rocketry and UAVs — TVC gimbal control, an in-house flight computer for a monocopter, VSLAM for GPS-denied navigation, and trajectory prediction validated against real flight data. Part of the team behind Bangladesh’s first hybrid rocket engine test.',
    bullets: ['TVC / PID control', 'Monocopter flight computer', 'VSLAM navigation', 'RocketPy trajectory'],
    accent: 'var(--red-lit)',
  },
  {
    key: 'ground',
    index: '03',
    title: 'Ground',
    sub: 'Rovers, arms, and edge vision',
    body: 'Autonomy for planetary-analog rovers — inverse kinematics for a dexterous arm, a standalone lightweight vision unit for alignment, custom OCR, and the dataset pipeline behind a global-top-10 University Rover Challenge run.',
    bullets: ['2-DOF IK arm', 'Edge vision unit', 'Custom OCR', 'URC dataset pipeline'],
    accent: 'var(--amber-lit)',
  },
];
