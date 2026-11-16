/**
 * Four missions, one per element. Each is a real failure from the record, and the wrong
 * hypotheses are ones I actually believed (or the standard advice I followed). Bunnu speaks;
 * the words are mine, the attitude is hers.
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
  voice?: { line: string; who: string };
  bunnu: string;          // her last word
  ref: { label: string; href: string };
  report: string;         // the after-action report
}

export const MISSIONS: Mission[] = [
  {
    zone: "air", title: "Hold a rocket upright",
    setup: "Mission one: keep a rocket standing on its own exhaust, steered by two hobby servos. He wrote this in 2024. I watched from the bed.",
    fail: "It wobbles. Then it wobbles harder. That isn't a mood, it's a feedback loop.",
    hypotheses: [
      { text: "Turn up P. It isn't trying hard enough.", right: false, reply: "Now it wobbles faster. Confidence is not a control strategy." },
      { text: "Filter the accelerometer more. It's noise.", right: false, reply: "Smoother noise, same wobble. The noise wasn't the problem." },
      { text: "The filter forgets everything: angleX is declared fresh inside the function, every single call.", right: true, reply: "There it is. The estimate had no memory, so every loop started from garbage." },
    ],
    fix: "Keep the filter's state outside the loop, and write dt in seconds: the integral and derivative had been carrying a factor of a thousand in milliseconds. A filter with no memory isn't a filter.",
    voice: { line: "If you only do what you can do, you will never be more than you are now.", who: "Shifu" },
    bunnu: "He found it two years later, reading his own code like a stranger's. I'd have told him sooner. Nobody asks the cat.",
    ref: { label: "the 2024 gists", href: "https://gist.github.com/fh1m/e3a64a4dc321eee82a6d761142e63ba2" },
    report: "/missions/air",
  },
  {
    zone: "water", title: "Drive through the gate",
    setup: "Mission two: put the sub through the gate. The camera sees the gate perfectly well. That's the problem, it turns out.",
    fail: "It steers to where the gate was, about a third of a second ago.",
    hypotheses: [
      { text: "The detector's too slow. Use a smaller model.", right: false, reply: "Faster model, same lag. The time isn't being lost in the model." },
      { text: "Drain the camera queue and use the last frame. Every tutorial says so.", right: false, reply: "396 ms became 348 ms. It's still steering by a fossil." },
      { text: "A full camera queue keeps the oldest frames and drops every new one. Keep only the newest.", right: true, reply: "Yes. A mailbox, not a queue." },
    ],
    fix: "When the driver's buffers are full it keeps the oldest frames and throws away every new one, so draining the queue hands you the least-old fossil. A thread that keeps only the newest frame makes the picture current.",
    numbers: "Frame age: 396.1 ms as shipped, 348.1 ms with the standard fix, 16.9 ms with a keep-up thread.",
    voice: { line: "Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.", who: "Oogway" },
    bunnu: "Oogway would be proud. I'm mostly hungry.",
    ref: { label: "commit 50d69a8", href: "https://github.com/fh1m/mongla_ws/commit/50d69a8" },
    report: "/missions/water",
  },
  {
    zone: "earth", title: "Back away from the wall",
    setup: "Mission three: drive up to the wall, then back away and turn. This robot was built in one night in 2024 and named after a different cat.",
    fail: "It drives into the wall. Then it keeps driving into the wall, very politely.",
    hypotheses: [
      { text: "The motor driver's dead.", right: false, reply: "The motors are fine. They're doing exactly what they're told." },
      { text: "Front and rear wiring are swapped.", right: false, reply: "Half true: the wiring was wrong. Fix it, and it still won't reverse." },
      { text: "The speed is a uint8. Asking for −255 wraps around to 1.", right: true, reply: "Full power in reverse became a crawl forward. Into the wall." },
    ],
    fix: "The motor library takes speed as an unsigned byte, so every negative speed wrapped to a small positive one. A signed speed plus a direction, and the robot reverses, turns, and stops loving walls.",
    numbers: "Pinned against a wall 87 % of a simulated run, as flashed in 2024.",
    voice: { line: "We don't make mistakes, just happy accidents.", who: "Bob Ross" },
    bunnu: "Bob Ross would call it a happy accident. The wall would not.",
    ref: { label: "fh1m/E-Bhapa", href: "https://github.com/fh1m/E-Bhapa" },
    report: "/missions/earth",
  },
  {
    zone: "fire", title: "Find the missing detections",
    setup: "Mission four: we shrink into the accelerator. (This one is Mongla's Hailo-8, not the K210.) Every light on the dashboard says healthy.",
    fail: "Camera running, topics up, parameters answering. Detections: none. For ever.",
    hypotheses: [
      { text: "The camera's dead.", right: false, reply: "Thirty frames a second, all fine. Look closer." },
      { text: "Publisher and subscriber disagree on QoS.", right: false, reply: "Checked: they match. Good guess, though. That exact one bit him two days earlier." },
      { text: "The accelerator was still held by an old process. The model never loaded, and nothing said so.", right: true, reply: "The loader logged FATAL and returned. The detector stayed empty, and skipped every frame, politely, for ever." },
    ],
    fix: "A node that can't do its job must exit or shout. Now it does, and the alarm watches the output rate instead of whether the process is alive.",
    voice: { line: "There is no secret ingredient.", who: "Mr. Ping" },
    bunnu: "He added a check that screams. I approve of screaming.",
    ref: { label: "commit 82c4e70", href: "https://github.com/fh1m/mongla_ws/commit/82c4e70" },
    report: "/missions/fire",
  },
];
