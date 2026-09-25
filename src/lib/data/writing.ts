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
    slug: 'the-71-transposes',
    title: 'The 71 transposes that were one operation',
    dek: 'How a feature matcher that refused to compile for a neural accelerator turned out to be a single idea wearing 71 masks — and why proving the fix was exact mattered more than the 23× speedup.',
    date: '2026-09',
    minutes: 8,
    thread: 'Perception',
    tags: ['hailo-8', 'xfeat', 'quantisation', 'breakthrough'],
    body: [
      'XFeat is a state-of-the-art lightweight feature matcher. The Hailo-8 is a neural accelerator that does 26 TOPS and nothing else well. Getting the first onto the second should have been a compile step. Instead the compiler died: `UnsupportedShuffleLayerError` on 71 Transposes, 72 Slices and 70 Unsqueezes, all five-dimensional.',
      'The temptation is to fight all 213 operations. The breakthrough was seeing that they are not 213 problems, or even 71 — they are **one**. They are `_unfold2d(x, ws=8)`, written with `Tensor.unfold`, which torch traces as a pile of 5-D slicing. That operation has a name: space-to-depth. torch already has it as `pixel_unshuffle`, and the chip supports it natively. One substitution, and the graph parses.',
      '## The proof, not the claim',
      'Here is the part I care about. A graph that compiles but computes something slightly different is the worst kind of bug: it will surface months later as a worse match rate and get blamed on quantisation, and you will never find it. So the export tool refuses to write the model until it has run `torch.equal` on random input and checked the whole network against the stock graph — max absolute difference `0.000e+00` across all three heads at both resolutions. The substitution is not an approximation. The tool proves it, or it writes nothing.',
      '> A HEF that compiles is not a result.',
      '## The honest part',
      'Then the number: 701 FPS on the chip, 23× the Pi’s CPU — a figure that appears to be published nowhere else. And immediately, the caveat that makes it true: only the backbone moved. Keypoint decoding, NMS and the matcher stay in numpy, and the match is the expensive half. So the real win is not the speed. It is that the bottleneck moved from the detector to the matcher, which reframes the next optimisation entirely. A speedup you cannot spend is not a speedup; knowing exactly where the new wall is, is.',
      'The settings that shipped came from the same discipline. On real murky footage, `top_k=1024` beats `2048` — because the similarity matrix is O(N²) in keypoints, and at a fixed budget four references at 1024 beat one at 2048. Bank breadth beats keypoint density at equal cost. Chosen, not inherited.',
    ],
  },
  {
    slug: 'a-capability-is-only-real',
    title: 'A capability is only real if the path to it is',
    dek: 'The most expensive defect I keep meeting: a feature that is written, reviewed, tested — and never runs, because nothing that runs calls it. A note on reachability as a design constraint.',
    date: '2026-08',
    minutes: 6,
    thread: 'Reliability',
    tags: ['architecture', 'reachability', 'design'],
    body: [
      'Loop closure was implemented. It had code, it had tests, it had a launch file. And it did nothing on the vehicle — because it was wired into a launch file that the documented bringup command does not include. The capability existed. The path to it did not.',
      'This is the oldest and most expensive defect in the codebase, and it has a family: the lock ladder in no launch file, a hold time held at zero, a bank storing a position nothing ever passed, a device path read and then ignored. Every one looked finished. Correct code, passing tests, nothing on the vehicle.',
      '> A capability is only real if the path to it is.',
      '## The fix is a decision, not more code',
      'The instinct is to add the missing switch — declare it in the second launch file too. That is how you get two places that must be kept in step, which is the same bug with a longer fuse. Instead the node configures itself from a single deck-editable file, the same pattern the course priors already use: module constants as defaults, an explicitly-set parameter still winning, and a test that fails if the capability ever reappears in a launch file again.',
      'And it degrades loudly. A malformed config falls back to defaults and says so — because silently ignoring an operator’s edit means they stand on the deck watching for a change that never loaded. The point is not the loop closure. The point is that reachability is a property you design in at write time, because that is the only moment anyone knows whether a consumer exists.',
    ],
  },
  {
    slug: 'the-canary-that-was-already-dead',
    title: 'The canary that was already dead',
    dek: 'Quantising a model to INT8 is supposed to cost accuracy. The question is never “does it cost some” — it is “does it push a passing case under the bar.” A note on measuring the right thing.',
    date: '2026-08',
    minutes: 6,
    thread: 'Measure',
    tags: ['quantisation', 'evaluation', 'judgment'],
    body: [
      'The plan named a canary: one detection column, `torpedo_1`, which INT8 must not push below 15 inliers. Sensible-sounding. It was also wrong, and following it would have killed a working feature.',
      'The bar was set up honestly: re-run the murky-water clip table with the chip as the backbone and everything else identical — the same post-processing, the same MAGSAC, the same 15-inlier trust threshold, the same protocol. The only variable was float32-on-CPU versus INT8-on-Hailo. Every clip scored exactly what it scored on CPU: 4/4, 3/4, 4/4, 4/4, 4/4.',
      '## Read the tell',
      'Quantisation cost a median 7.7% of inliers — and in 5 of 20 columns INT8 read *higher*, up to +40%, which is MAGSAC’s own scatter, not the chip being smarter. The number that actually decides the arm is different: **zero** passing columns crossed the bar. 19 of 20 clear 15 inliers on CPU, and the same 19 of 20 clear it on the chip.',
      '> Reporting the wrong quantity is what lets a defect survive three attempts.',
      'The canary, `torpedo_1` at 12 inliers on the chip, already read 13 on float32. It was below the bar before quantisation ever touched it. Reading its 12 as an “INT8 failure” would have condemned a working arm on a case that was already dead. The real question was whether quantisation pushed any *passing* column under — and none did. Measure the effect you actually care about, through the shipped code path, or you are measuring the harness.',
    ],
  },
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
