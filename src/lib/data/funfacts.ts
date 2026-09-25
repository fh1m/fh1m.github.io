/** Fun facts — all real, all from the engineering. Used as cinematic
 *  intermission cards. Every one is a measured or documented fact. */

export interface FunFact {
  stat: string;
  line: string;
  tag: string;
}

export const FUNFACTS: FunFact[] = [
  {
    stat: '958 / 958',
    line: 'ESC frames read exactly 0 with nothing attached — so a message count can never prove a thruster is alive.',
    tag: 'trust nothing',
  },
  {
    stat: '46.7°',
    line: 'the camera’s real field of view in water — not the datasheet’s 63.8° in air. Measured, because water bends light.',
    tag: 'measure it',
  },
  {
    stat: '95%',
    line: 'of gate detections were destroyed by “image enhancement.” Tested in 17 configs across 4 props and 3 venues. It never once helped.',
    tag: 'delete the feature',
  },
  {
    stat: '16.9 ms',
    line: 'how stale a frame is with a mailbox that keeps only the newest. A queue served them 396 ms old — steering by the past.',
    tag: 'freshness > throughput',
  },
  {
    stat: '701 FPS',
    line: 'XFeat feature-matching on the Hailo-8 — a number that appears to be published nowhere else. 23× the CPU.',
    tag: 'a first',
  },
  {
    stat: '1.09 cm',
    line: 'worst error turning a downward camera into a velocity sensor — the whole job of a DVL, replaced by geometry and a tape measure.',
    tag: 'cheap sensing',
  },
  {
    stat: '1,038',
    line: 'commits on the mongla stack in about five months. Sole author. Roughly six and a half a day.',
    tag: 'still building',
  },
  {
    stat: '71',
    line: 'real detection gaps the lock ladder was sized against — not a guessed timeout. The vehicle coasts through exactly what the water throws.',
    tag: 'sized on reality',
  },
  {
    stat: 'in water: never',
    line: 'the honest status badge on a stack with 3,756 passing tests. Nothing on this platform has touched water yet, and the site says so.',
    tag: 'refuse loudly',
  },
];
