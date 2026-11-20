export const projectContext: Record<string, { problem: string; approach: string; boundary: string }> = {
  aerd: {
    problem: "A rocket test needs more than an ignition. Guidance, data acquisition, a predicted trajectory and recovery all have to describe the same vehicle. Procurement is part of the design: it determines which sensors and components are actually available.",
    approach: "My work spanned a ROS 2 Humble data-acquisition stack, RocketPy trajectory prediction checked against flight-test data, parachute work and procurement. I also led the first version of a flight computer for a monocopter UAV and worked with Pixhawk, Betaflight and visual SLAM. AERD's engine and balloon work were team efforts, hosted and supported by AIUB.",
    boundary: "The hybrid engine test is a team milestone, reported by The Daily Star in September 2023. It is not a claim that I designed the engine. The gimbal controller was separate work at BRAC University's LASSET lab; its later code review is linked below.",
  },
  gimbal: {
    problem: "The thrust-vector gimbal has to correct angular error while the mechanism is already moving. Proportional feedback alone does not account for that motion; integral action can accumulate a request the actuator cannot deliver.",
    approach: "At LASSET I built a two-axis PID controller with a tracking and monitoring GUI. The proportional term reacts to error, the derivative term damps changes, and the integral term addresses persistent bias. The demonstration was submitted to the Research Excellence Awards Initiative for funding consideration.",
    boundary: "The interactive plant on this page is illustrative, not an identified model of the rocket. A later reading of the archived code found a filter whose state was not retained. Keeping the demonstration and the later correction together matters more than preserving a successful-looking clip.",
  },
  meghdhut: {
    problem: "A drone operating without dependable GPS needs an estimate it can use and a control path that remains understandable when that estimate becomes uncertain. That is the direction of this workspace, not a completed flight capability.",
    approach: "Meghdhut is a private, early GPS-denied autonomy workspace. The name comes from the cloud messenger. The work draws on earlier flight-controller, visual-SLAM and MAVLink experience, while keeping the vehicle's safety boundary distinct from a desktop experiment.",
    boundary: "No flight is claimed. The source is private and is not linked or reproduced here. Terminal displays and simulated scenes elsewhere in the archive must not be mistaken for an outdoor flight log.",
  },
  duburi: {
    problem: "The vision problem changes when a vehicle leaves a dataset and enters a pool. Blur, lighting, visibility and the age of a frame can break a pipeline even when its training metrics look excellent. The resulting decision still has to reach a controller on time.",
    approach: "I joined AI & Machine Vision in September 2023, later led the vision sub-team, and led engineering for the 2026 two-vehicle campaign. The work included detectors, data pipelines, edge deployment and development tools. The 2026 technical report describes Duburi 4.5 and Dubomini 2.0, their shared autonomy work and inter-vehicle coordination; mechanics, electronics and vehicle control were team contributions.",
    boundary: "The 2025 and 2026 competition outcomes belong to BRACU Duburi. My public research repository is not the entirety of either competition stack. Later detections drawn over old pool footage are replays, not evidence that today's detector ran on the vehicle in that year's competition.",
  },
  mongla: {
    problem: "Perception, estimation and mission logic share a computer, but the control loop cannot wait for whichever model or process happens to be busy. A capability also needs a launchable path, not merely a class somewhere in the source tree.",
    approach: "Mongla separates the ROS 2 autonomy computer from the real-time control board through MAVLink. My work covers perception, estimation, mission execution, tooling and the evidence behind the claims. The SROT board and Hengla firmware are Rakibul Islam's work; Bondor is his ground station, to which I contributed.",
    boundary: "The stack is bench-validated and has zero dives. Hailo-8 timing, replayed footage and simulation answer particular questions; none of them substitutes for a depth loop or mission demonstrated in water. Measurements on this page are dated results, not live vehicle telemetry.",
  },
  "mongla-sim": {
    problem: "A vehicle stack needs repeatable situations in which to exercise mission transitions without treating every run as a pool appointment. A simulator is useful only if its relationship to the autonomy stack is explicit.",
    approach: "The workspace combines Gazebo with ArduSub software-in-the-loop, course geometry, a simulated DVL and an operator lab. The site records six courses in its inspected snapshot. A contract test checks the boundary between simulator and autonomy rather than assuming that similar-looking interfaces agree.",
    boundary: "Rendered water is still simulation. A simulated DVL is not a measured physical sensor, and finishing a course is not an underwater trial. Repository descriptions may change ahead of this dated evidence; the snapshot's scope stays visible instead of silently growing its claim.",
  },
  "green-at-depth": {
    problem: "The original 2023 code asks whether a pixel's hue lies inside a fixed green interval. Water alters the spectrum reaching the camera, so a rule that finds an arrow on a desk need not continue to find the same object at depth.",
    approach: "The later re-evaluation sinks the original colour rule through a Beer–Lambert water model and compares its detections against the intended target. The interesting failure comes before total blindness: other colours can move into the accepted interval and become false targets.",
    boundary: "The depth sweep is a model-based re-evaluation, not a record of repeated physical dives. It explains an assumption in the detector; it does not establish one universal depth limit for every water body, camera or lighting condition.",
  },
  "interview-bottle": {
    problem: "The team's entry task looked like a detector-training exercise. Reading it again exposed a more basic evaluation problem: the test split reused the training data. A high score on that split could not establish generalization.",
    approach: "The preserved bottle experiment is presented beside its training history and a later, explicitly modelled water re-evaluation. The point is to inspect what the score actually measured before spending time on a more elaborate model or another training run.",
    boundary: "The later audit is not what I knew when I first submitted the task. Original screenshots, training curves and later measurements are labelled separately. The simulated water transform is not a physical underwater validation set.",
  },
  rupsha: {
    problem: "A small Ackermann rover must turn visual observations into a reachable drive request while keeping the computer's failures from becoming indefinite motion. Marker detection range, steering geometry and stale commands are different parts of that problem.",
    approach: "A Raspberry Pi handles the higher-level stack while an ESP32 board owns the vehicle loop. In Gazebo, the inspected tag experiment finds a 20 cm marker reliably at 4.5 m, intermittently at 6 m and not at 8 m. The source-backed diagrams separate the command path, hold behavior and marker-leg states.",
    boundary: "The physical chassis is being built. The tag ranges, range bias and stopping result are simulation measurements. Nothing here is labelled field validation; the next evidence has to come from the assembled vehicle outdoors.",
  },
  "mongol-tori": {
    problem: "After the permitted initial alignment with Q, the URC typing task required autonomous alignment to subsequent keys. Detecting a key, converting its image location into an arm-frame target and making a successful press are separate problems.",
    approach: "I implemented two-link inverse kinematics, a separate lightweight vision unit, custom OCR and image processing, a calibration GUI and simulation environment, and the URC 2025 dataset pipeline. My archived controller uses 15.5-inch and 14-inch links, servo offsets, independent angle limits and integer commands.",
    boundary: "The instrument compares ideal geometry with that archived command mapping, including its non-finite inner-hole cases. It shows nominal settled positions, not physical accuracy, contact or a competition replay. The team's global top-10 result is credited to the team and BRAC University's reporting.",
  },
  "e-bhapa": {
    problem: "The contest robot had one ultrasonic sensor and very little time. Its sketch mixed signed motor requests with an unsigned representation, while the chosen drive behavior did not create the turning difference the chassis needed.",
    approach: "The later audit separates the wiring and numeric faults from the behavioral rule. Re-enacting the original sketch beside corrected variants makes it possible to see why fixing a representation bug and designing useful obstacle avoidance are not the same task.",
    boundary: "The simulated runs are later reconstructions, not recordings from the 2024 contest. Bhapa supplied the name and better instincts; the cat did not supply the controller. The original robot and code remain part of the archive rather than being replaced by the corrected story.",
  },
  "four-leds": {
    problem: "Four LEDs tell a person which way to move a camera. That makes the person part of the feedback loop, with reaction delay and motion that continues after the indication changes.",
    approach: "The 2024 YOLOv5 and Arduino experiment is analysed as delayed feedback. The interactive comparison varies delay and dead band to show why a direction-only controller can hunt around the target instead of settling. Widening the acceptance region changes that behavior without making the person react faster.",
    boundary: "A nominal 250 ms reaction delay is a model parameter, not a measured response time for every user. The analysis explains a plausible mechanism; it does not turn the demonstration into a validated human-factors study.",
  },
  dristy: {
    problem: "A host that needs a target location should not have to consume a full camera stream merely to discover a few coordinates. On the K210, memory placement is also part of whether neural and classical vision can coexist.",
    approach: "Dristy performs vision on the camera and exposes compact serial responses through a host API. The work includes neural inference, colour and motion paths, and an explicit SRAM budget. A RETURN_TRACK packet is 22 bytes including its envelope; four coordinates alone are not the complete protocol.",
    boundary: "The LCD photographs show actual on-device output. A single detector label or displayed FPS is not an accuracy evaluation. The project is bench work and was paused in September 2026; neither the packet size nor the existence of an API establishes a deployed vehicle integration.",
  },
  den: {
    problem: "A development machine accumulates assumptions: display layout, shell behavior, editor configuration, scripts and the way a project is recovered after interruption. If those live only in memory, changing the machine becomes expensive.",
    approach: "The Den keeps the environment in version control. Arete is the laptop, Homie the home PC; the setup brings together Neovim, tmux, derivations, ROS documentation and radio tools. The 2022 editor screenshots and later desktop captures show the environment changing rather than presenting one final rice as timeless.",
    boundary: "A workstation is working infrastructure, not a robotics result. The illustrated night-shift scenes are artwork, not photographs of a physical laboratory. Configuration and harness repositories are linked only when public; credentials and machine-local state are not part of the exhibit.",
  },
  pareidolia: {
    problem: "A face detector drew convincing boxes, including boxes on things that were not faces. The useful question became what its early features actually test, not whether its name contains the word face.",
    approach: "The re-evaluation opens the Viola–Jones cascade at its first nine rectangle features, then examines rotation and false detections. The preserved 2023 webcam image supplies the connection between the original demo and the later explanation.",
    boundary: "The experiment concerns that cascade and those images. It does not measure all face detectors, and the false positives are not evidence that modern learned models use exactly the same mechanism. The later re-run is labelled as a re-run.",
  },
  "half-a-second": {
    problem: "An object tracker can report speed to two decimal places while still predicting badly. Image coordinates, delayed observations and a future horizon all matter more than the precision of the text overlay.",
    approach: "The archived 2024 YOLOv7 and CSRT experiment is measured against Kalman and least-squares predictors. The notebook follows prediction error as the horizon grows, keeping the original bottle footage beside the later comparison.",
    boundary: "Pixels per second are image-space motion, not a physical velocity without calibration. The chosen clip and reconstructed comparisons are not a general tracking benchmark. A forecast at half a second should be judged against where the target actually appears, not how smooth its overlay looks.",
  },
  "trust-issues": {
    problem: "A straight-line calibration can look clean until a small number of bad readings acquire enough leverage to move the fit. Ordinary least squares does not know which observations deserve suspicion.",
    approach: "The study compares least squares, Huber, Theil–Sen and RANSAC while adding corrupted readings. Showing both the fitted line and the contamination sweep makes the tradeoff visible: robustness depends on the assumptions about error, not simply choosing a more impressive estimator name.",
    boundary: "The corruption sweep is a controlled experiment, not a field sensor certification. Results depend on the generated readings and contamination model. The original 2023 fit and the later comparison belong to different stages of the work.",
  },
  tools: {
    problem: "Some projects begin with a small irritation rather than a vehicle: reaching the same sites repeatedly, understanding a login ceremony, or checking what a network observer can actually read.",
    approach: "The start page uses exact shortcut keys and a precedence-ordered parser. Passless explores WebAuthn without a reusable server-side password. The terminal chat makes the plaintext-to-encrypted transition inspectable in Wireshark. The cipher project goes further back into classical cryptography, including Hill-key recovery from known plaintext.",
    boundary: "These tools have different scopes. Passless remains coursework with unresolved credential-enrollment authorization, not a production account service. Classical ciphers are educational, not modern authenticated encryption. An unreadable packet capture alone is not a complete security argument; the linked notes examine the protocol boundaries.",
  },
};
