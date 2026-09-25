/** The lab — real screenshots from the author's own tooling, grouped so all of
 *  it is shown without crowding. Each is a genuine frame from the running
 *  mongla / duburi / Meghdut stack, its simulator, or the pool. */

export type LabCat = 'perception' | 'simulation' | 'telemetry' | 'tooling' | 'water' | 'sonar' | 'field';

export interface Shot {
  src: string;
  title: string;
  cat: LabCat;
  caption: string;
  fit?: 'cover' | 'contain';
}

const L = '/media/lab/';

export const SHOTS: Shot[] = [
  { src: L + 'mission-control.png', title: 'mission control', cat: 'perception', caption: 'duburi // mission control — the pixel-native gate-alignment HUD. detection, error, depth, all on one screen.', fit: 'contain' },
  { src: L + 'dualcam-fusion.png', title: 'dual-camera fusion', cat: 'perception', caption: 'front gate + down bin, PID and pure-CV side by side, fused into one heading (wf=0.36, wd=0.49).', fit: 'contain' },
  { src: L + 'detect-flare.png', title: 'flare · 0.95', cat: 'perception', caption: 'a flare, caught at 0.95 confidence in murky water — the kind of frame the whole pipeline exists for.', fit: 'contain' },
  { src: L + 'detect-keyboard.png', title: 'keys · Mongol-Tori', cat: 'perception', caption: 'keyboard and individual keys detected for the rover’s autonomous typing task at URC.', fit: 'contain' },
  { src: L + 'meghdut-tui-1.png', title: 'Meghdut · gossip lane', cat: 'telemetry', caption: 'the flight TUI — MAVLink RX/TX, orientation, and a safety panel that never lets you forget the props.', fit: 'contain' },
  { src: L + 'meghdut-tui-2.png', title: 'Meghdut · link', cat: 'telemetry', caption: 'live bytes — keep the link sacred. every message the flight controller sends, and every command back.', fit: 'contain' },
  { src: L + 'latency-verdict.png', title: 'sensor is the limit', cat: 'telemetry', caption: 'photon-to-command latency, both cameras. authority at p99 = 1.000 — there is no software delay left to remove.', fit: 'contain' },
  { src: L + 'gil-audit.png', title: 'the GIL audit', cat: 'telemetry', caption: 'every stage ranked by how long it freezes Python. nothing in the hot path holds the lock.', fit: 'contain' },
  { src: L + 'chip-efficiency.png', title: 'zero wasted decodes', cat: 'telemetry', caption: 'the Hailo-8 never spends its scarce compute on a superseded frame — and says so every ten seconds.', fit: 'contain' },
  { src: L + 'sim-gate-a.png', title: 'sim · the gate', cat: 'simulation', caption: 'Gazebo + ArduSub SITL — the gate course, front and bottom cameras live.', fit: 'contain' },
  { src: L + 'sim-gate-b.png', title: 'sim · approach', cat: 'simulation', caption: 'gate approach in the pool world — the same MAVLink surface the vehicle expects, no water required.', fit: 'contain' },
  { src: L + 'sim-targets.png', title: 'sim · bins & mat', cat: 'simulation', caption: 'the bins, drums and target mat — the tasks that score points, rehearsed in sim.', fit: 'contain' },
  { src: L + 'sim-rover-terrain.png', title: 'sim · terrain', cat: 'simulation', caption: 'a rover on dune terrain beside the live mission-control HUD.', fit: 'contain' },
  { src: L + 'ue-operator.png', title: 'the operator lab', cat: 'tooling', caption: 'unauthorized engineering — the web operator: dual cameras, teleop, dataset recording, turbidity.', fit: 'contain' },
  { src: L + 'ue-operator-form.png', title: 'dataset recording', cat: 'tooling', caption: 'record a run — front, bottom, fx, frames, labels — the pipeline that makes the data the model eats.', fit: 'contain' },
  { src: L + 'report-run.png', title: 'the ledger', cat: 'tooling', caption: 'a scored run, tabulated — every number with the conditions that produced it.', fit: 'contain' },
  { src: L + 'config-table-1.png', title: 'self-configuring', cat: 'tooling', caption: 'subsystems that configure themselves from a deck-editable file — a capability is only real if the path to it is.', fit: 'contain' },
  { src: L + 'config-table-2.png', title: 'every sensor a role', cat: 'tooling', caption: 'loop closure and the sensor roster — declared once, not scattered across launch files.', fit: 'contain' },
  { src: L + 'pool-gate.png', title: 'the real thing', cat: 'water', caption: 'a gate in the pool — where sim stops mattering and the water gets a vote.', fit: 'cover' },
  { src: L + 'pool-sauvc.png', title: 'the target zone', cat: 'water', caption: 'the competition pool — drums and the target mat, exactly what the vehicle has to find.', fit: 'cover' },
  { src: L + 'sonar-ping360.png', title: 'Ping360 sonar', cat: 'sonar', caption: 'a scanning sonar view and its intensity heatmap — seeing where cameras cannot.', fit: 'contain' },
  { src: L + 'vehicle-estop.png', title: 'hands on the machine', cat: 'field', caption: 'MONGLA emergency stop, mid-run — the moment the abort path proves it works.', fit: 'cover' },
];

export const LAB_CATS: { key: LabCat; label: string }[] = [
  { key: 'perception', label: 'perception' },
  { key: 'telemetry', label: 'telemetry' },
  { key: 'simulation', label: 'simulation' },
  { key: 'tooling', label: 'tooling' },
  { key: 'water', label: 'in water' },
  { key: 'sonar', label: 'sonar' },
  { key: 'field', label: 'field' },
];
