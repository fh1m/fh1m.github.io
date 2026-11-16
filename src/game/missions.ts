/**
 * Four missions, one per element. Each is a real failure from the record, and the wrong
 * hypotheses are ones I actually believed (or the standard advice I followed). Bunnu is the
 * guide: her lines explain how I reasoned about it and the rule I kept afterwards.
 */
export interface Hypothesis { text: string; right: boolean; reply: string }
export interface Mission {
  zone: "air" | "water" | "earth" | "fire";
  title: string;
  setup: string;          // Bunnu sets it up
  fail: string;           // what the visitor sees go wrong
  hypotheses: Hypothesis[];
  fix: string;            // what was actually true, and what changed
  numbers?: string;       // the measured before/after
  bunnu: string;          // the rule I kept afterwards, in her words
  ref: { label: string; href: string };
  report: string;         // the after-action report
}

export const MISSIONS: Mission[] = [
  {
    zone: "air", title: "Hold a rocket upright",
    setup: "The rocket stands on a gimbal: two hobby servos tilt the nozzle to push the body back upright. Every loop reads the IMU, estimates the tilt and corrects the nozzle. He wrote it in 2024.",
    fail: "The wobble grows with every swing. When an error grows instead of dying out, the loop is feeding it.",
    hypotheses: [
      { text: "Turn up P. It isn't pushing hard enough.", right: false, reply: "More gain made it swing faster. Before tuning how hard a controller pushes, check what it's being fed." },
      { text: "Filter the accelerometer harder. It's noise.", right: false, reply: "Smoothing didn't help. The noise wasn't the cause; the estimate itself was wrong on every cycle." },
      { text: "The filter forgets everything: the angle estimate is declared fresh inside the function, every call.", right: true, reply: "That's it. The estimator started from nothing on each call, so the controller was correcting a number with no history." },
    ],
    fix: "Keep the filter's state outside the loop, and write dt in seconds: the integral and derivative had been carrying a factor of a thousand in milliseconds. A filter with no memory isn't a filter.",
    bunnu: "The rule he kept: check the state before the gains. A controller is only as good as the number it's given.",
    ref: { label: "the 2024 gists", href: "https://gist.github.com/fh1m/e3a64a4dc321eee82a6d761142e63ba2" },
    report: "/missions/air",
  },
  {
    zone: "water", title: "Drive through the gate",
    setup: "The sub has to steer through a gate it finds with its camera. Detection runs at about 54 Hz and the gate is plainly visible.",
    fail: "It steers to where the gate was about a third of a second ago, and hunts from side to side.",
    hypotheses: [
      { text: "The detector's too slow. Use a smaller model.", right: false, reply: "A faster model barely moved the lag. He measured where the time went before changing anything else, and it wasn't the model." },
      { text: "Drain the camera queue and use the last frame, as the references recommend.", right: false, reply: "396 ms became 348 ms. The standard fix recovers 12 %, because a full queue holds the oldest frames, not the newest." },
      { text: "A full camera queue keeps the oldest frames and drops every new one. Keep only the newest.", right: true, reply: "Yes. A thread that keeps only the newest frame took the age of what the sub acts on to 16.9 ms." },
    ],
    fix: "When the driver's buffers are full it keeps the oldest frames and throws away every new one, so draining the queue hands you the least-old fossil. A thread that keeps only the newest frame makes the picture current.",
    numbers: "Frame age: 396.1 ms as shipped, 348.1 ms with the standard fix, 16.9 ms with a keep-up thread.",
    bunnu: "The rule he kept: measure how old the data is, not only how fast the code runs. Throughput can look healthy while the robot steers by the past.",
    ref: { label: "commit 50d69a8", href: "https://github.com/fh1m/mongla_ws/commit/50d69a8" },
    report: "/missions/water",
  },
  {
    zone: "earth", title: "Back away from the wall",
    setup: "E-Bhapa, a contest robot built in one night in 2024, is meant to drive up to a wall, back away and turn.",
    fail: "It drives into the wall and keeps pushing.",
    hypotheses: [
      { text: "The motor driver's dead.", right: false, reply: "The motors are fine. They're doing exactly what they're told." },
      { text: "Front and rear wiring are swapped.", right: false, reply: "Half true: the wiring was wrong. With it fixed, it still won't reverse." },
      { text: "The speed is a uint8. Asking for −255 wraps around to 1.", right: true, reply: "Full power in reverse became a crawl forward, into the wall." },
    ],
    fix: "The motor library takes speed as an unsigned byte, so every negative speed wrapped to a small positive one. A signed speed plus a direction pin, and the robot reverses, turns and leaves the wall.",
    numbers: "Pinned against a wall 87 % of a simulated run, as flashed in 2024.",
    bunnu: "The rule he kept: read the types of every library call. The compiler accepted −255 without a word, and the robot obeyed the wrapped number.",
    ref: { label: "fh1m/E-Bhapa", href: "https://github.com/fh1m/E-Bhapa" },
    report: "/missions/earth",
  },
  {
    zone: "fire", title: "Find the missing detections",
    setup: "Inside Mongla's Hailo-8 accelerator (not the K210). The camera runs, topics publish and every health check is green.",
    fail: "Detections: none, for ever.",
    hypotheses: [
      { text: "The camera's dead.", right: false, reply: "The camera delivers thirty frames a second. The input is fine." },
      { text: "Publisher and subscriber disagree on QoS.", right: false, reply: "They match. It was a fair guess: a QoS mismatch had broken this pipeline two days earlier." },
      { text: "The accelerator was still held by an old process. The model never loaded, and nothing said so.", right: true, reply: "The loader logged FATAL once and returned. The detector stayed empty and skipped every frame, quietly." },
    ],
    fix: "A node that can't do its job must exit or shout. Now it does, and the alarm watches the output rate instead of whether the process is alive.",
    bunnu: "The rule he kept: alarm on output, not on liveness. A process can be up, answering and useless.",
    ref: { label: "commit 82c4e70", href: "https://github.com/fh1m/mongla_ws/commit/82c4e70" },
    report: "/missions/fire",
  },
];
