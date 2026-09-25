/**
 * Engineering deep-dives — real, measured, from the author's own tooling
 * output. Rendered as concept → decision → measurement. Every number here was
 * produced by the mongla / duburi stack on live hardware or its harness.
 */

export interface DeepTable {
  cols: string[];
  rows: (string | { v: string; accent?: 'ok' | 'red' | 'sea' | 'amber' })[][];
}

export interface DeepDive {
  id: string;
  index: string;
  kicker: string;
  title: string;
  lede: string;
  body: string[]; // paragraphs; '> ' = pull line
  terminal?: string[]; // fixed-width lines
  table?: DeepTable;
  stats?: { v: string; l: string }[];
  source: string;
}

export const DEEPDIVES: DeepDive[] = [
  {
    id: 'reflex-split',
    index: '01',
    kicker: 'architecture',
    title: 'Control costs vision nothing',
    lede: 'Put the reflexes on hardware that cannot be interrupted, put the thinking where thinking is cheap, and be careful about the line between them.',
    body: [
      'The board runs a 500 Hz control loop on an ESP32 core — sensors, control, DShot. The Pi does nothing but see. They meet over one USB-C cable. The reason for the split is not tidiness; it is that a controller must never be late, and a neural net sometimes is.',
      'The payoff shows up as a number you can read off the running system: when vision spikes, control does not. The loop on the Pi is slow on purpose, and the vehicle is steady anyway, because the fast loop lives where it belongs.',
      '> Control costs vision nothing — that’s the srot/Hailo separation doing its job, measured.',
    ],
    terminal: [
      'control costs vision nothing — the srot/Hailo separation,',
      'measured: control loop jitter unchanged under vision load.',
    ],
    source: 'mongla — srot/Hailo split, live telemetry',
  },
  {
    id: 'chip-efficiency',
    index: '02',
    kicker: 'the accelerator',
    title: 'Zero wasted decodes',
    lede: 'The Hailo-8 has a scarce budget of TOPS. The whole camera path exists to make sure none of it is spent on a frame that no longer matters.',
    body: [
      'The camera only decodes a frame when the inference worker is idle. So the chip never spends its scarce compute on a frame that has already been superseded by a newer one. It is a simple rule — decode on demand, not on arrival — and it is the difference between a pipeline that looks busy and one that is fast.',
      'The design does not merely claim this. The instrumentation says it, out loud, every ten seconds.',
    ],
    stats: [
      { v: '778', l: 'inferences' },
      { v: '11.5 ms', l: 'frame age at infer-start (mean)' },
      { v: '19.2 ms', l: 'frame age (max)' },
      { v: '0', l: 'decoded-but-never-inferred' },
    ],
    source: 'mongla — chip-efficiency readout',
  },
  {
    id: 'gil-audit',
    index: '03',
    kicker: 'the python problem',
    title: 'Nothing in the hot path holds the GIL',
    lede: 'Python has one lock. On a vehicle, a stage that holds it while it works freezes everything else. So we audited every stage by hold × rate — the fraction of wall-time the process is frozen — instead of waiting for the next symptom.',
    body: [
      'The rule was applied systematically (tools/gil_audit.py), not chased one stall at a time. The verdict: every hot-path stage releases the lock. The only holder left is the viewer feed, which is negligible and off the mission path.',
      '> A parameter that is read, logged and then ignored is worse than one that is unsupported.',
      'The cumulative result of this session’s work: ~28 ms of vision pipeline became 18 ms, ~6.5 ms of control-loop poll wait was removed, and detections roughly doubled — at about 30% less CPU.',
    ],
    table: {
      cols: ['stage', 'duty', 'verdict'],
      rows: [
        ['hailo run_async', { v: '78.3%', accent: 'sea' }, { v: 'frees (was InferVStreams: held)', accent: 'ok' }],
        ['cv2.imdecode', { v: '32.0%', accent: 'sea' }, { v: 'frees', accent: 'ok' }],
        ['letterbox', '2.0%', { v: 'frees', accent: 'ok' }],
        ['pyserial (srot link)', '0.1%', { v: 'frees', accent: 'ok' }],
        ['cv_bridge', '0.1%', { v: 'holds — viewer only, negligible', accent: 'amber' }],
      ],
    },
    stats: [
      { v: '28 → 18 ms', l: 'vision pipeline' },
      { v: '36.5 → 77 Hz', l: 'detections' },
      { v: '~30%', l: 'less CPU' },
    ],
    source: 'mongla — tools/gil_audit.py',
  },
  {
    id: 'sensor-limit',
    index: '04',
    kicker: 'the honest ceiling',
    title: 'The sensor is the limit',
    lede: 'When you optimise a pipeline, the goal is not “fast”. The goal is to make the software disappear as a source of delay — so that what is left is the camera itself. Verified on live hardware, both cameras, the verdict is the one you want.',
    body: [
      'Authority at p99 is 1.000: at the 99th percentile, the freshest frame the sensor could possibly provide is the frame the controller acts on. There is no software latency left to remove. The forward camera runs at 73.4 Hz, the downward at 27.6 Hz, and in both cases the bottleneck is the hardware, not the code.',
      '> The only honest verification that has ever worked here is looking at the frames.',
    ],
    table: {
      cols: ['', 'forward', 'downward'],
      rows: [
        ['rate', { v: '73.4 Hz', accent: 'sea' }, { v: '27.6 Hz', accent: 'sea' }],
        ['pipeline age med / p99', '21.86 / 29.58 ms', '46.94 / 52.44 ms'],
        ['interval med', '12.01 ms', '32.01 ms'],
        ['authority at p99', { v: '1.000', accent: 'ok' }, { v: '1.000', accent: 'ok' }],
        ['verdict', { v: 'sensor is the limit', accent: 'ok' }, { v: 'sensor is the limit', accent: 'ok' }],
      ],
    },
    source: 'mongla — photon-to-command latency, live hardware',
  },
  {
    id: 'xfeat-hailo',
    index: '05',
    kicker: 'a first',
    title: 'XFeat on the Hailo-8 — a number nobody had published',
    lede: 'Getting a state-of-the-art feature matcher to run on a neural accelerator that refused to parse it — and proving the port was exact, not approximate. No FPS figure for XFeat on the Hailo-8 appears to be published anywhere. So this is a new number.',
    body: [
      'Stock XFeat does not even parse for the Hailo-8: the compiler chokes on 71 Transposes, 72 Slices and 70 Unsqueezes, all 5-dimensional. The breakthrough was seeing that they are not 71 problems — they are ONE. They are `_unfold2d(x, ws=8)`, written with `Tensor.unfold`, which torch traces as a pile of 5-D slicing. That operation is space-to-depth, which torch already has as `pixel_unshuffle` and the chip supports natively.',
      'The substitution is not an approximation, and the tool proves it rather than claiming it: `torch.equal` on random input, then the whole network against the stock graph — max abs diff 0.000e+00 across all three heads at both resolutions. It refuses to write otherwise, because a graph that compiles but computes something slightly different would surface later as a worse match rate and be blamed on quantisation.',
      '> A HEF that compiles is not a result.',
      'The honest part is the best part. 701 FPS on the chip is 23× the Pi’s CPU — but only the backbone moved. Keypoint decoding, NMS and the matcher stay in numpy, and the match is the expensive half. So the real win is not the speed; it is that the bottleneck moved from the detector to the matcher, which reframes the next optimisation entirely. And the settings that shipped — top_k 1024, not 2048 — were chosen on real murky footage, not inherited: bank breadth beats keypoint density at equal cost.',
    ],
    stats: [
      { v: '701 FPS', l: 'XFeat backbone on Hailo-8' },
      { v: '23×', l: 'vs the Pi CPU' },
      { v: '0.000e+00', l: 'max abs diff vs stock graph' },
      { v: '4/4 3/4 4/4', l: 'INT8 scores exactly what CPU scored' },
    ],
    source: 'mongla — commits 908559e · 194c063 · 42466c8',
  },
  {
    id: 'dual-cam',
    index: '06',
    kicker: 'perception',
    title: 'Two cameras, one heading',
    lede: 'Redundancy beats tuning. Instead of picking the one camera to trust, run both — a forward gate detector and a downward bin detector — and fuse their headings by how much each should be believed right now.',
    body: [
      'Each camera runs YOLO on CUDA at fp16, 640 px, and publishes to its own frame: a PID controller and a pure-CV estimator side by side, so a consumer can choose. The fusion weights the forward and downward headings (wf, wd) by confidence, not by a hardcoded preference.',
      'It is the bumblebee doctrine in one screen: when you cannot pick a threshold, run both and let the consumer decide.',
    ],
    terminal: [
      'ID:1 shaw_fish_gate 0.92   YOLO[front] cuda:0 fp16=True sz=640',
      'ID:1 yellow_box_octagon 0.93   YOLO[down] cuda:0 fp16=True sz=640',
      'FUSION (front + down)  fused heading +94.0°  (wf=0.36, wd=0.49)',
    ],
    source: 'duburi — dual-cam PID + pure-CV fusion',
  },
];
