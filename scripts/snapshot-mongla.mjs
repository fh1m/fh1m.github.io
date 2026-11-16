#!/usr/bin/env node
/**
 * Snapshot real measurements out of a local mongla_ws clone into src/data/mongla.json.
 * The site never invents a Mongla number: machine-readable files are copied as-is,
 * and the few tables that only exist in prose are copied with the file:line they came from.
 *
 *   MONGLA_WS=~/tmp/presence-work/mongla_ws node scripts/snapshot-mongla.mjs
 *
 * CI does not run this (the clone is local); the JSON is committed with its commit hash.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const WS = process.env.MONGLA_WS;
if (!WS) { console.error("set MONGLA_WS to a mongla_ws clone"); process.exit(1); }
const j = (p) => JSON.parse(readFileSync(join(WS, p), "utf8"));
const commit = execFileSync("git", ["-C", WS, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const committed = execFileSync("git", ["-C", WS, "log", "-1", "--format=%cI"], { encoding: "utf8" }).trim();
const commits = Number(execFileSync("git", ["-C", WS, "rev-list", "--count", "HEAD"], { encoding: "utf8" }).trim());
const first = execFileSync("git", ["-C", WS, "log", "--reverse", "--format=%cI", "--max-parents=0"], { encoding: "utf8" }).trim().split("\n")[0];

const robosub = j("docs/data/robosub.json");
const cal = (n) => { const c = j(`src/mongla_vision/config/calibration/${n}.json`); return { w: c.image_width, h: c.image_height, K: c.camera_matrix, dist: c.distortion_coefficients, holdoutRmsPx: c.holdout_rms_px, trainRmsPx: c.train_rms_px }; };
const still = j("src/mongla_localization/test/data/board_still_2026-09-15.json");
const col = (name) => still.columns.indexOf(name);
const imu = still.rows.map((r) => [r[col("t_s")], r[col("ax_sensor")], r[col("ay_sensor")], r[col("az_sensor")]]);
const water = j("docs/evidence/water.json");
const colour = j("docs/imgs/real/colour.json");
const stats = j("docs/stats.json");
const board = j("docs/data/board.json");
const flow = j(".claude/context/perception/flow_runs_2026-09-07.json");

const out = {
  provenance: { repo: "https://github.com/fh1m/mongla_ws", commit, committed, commits, firstCommit: first },
  robosub,
  calibration: { forward: cal("pi_forward_1280x720"), downward: cal("pi_downward_1280x720") },
  imuStill: { what: still.what, columns: ["t_s", "ax", "ay", "az"], rows: imu },
  water: { statuses: water.statuses, platforms: water.platforms, events: water.events.map(({ id, platform, status, date, place, observed }) => ({ id, platform, status, date, place, observed })) },
  colour,
  tests: { collected: stats.collected, passed: stats.passed, failed: stats.failed, skipped: stats.skipped, suites: stats.suites, testFiles: stats.code?.test_files },
  boardLink: { taken: board.taken, seconds: board.seconds, link: board.link, rates_hz: board.rates_hz },
  flowRuns: flow,
  // Prose-only tables, copied verbatim with their source line.
  prose: {
    frameAge: {
      src: ".claude/context/perception/camera-latency.md §1–2",
      queueAfterStall: [[32, 396.1], [33, 380.2], [34, 364.2], [35, 344.2]],
      stallMs: 400, fps: 60, lastBeforeStall: 31,
      policies: [
        { k: "A", name: "plain read() — what shipped", ageMs: 396.1, blockedMs: 0.0 },
        { k: "B", name: "drain the queue, take the last — the standard recipe", ageMs: 348.1, blockedMs: 0.1 },
        { k: "C", name: "drain, then wait for a new frame", ageMs: 12.0, blockedMs: 28.0 },
        { k: "D", name: "keep-up thread — what ships now", ageMs: 16.9, blockedMs: 0.0 },
      ],
    },
    continuity: {
      src: ".claude/context/perception/detection-continuity.md §1, §3",
      clip: "RoboSub 2025 gate approach, 319 detections",
      confPercentiles: { p10: 0.167, p50: 0.258, p90: 0.439, max: 0.640, fracAtOrAbove06: 0.006 },
      thresholdPresence: [[0.60, 0.0], [0.40, 13.9], [0.25, 17.0], [0.15, 45.1]],
      arms: [["detector only", 15.5, 6], ["tracker as shipped", 0.0, null], ["tracker clamped to detector floor", 45.1, 1]],
      tracksHzAfter: 51.95,
      modelPresence: [["bin", 100.0], ["octagon", 92.4], ["gate", 1.5]],
      trainingMap50: 0.995, trainingRuns: 25,
      blur: [["gate_back.mkv", 321, 170.8, 27.7], ["bin.mkv", 1180, 170.3, 35.4]],
      gaps: { n: 71, p50: 0.155, p90: 0.651, p99: 2.418, max: 4.0 },
      ladder: [["VISION_FRESH_ZERO_S", 0.20, 56.3], ["vision.coast_s", 0.80, 91.5], ["vision.lost_grace_s", 1.00, 91.5], ["kalman max_predict_s", 1.50, 94.4], ["track_buffer", 5.00, 100]],
    },
  },
};
writeFileSync(new URL("../src/data/mongla.json", import.meta.url), JSON.stringify(out) + "\n");
console.log(`mongla.json from ${commit.slice(0, 7)} (${commits} commits): ${imu.length} IMU rows, ${out.water.events.length} water events`);
