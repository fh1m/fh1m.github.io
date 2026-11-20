/**
 * Lessons learned, in the shape NASA's Lessons Learned Information System uses:
 * the driving event, what we believed, what was true, the lesson, the recommendation.
 * Every entry is grounded in real commits (linked) or real public code; wording about what
 * happened is paraphrased from the commit bodies, numbers are copied.
 */
export type Element = "air" | "water" | "earth" | "fire";
export interface Lesson {
  id: string; slug: string; element: Element; project: string; date: string;
  title: string;
  driving: string;        // the driving event
  believed: string;       // what we believed (struck through on the page)
  truth: string;          // what was true
  lesson: string;
  recommendation: string;
  refs: { label: string; href: string }[];
}

const C = (h: string) => ({ label: h, href: `https://github.com/fh1m/mongla_ws/commit/${h}` });

export const lessons: Lesson[] = [
  {
    id: "LL-01", slug: "the-kill-switch-that-said-clear", element: "water", project: "mongla", date: "2026-09-07",
    title: "The kill switch that said \"clear\"",
    driving: "Reading the firmware for features nobody was using turned up a whole second board: an ESP32 beside the thruster battery, whose knob makes or breaks propulsion power and reports over a radio link.",
    believed: "KILL = 0 on the wire means thruster power is safely off-limits until someone clears it.",
    truth: "On link loss the firmware deliberately reports the kill as clear, labelled \"display-only\". It isn't display-only: it's re-emitted on MAVLink. So 0 meant either \"power is live\" or \"nobody is telling us\", and a killed hull armed and ran the mission.",
    lesson: "A boolean cannot carry \"I don't know\". The absence of a signal is not a value.",
    recommendation: "Represent unknown explicitly, refuse to arm on it, and test the link-loss path, not just the switch.",
    refs: [C("2eb06f3")],
  },
  {
    id: "LL-02", slug: "the-ack-that-lies", element: "water", project: "mongla", date: "2026-09-03",
    title: "The acknowledgement that lies",
    driving: "Raising the board's attitude telemetry from its 10 Hz default, measured on firmware rev 14.",
    believed: "Ask for 100 Hz and the board either does it or says DENIED.",
    truth: "50 Hz worked (50.17 Hz measured). 100 Hz came back ACCEPTED and ran at 50.00 Hz: silently clamped to its 20 ms floor. The ACK carries no information about what you'll actually get.",
    lesson: "An acknowledgement is a promise about the message, not about the world.",
    recommendation: "Measure the rate you asked for. Verify effects, not receipts.",
    refs: [C("a9dc790")],
  },
  {
    id: "LL-03", slug: "a-mailbox-not-a-queue", element: "water", project: "mongla", date: "2026-09-03",
    title: "A mailbox, not a queue",
    driving: "Asking the camera driver for a frame after the consumer had been busy for 400 ms.",
    believed: "Drain the queue and take the last frame, as every reference recommends, and you're caught up.",
    truth: "A full V4L2 queue keeps the oldest frames and drops every new one. Draining hands you the least-old fossil: 348 ms stale instead of 396. A keep-up thread got 16.9 ms.",
    lesson: "The standard recipe recovered 12 % of the problem. Read the driver's own sequence counter before trusting the recipe.",
    recommendation: "Keep only the newest frame; never let a slow stage queue behind a fast one.",
    refs: [C("50d69a8"), { label: "the frame-age note", href: "/notes/the-frame-age-problem" }],
  },
  {
    id: "LL-04", slug: "clahe-five-times-retracted", element: "water", project: "mongla", date: "2026-09-05",
    title: "Five times the detections, retracted the next day",
    driving: "The 2025 gate model found the gate in 1.5 % of real video frames, though all 25 archived training runs reported mAP50 = 0.995. The gate clip was 3.7× blurrier at the same brightness.",
    believed: "Contrast enhancement (CLAHE) recovers 5× the detections on blurry water.",
    truth: "Re-measured one variable at a time, it never helped: on the gate it destroyed about 95 % of detections. The original A/B had stacked a tracker fix and a confidence change into the same arm. Meanwhile a Bangladeshi pool's footage (Mirpur) showed cross-water transfer was fine: 97.5 % → 93.3 %.",
    lesson: "Anything that makes an image look better to a person moves it away from what the detector learned.",
    recommendation: "Change one variable per arm. A guard test keeps preprocessing off by default.",
    refs: [C("04ba3ac"), C("fd9757d")],
  },
  {
    id: "LL-05", slug: "the-wrong-camera-both-ways", element: "water", project: "mongla", date: "2026-09-07",
    title: "The calibration was wired to the wrong camera, both ways",
    driving: "Checking that a flat-port correction would actually reach the running system, because \"a config change that reaches nothing\" was already on the record three times.",
    believed: "The forward camera publishes the forward camera's calibration.",
    truth: "It published the downward camera's lens (fx 1027.87, 63.82°), named for the camera the system believed it was looking at before the USB rules were found swapped. Both halves were live and neither logged anything.",
    lesson: "A name outlives the fix it was named for.",
    recommendation: "Check identity from the device (USB vendor, serial), not from the filename.",
    refs: [C("3d40aaf")],
  },
  {
    id: "LL-06", slug: "the-blur-was-a-shutter", element: "water", project: "mongla", date: "2026-09-07",
    title: "The blur was a 200 ms shutter",
    driving: "Two complaints on the bench: \"barely finds the board\" and \"lots of motion blur\".",
    believed: "The detector struggles with this prop.",
    truth: "The camera sat in aperture-priority auto and chose a 200 ms exposure. At 5 ms with brightness raised, frames went from mean luma 26.6 to 135. And gain was inert: three settings gave byte-identical frames.",
    lesson: "Before blaming the model, read what the camera decided.",
    recommendation: "Set exposure explicitly, after the stream opens; verify each knob changes the bytes.",
    refs: [C("b46b112"), { label: "the camera-loops note", href: "/notes/nobody-asked-what-the-camera-decided" }],
  },
  {
    id: "LL-07", slug: "a-detector-with-no-model", element: "fire", project: "mongla", date: "2026-09-06",
    title: "A detector with no model, reporting healthy",
    driving: "On the vehicle, detections published nothing while the camera and lock ran at 30 Hz, parameters answered and QoS matched.",
    believed: "Everything said healthy, so the problem is downstream.",
    truth: "The accelerator device was still held by a previous process. The loader logged FATAL and returned; the detector stayed empty, and the inference loop skipped every frame, silently, forever.",
    lesson: "Process up, topics up, zero output is the most dangerous state a robot has.",
    recommendation: "A node that can't do its job must exit or shout. Alarm on output rate, not on liveness.",
    refs: [C("82c4e70")],
  },
  {
    id: "LL-08", slug: "every-axis-reversed", element: "water", project: "duburi", date: "2026-08-06",
    title: "Every axis reversed",
    driving: "In water: forward, yaw and depth all ran backwards under joystick, and stabilise mode flipped the vehicle after arming.",
    believed: "Thruster directions were verified and level calibration was done, so it's the IMU orientation.",
    truth: "One cause covered all five symptoms: motor direction was globally inverted. Manual mode is direct passthrough with no attitude feedback, so its reversal couldn't be an IMU problem. That split the search space in half. In stabilise, corrective torque became anti-corrective: positive feedback, a flip rather than a drift.",
    lesson: "Find the one cause that explains every symptom, and the test that rules out half the tree.",
    recommendation: "Bench-test the sign of every actuator through the full control path, not just the motor in isolation.",
    refs: [C("9470355")],
  },
  {
    id: "LL-09", slug: "the-sign-not-the-size", element: "water", project: "mongla", date: "2026-09-07",
    title: "The sign was wrong, not the size",
    driving: "Optical-flow de-rotation measured three ways on the vehicle. The shipped gains were −1.000 on roll and pitch.",
    believed: "The gains need re-tuning.",
    truth: "Re-derived on the hull: +1.058 and +0.830. Near unity, as a correct focal length predicts, and positive. Only the sign was wrong, and the shipped setting was doubly wrong (error ∝ |S + g| = 2.058).",
    lesson: "When a correction makes things worse, check its sign before its size.",
    recommendation: "Re-derive every gain when the sensor that feeds it changes.",
    refs: [C("07824b4"), C("355e1e3")],
  },
  {
    id: "LL-10", slug: "zero-is-not-unset", element: "water", project: "mongla", date: "2026-09-07",
    title: "Zero is not \"unset\"",
    driving: "The velocity-from-the-floor sensor read 2–10 % of the true distance through the launch path. Four causes were proposed and retracted the same day.",
    believed: "The gyro is noisy at rest; the lever arm explains it; refused intervals lose travel.",
    truth: "My own test instrument published heading = 0.0 against the vehicle's ~180°, flipping the projection sign every interval so the travel cancelled. Fixed, it read 106.5 % through the shipped path.",
    lesson: "Zero is a confident claim of due north. An absent value must look absent.",
    recommendation: "Render absence as \"--\", never 0.0. Keep the wrong causes in the record: they're the useful part.",
    refs: [C("c175499"), C("d1dd627")],
  },
  {
    id: "LL-11", slug: "the-guard-that-could-not-fail", element: "fire", project: "mongla", date: "2026-08-07",
    title: "The guard that could not fail",
    driving: "Firmware rev 8 stopped reporting depth output while the depth controller isn't running, a fix we had asked for.",
    believed: "The arming check verifies the depth loop has settled.",
    truth: "The check only runs while disarmed, when the loop never runs, so the value was always absent: it took the \"not reported → pass\" branch every single time while printing a reassuring line. Nothing failed in either repository.",
    lesson: "A guard that cannot fail is worse than no guard: it prints confidence.",
    recommendation: "Injection-test every guard: break the thing it protects and watch it go red.",
    refs: [C("f27a747"), C("10b8e28")],
  },
  {
    id: "LL-12", slug: "age-since-arrival", element: "water", project: "mongla", date: "2026-09-04",
    title: "Age since arrival is not age since capture",
    driving: "Tracing the camera's kernel timestamp through inference to the control host.",
    believed: "The control loop's \"frame age\" is the age of the frame.",
    truth: "The stamp survived inference and was then overwritten with the time the message landed. The freshness decay, the coast ladder and the torpedo fire gate all measured age since arrival, and the whole 32.5 ms median pipeline delay was invisible to the loop that exists to react to it.",
    lesson: "Every number a robot uses has a clock. Know which one.",
    recommendation: "Carry the capture stamp end to end; never re-stamp on receipt.",
    refs: [C("60f812a"), C("d32baec")],
  },
  {
    id: "LL-13", slug: "a-filter-with-no-memory", element: "air", project: "gimbal", date: "2024-09-12",
    title: "A filter with no memory",
    driving: "A 2024 thrust-vector-control gimbal: an MPU6050 and two SG90 servos, PID on the tilt. Read again in 2026.",
    believed: "v1 fuses gyro and accelerometer with a complementary filter (0.96 / 0.04).",
    truth: "Each call creates a new uninitialized local angleX, rather than retaining the previous estimate. V2 separates X and Y loops but uses accelerometer-only angles. Its I and D gains use milliseconds, so their numerical values cannot be copied unchanged into a seconds-based loop. Servo commands are clamped; the error integrals are not.",
    lesson: "State has to live somewhere. And units are part of the gain.",
    recommendation: "Persist filter state; specify time and gain units; handle a zero interval and actuator saturation.",
    refs: [{ label: "gist v1 (2024-09-12)", href: "https://gist.github.com/fh1m/e3a64a4dc321eee82a6d761142e63ba2" }, { label: "gist V2 (2024-09-13)", href: "https://gist.github.com/fh1m/139d52f53c70b3b8b7f45b944ee0ea1c" }],
  },
  {
    id: "LL-14", slug: "uint8-and-the-polite-crawl", element: "earth", project: "e-bhapa", date: "2024-02",
    title: "A negative speed is a polite crawl",
    driving: "E-Bhapa, a contest robot built in one night in 2024, re-read line by line in 2026.",
    believed: "The robot turns, backs away from walls and follows at a safe distance, as its README said.",
    truth: "It never turned and never reversed: both sides averaged to the same speed, and the motor library's speed is a uint8, so −255 became 1. Pinned against a wall 87 % of the time in simulation.",
    lesson: "Read the library's types. The compiler won't argue for you.",
    recommendation: "Simulate the sketch as written, quirks included, before believing the demo.",
    refs: [{ label: "fh1m/E-Bhapa", href: "https://github.com/fh1m/E-Bhapa" }],
  },
  {
    id: "LL-15", slug: "nothing-is-field", element: "earth", project: "rupsha", date: "2026-10-23",
    title: "Nothing is FIELD until it has been outdoors",
    driving: "Rupsha's rover stack closes loops in Gazebo; the Ackermann chassis is still being built.",
    believed: "Sim-on-hardware would let the real flight board stand in for the field.",
    truth: "It fits and boots on the Pixhawk, but its simulated IMUs never report healthy, so it's BLOCKED. And the board refuses to arm until a person physically rotates it for compass calibration.",
    lesson: "Every claim is FIELD, BENCH, BUILT or BLOCKED, and the states are never blurred.",
    recommendation: "Publish the capability table with its evidence, including the blocked rows.",
    refs: [{ label: "fh1m/rupsha_ws", href: "https://github.com/fh1m/rupsha_ws" }],
  },
  {
    id: "LL-16", slug: "one-device-one-turn", element: "fire", project: "mongla", date: "2026-09-03",
    title: "Two cameras, one accelerator, one turn each",
    driving: "Running the forward and downward cameras through one Hailo-8.",
    believed: "The dual-camera path works; it's just slow to start.",
    truth: "It could never start: one device, one owner at a time. The same physics shows up on the K210 in Dristy, where the camera preview and the neural net share one lease.",
    lesson: "Shared silicon is a schedule, not a pool.",
    recommendation: "Make device ownership explicit and visible; time-share on purpose.",
    refs: [C("35bf33b"), { label: "Dristy", href: "https://github.com/fh1m/Dristy" }],
  },
];

export const byElement = (e: Element) => lessons.filter((l) => l.element === e);
