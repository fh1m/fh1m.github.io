/**
 * What each of the machine's forms is, in real hardware and real numbers. Every figure has a source:
 * the 2024 gimbal gists, Mongla's snapshot (src/data/mongla.json), the E-Bhapa repo, Dristy.
 */
export interface ZoneInfo {
  id: "air" | "water" | "earth" | "fire"; name: string; bn: string; colour: string;
  form: string; line: string; real: string; specs: [string, string][]; source: { label: string; href: string };
  /** clickable things standing in this zone (project slugs) */
  objects: string[];
}

export const ZONE_INFO: ZoneInfo[] = [
  {
    id: "air", objects: ["aerd", "gimbal", "meghdhut"], name: "Air", bn: "বাতাস", colour: "#eaa63b", form: "A rocket on a gimbal",
    line: "The motor pushes; two hobby servos tilt the nozzle so the push stays under the rocket. The whole trick is doing that over and over, faster than you can blink, without arguing with itself.",
    real: "2024, BRAC University's LASSET lab: a thrust-vector gimbal on an Arduino.",
    specs: [["IMU", "MPU6050 (accelerometer + gyro)"], ["Actuators", "2 × SG90 servos, pins 9 and 10"], ["Controller", "PID per axis, v2: Kp 2.0 · Ki 0.5 · Kd 1.0"], ["Estimator", "v1: complementary filter, 0.96 gyro / 0.04 accel"]],
    source: { label: "the two gists, 12 and 13 Sep 2024", href: "https://gist.github.com/fh1m/139d52f53c70b3b8b7f45b944ee0ea1c" },
  },
  {
    id: "water", objects: ["duburi", "mongla", "mongla-sim", "green-at-depth", "interview-bottle"], name: "Water", bn: "জল", colour: "#4f8fe0", form: "A sub with five thrusters",
    line: "Down here radio dies within centimetres and red light within metres, so it has to see, decide and steer on its own, from frames that are already old.",
    real: "Mongla: an independent autonomy stack for underwater vehicles (board and firmware by Rakibul Islam).",
    specs: [["Thrusters", "5"], ["Board loop", "500 Hz"], ["Detection", "53.9 Hz"], ["Photon to detection", "18.0 ms"], ["Tests passing", "4,742"], ["Dives", "0, so far"]],
    source: { label: "mongla_ws at 368e8da", href: "https://github.com/fh1m/mongla_ws" },
  },
  {
    id: "earth", objects: ["mongol-tori", "e-bhapa", "four-leds", "rupsha"], name: "Earth", bn: "মাটি", colour: "#79b35f", form: "A rover with a typing arm",
    line: "On land the world pushes back: wheels slip, arms can't reach, walls don't move. Finding the key is the task; pressing it is arithmetic.",
    real: "Mongol-Tori's typing arm (University Rover Challenge 2025) and E-Bhapa, a robot built in one night.",
    specs: [["Arm", "2 links, analytic inverse kinematics (elbow-up)"], ["E-Bhapa's sensor", "one ultrasonic rangefinder"], ["E-Bhapa's motor speed", "uint8, so −255 became 1"], ["Time pinned to a wall", "87 % of a simulated run"]],
    source: { label: "fh1m/E-Bhapa", href: "https://github.com/fh1m/E-Bhapa" },
  },
  {
    id: "fire", objects: ["dristy", "den", "pareidolia", "half-a-second", "trust-issues", "tools"], name: "Fire", bn: "আগুন", colour: "#e5533d", form: "Shrunk into its own chip",
    line: "Fire is the energy we make and spend: firmware on small chips, accelerators, the machine I work on. Every operation costs heat, and shared silicon is a schedule, not a pool.",
    real: "Dristy: open firmware for a K210 camera that answers with a number, not a video.",
    specs: [["Chip", "Kendryte K210, with a KPU for neural nets"], ["Clock", "PLL1 at 400 MHz"], ["Memory", "8 MiB SRAM, placed by hand"], ["Status", "paused, September 2026"]],
    source: { label: "fh1m/Dristy", href: "https://github.com/fh1m/Dristy" },
  },
];
