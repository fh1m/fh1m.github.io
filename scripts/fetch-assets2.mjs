/** Round-2 asset vendor: real Duburi / Dristy / secure-chat / AERD imagery.
 *  All URLs verified fetchable by research. Failures logged, not fatal. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync, appendFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MEDIA = resolve(ROOT, 'static/media');
const CA = '/root/.ccr/ca-bundle.crt';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
let ok = 0, fail = 0;
const credits = [];

function dl(url, out, source) {
  const p = resolve(MEDIA, out);
  mkdirSync(dirname(p), { recursive: true });
  try {
    execFileSync('curl', ['-sSL', '--fail', '--max-time', '45', '-A', UA, ...(existsSync(CA) ? ['--cacert', CA] : []), '-o', p, url], { maxBuffer: 64 * 1024 * 1024 });
    if (statSync(p).size < 600) throw new Error('too small');
    ok++; credits.push(`| \`media/${out}\` | ${source} |`);
    console.log(`  ok   ${out}`);
  } catch (e) { fail++; console.log(`  FAIL ${out}  (${String(e.message).split('\n')[0]})`); }
}

const IK = 'https://ik.imagekit.io/bracuduburiauv/assets';
const DUB = 'https://bracuduburi.com/assets/img';
const assets = [
  // Duburi — vehicle renders & hero
  [`${DUB}/auv42.png`, 'duburi/auv42.png', 'bracuduburi.com'],
  [`${IK}/2025/auv/whole%20auv.png`, 'duburi/whole-auv.png', 'bracuduburi.com'],
  [`${IK}/img/logo.png`, 'duburi/logo.png', 'bracuduburi.com'],
  [`${IK}/img/v1.jpg`, 'duburi/v1.jpg', 'bracuduburi.com'],
  [`${IK}/img/v2.jpg`, 'duburi/v2.jpg', 'bracuduburi.com'],
  [`${IK}/img/v3_1.png`, 'duburi/v3.png', 'bracuduburi.com'],
  [`${IK}/img/v4.png`, 'duburi/v4.png', 'bracuduburi.com'],
  [`${IK}/img/v41.png`, 'duburi/v41.png', 'bracuduburi.com'],
  [`${IK}/img/duburi_test.jpg`, 'duburi/pool-test.jpg', 'bracuduburi.com'],
  // Duburi — team
  [`${IK}/img/team_2018.jpg`, 'duburi/team-2018.jpg', 'bracuduburi.com'],
  [`${IK}/img/team_2019.jpg`, 'duburi/team-2019.jpg', 'bracuduburi.com'],
  [`${IK}/img/team_2022_2.jpg`, 'duburi/team-2022.jpg', 'bracuduburi.com'],
  [`${IK}/img/team_2023_2.png`, 'duburi/team-2023.png', 'bracuduburi.com'],
  // Duburi — competition / winning
  [`${IK}/img/winning_moment_2.jpg`, 'duburi/winning.jpg', 'bracuduburi.com'],
  [`${IK}/2025/robosub/1.png`, 'duburi/robosub25-1.png', 'bracuduburi.com'],
  [`${IK}/2025/robosub/2.png`, 'duburi/robosub25-2.png', 'bracuduburi.com'],
  [`${IK}/2025/robosub/3.png`, 'duburi/robosub25-3.png', 'bracuduburi.com'],
  // Duburi — subsystems
  [`${IK}/img/v41_grabber.png`, 'duburi/grabber.png', 'bracuduburi.com'],
  [`${IK}/img/v41_torpedo.png`, 'duburi/torpedo.png', 'bracuduburi.com'],
  [`${IK}/img/v41_dropper2.png`, 'duburi/dropper.png', 'bracuduburi.com'],
  [`${IK}/img/pcb.png`, 'duburi/pcb.png', 'bracuduburi.com'],
  [`${IK}/img/software.png`, 'duburi/software.png', 'bracuduburi.com'],
  [`${IK}/img/v41_cfd.jpg`, 'duburi/cfd.jpg', 'bracuduburi.com'],
  // Dristy — K210 vision firmware
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/brand/hero.png', 'dristy/hero.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/diagrams/pipeline.png', 'dristy/pipeline.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/diagrams/k210-budget.png', 'dristy/k210-budget.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/live/02_camera.png', 'dristy/camera.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/live/03_object.png', 'dristy/object.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/live/07_colour.png', 'dristy/colour.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/live/08_motion.png', 'dristy/motion.png', 'github.com/fh1m/Dristy'],
  ['https://raw.githubusercontent.com/fh1m/Dristy/main/docs/media/live/05_qr.png', 'dristy/qr.png', 'github.com/fh1m/Dristy'],
  // secure-terminal-p2p-chat
  ['https://raw.githubusercontent.com/fh1m/secure-terminal-p2p-chat/main/assets/chatview.png', 'securechat/chatview.png', 'github.com/fh1m/secure-terminal-p2p-chat'],
  ['https://raw.githubusercontent.com/fh1m/secure-terminal-p2p-chat/main/assets/chatview_sec.png', 'securechat/chatview-sec.png', 'github.com/fh1m/secure-terminal-p2p-chat'],
  ['https://raw.githubusercontent.com/fh1m/secure-terminal-p2p-chat/main/assets/Packet-Clear.png', 'securechat/packet-clear.png', 'github.com/fh1m/secure-terminal-p2p-chat'],
  ['https://raw.githubusercontent.com/fh1m/secure-terminal-p2p-chat/main/assets/Sec-Packet.png', 'securechat/packet-sec.png', 'github.com/fh1m/secure-terminal-p2p-chat'],
  ['https://raw.githubusercontent.com/fh1m/secure-terminal-p2p-chat/main/assets/Wireshark_clear.png', 'securechat/wireshark-clear.png', 'github.com/fh1m/secure-terminal-p2p-chat'],
  ['https://raw.githubusercontent.com/fh1m/secure-terminal-p2p-chat/main/assets/wireshark_sec.png', 'securechat/wireshark-sec.png', 'github.com/fh1m/secure-terminal-p2p-chat'],
  // AERD
  ['https://pcbwayfile.s3.us-west-2.amazonaws.com/project/24/03/07/1336379584004.jpg', 'aerd/cover.jpg', 'pcbway.com — AERD'],
  ['https://www.aiub.edu/Files/Uploads/original/aerdaiubmou03.jpg', 'aerd/mou-03.jpg', 'aiub.edu'],
  ['https://www.aiub.edu/Files/Uploads/aerdaiubmou01.jpg', 'aerd/mou-01.jpg', 'aiub.edu'],
  ['https://www.aiub.edu/Files/Uploads/aerdaiubmou02.jpg', 'aerd/mou-02.jpg', 'aiub.edu'],
  ['https://www.thedailystar.net/sites/default/files/styles/social_share/public/images/2023/09/13/facebook_thumbnail_9_2.png', 'aerd/dailystar-engine.png', 'thedailystar.net'],
  // comma.ai calib challenge illustration
  ['https://user-images.githubusercontent.com/6804392/116619874-e78a8180-a8f5-11eb-93e3-c9c852726db8.png', 'calib/challenge.png', 'commaai/calib_challenge'],
];

for (const [u, o, s] of assets) dl(u, o, s);

appendFileSync(resolve(MEDIA, 'CREDITS.md'), '\n' + credits.join('\n') + '\n');
console.log(`\ndone: ${ok} ok, ${fail} failed\n`);
