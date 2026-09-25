/**
 * Writing — long-form notes from the work. Real, technical, honest. Body is an
 * array of paragraphs (strings); a leading '> ' marks a pull-quote, '## ' a
 * subhead, '- ' a bullet. Kept deliberately simple — no markdown runtime.
 */

export interface Essay {
  slug: string;
  title: string;
  dek: string;
  date: string; // YYYY-MM
  minutes: number;
  thread: string;
  tags: string[];
  body: string[];
}

export const WRITING: Essay[] = [
  {
    slug: 'turning-a-camera-into-a-sensor',
    title: 'Turning a camera into a velocity sensor',
    dek: 'No DVL, no GPS. A downward camera and the ground can tell you how fast you are moving — if you trust the geometry more than the number.',
    date: '2026-09',
    minutes: 7,
    thread: 'Perception',
    tags: ['optical-flow', 'localization', 'underwater'],
    body: [
      'A Doppler velocity log is the obvious way to measure an underwater vehicle’s speed over ground. It is also expensive, and we did not have one. So the question became: what do we already have that can measure motion?',
      'The answer was the downward camera. If you know the height above the floor and the camera’s field of view, then optical flow — how far the texture on the floor slides between two frames — is a velocity. The geometry is simple. The trap is that every part of it can lie plausibly.',
      '## The verification that actually worked',
      'The only verification that has ever worked here is looking at the frames. We ran three 30 cm slides across a known distance and checked the implied height against a tape measure: 0.72 / 0.69 / 0.70 m against a 0.72 m tape, worst-case position error 1.09 cm. That is a real measurement — it has a method, conditions, and a bar it had to clear.',
      '> A number with no bar cannot be wrong, so it never gets checked — it just gets quoted, and eventually shipped.',
      'What makes this trustworthy is not that the estimator agreed with another estimator — that only measures agreement. It is that truth was known: a tape on the floor, a slide of a fixed length. Construct the case where you already know the answer, then see if the machine finds it.',
    ],
  },
  {
    slug: 'why-radar-doesnt-work-underwater',
    title: 'Why radar doesn’t work underwater — and what that forces',
    dek: 'Salt water eats radio in centimetres. No radio means no GPS, no radar, no telemetry link when submerged. Every design choice downstream is a consequence.',
    date: '2026-08',
    minutes: 5,
    thread: 'First principles',
    tags: ['physics', 'sensing', 'architecture'],
    body: [
      'Underwater there is no radio, no GPS, and no second chance to explain yourself. Seawater is conductive; it attenuates electromagnetic waves so fast that radar and GPS are simply off the table below the surface. This one physical fact writes most of the architecture for you.',
      'If you cannot get a position fix from the sky, you have to estimate it from the inside — dead reckoning on an IMU, corrected by whatever you can measure locally: depth from pressure, velocity from a camera, heading from the AHRS. If you cannot stream telemetry home, the vehicle has to be right on its own.',
      '> A vehicle either understood what it was looking at, or it did not — and it will not tell you which.',
      'That is why the interesting engineering is not the happy path. It is what happens when the vehicle cannot do something. The answer, on a well-built stack, is never a silent workaround that keeps the demo running. It is a loud refusal and a written reason.',
    ],
  },
  {
    slug: 'the-frame-age-problem',
    title: 'The frame-age problem',
    dek: 'A perception pipeline that looks healthy can be acting on a frame that is 400 ms old. Freshness is a feature you have to build.',
    date: '2026-07',
    minutes: 6,
    thread: 'Perception',
    tags: ['latency', 'real-time', 'vision'],
    body: [
      'When a camera feeds a queue, the consumer reads the oldest frame in the queue. Under load that frame can be hundreds of milliseconds stale — and nothing in the graph looks broken. The detector runs, the boxes appear, the counters tick up. The vehicle is just steering by the past.',
      'We measured it: a naive queue served frames 396 ms stale on average. A mailbox that keeps only the newest frame and drops the rest served them 16.9 ms stale. Same camera, same detector — the difference is entirely in which frame you choose to believe.',
      '## Freshness over throughput',
      'For a moving vehicle, an old correct answer is a wrong answer. Throughput is a benchmark number; freshness is what keeps the control loop honest. The mailbox throws away work on purpose, and that is the right trade.',
      '> The speed of light sucks. — Carmack',
      'The lesson generalises past cameras: any time a slow stage sits behind a fast one, ask what happens to the backlog. If the answer is “it queues,” you have built a time machine pointed the wrong way.',
    ],
  },
  {
    slug: 'from-worked-once-to-works-every-time',
    title: 'From “worked once” to “works every time”',
    dek: 'The gap between a demo and a competition run is the difference between a capability existing and a capability being reachable.',
    date: '2026-06',
    minutes: 6,
    thread: 'Reliability',
    tags: ['testing', 'reliability', 'process'],
    body: [
      'The most expensive defect I keep meeting is the capability that looks finished — correct code, passing tests — and does nothing on the vehicle, because nothing that runs actually calls it. A module written, reviewed, merged, and never reached.',
      '> A capability is only real if the path to it is.',
      'The fix is not more code. It is a decision made at write time: this module is either imported by something that runs, or it carries a written reason naming the consumer it is waiting for. There is no third state, and the moment you write it is the only moment anyone knows whether a consumer exists.',
      '## Injection-verify your guards',
      'A test that has never failed against a real defect is not a guard — it is decoration. So we break the guard deliberately, watch it fail, and restore it. If it does not fail when the thing it protects is broken, it was never protecting anything.',
      'Reliability is not a feeling you get from green checkmarks. It is what remains after you have tried, on purpose, to make each check lie to you.',
    ],
  },
  {
    slug: 'low-cost-vio-and-the-dvl-question',
    title: 'Low-cost VIO and the DVL question',
    dek: 'When you can’t buy the sensor, you have to earn its measurement from the ones you have. A note on fusing depth, flow and heading honestly.',
    date: '2026-05',
    minutes: 7,
    thread: 'Estimation',
    tags: ['ekf', 'sensor-fusion', 'vio'],
    body: [
      'A right-invariant EKF is the spine of the localization stack: it predicts on the board’s IMU and corrects with everything cheap we can measure — depth, optical-flow velocity, heading, and occasional fixes from recognised props.',
      'The subtle part is time. Measurements arrive late — a detection is a description of where the vehicle was when the shutter opened, not where it is now. Applying it on arrival smears the estimate. So late measurements are replayed at the instant they describe, and the filter’s history is corrected from there forward.',
      '> An absent prediction must never be read as a permissive one.',
      'Fusion is where optimism hides. A prior should stop helping exactly when it stops being one; a gate should weaken exactly when the prior stops being worth trusting. Get that backwards and the vehicle steers confidently at nothing.',
      'The DVL question — do we need the expensive sensor? — is not answered by a spec sheet. It is answered by whether the cheap estimate clears the bar the mission needs, measured in water. Until then, the honest state is written down, not assumed.',
    ],
  },
  {
    slug: 'tracking-without-detection',
    title: 'Tracking without detection',
    dek: 'Detectors blink. A lock has to survive the gap between two sightings without inventing a target that isn’t there.',
    date: '2026-04',
    minutes: 5,
    thread: 'Perception',
    tags: ['tracking', 'robustness', 'vision'],
    body: [
      'Real detectors do not fire every frame. Underwater, against murk and caustics, they drop out for stretches — we counted 71 real gaps in one run. If the controller only acts when the detector fires, the vehicle stutters and loses its target.',
      'So you build a lock ladder: a small state machine that coasts a target through detection gaps, sized against the real distribution of gaps rather than a guessed timeout. The rungs are honest about confidence — a rung that names the wrong prop confidently is worse than one that reports LOST, because LOST is honest.',
      '> The failure modes are asymmetric: a missed re-acquisition costs a second; a false one costs the run.',
      'That asymmetry sets the gates. You would rather lose the target and know it than weld two objects into one identity and have every downstream consumer believe the target teleported. Robustness here is not a bigger model — it is refusing to lie during the gap.',
    ],
  },
];
