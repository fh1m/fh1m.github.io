/**
 * Things Bunnu says when you poke her ship. Every one is from the record: commits, code folders,
 * the Duburi reports, the press. `src` names where it came from.
 */
export interface Anecdote { line: string; src: string }

export const ANECDOTES: Anecdote[] = [
  { line: "November 2025: he rewrote one vision-tracking PID thirteen times in three days. Version 1 was 578 lines; version 13 was 2,550. The robot was not impressed until about version 9.", src: "local code folder, pid_v1.py to pid_v13.py" },
  { line: "He tried to make a DINO feature matcher recognise things underwater twelve times between August and November 2025. The folder is called dino_idea. It stayed an idea, and taught him why learned detectors won.", src: "local code folder, dino/dino_idea_v1 to v12" },
  { line: "One commit fixed seven bugs at once: derivative kick, a yaw speed that was ignored, teleop that flooded stop commands, a sleep that blocked its own callback, two yaw sources, and integral windup. It was a Sunday.", src: "duburi-rnd, 8 Mar 2026" },
  { line: "The Duburi vision node went from 5 to 25 frames a second in one afternoon, mostly by not doing work twice.", src: "duburi-rnd, 'vision: Phase 1-3 perf (5→25 fps)'" },
  { line: "The vehicle kept arming and disarming by itself. BlueOS was forwarding heartbeats from things that weren't the vehicle, and the stack believed all of them.", src: "duburi-rnd, 29 Mar 2026" },
  { line: "His name is in the credits of the Duburi team website, which has won RoboSub's website design award two years running. Then he went back to the pool.", src: "bracuduburi.com meta author; RoboSub website awards 2024 and 2025" },
  { line: "At RoboSub 2026 Duburi fielded two vehicles that talk to each other underwater. The small one waits for a release signal from the big one, and if the signal never comes, it gets on with its own job anyway.", src: "BRACU Duburi TDR 2026" },
  { line: "The first time the heading lock held in the pool, someone filmed it. The file is still called headlock_1st_time.mp4.", src: "local clips" },
  { line: "A camera on the K210 used to send whole pictures. Now it sends 22 bytes: what it saw and where. The flight controller stopped waiting.", src: "fh1m/Dristy" },
  { line: "Mongla has thousands of passing tests and zero dives. He keeps the zero where everyone can see it.", src: "fh1m/mongla_ws" },
  { line: "In 2025 magnetic interference kept dragging Duburi's heading off. The 2026 fix fuses the compass with the DVL, so no single bad reading wins.", src: "BRACU Duburi TDR 2026" },
  { line: "He learned rockets before submarines. A bug in a rocket is a debris field; a bug in a submarine is a very quiet afternoon.", src: "AERD, then Duburi" },
];

/** Short, rarely-shown lines for when Bunnu is idle. Small nods; never the point. */
export const IDLE: string[] = [
  "Sharing tea with a fascinating stranger is one of life's true delights. The tea house is past the belt.",
  "There are no accidents. There are only commits you haven't read yet.",
  "Wubba lubba dub dub is not a valid commit message. He checked.",
  "On a scale of one to ten, how would you rate your latency?",
  "Become one with the data. Then delete half of it.",
  "Air, water, land, fire. Long ago the four worlds lived together in harmony. Then he started committing to all of them in the same week.",
];
