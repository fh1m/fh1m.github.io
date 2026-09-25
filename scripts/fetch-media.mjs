/**
 * fetch-media.mjs — vendor REAL assets into static/media, with provenance.
 * Uses curl (respects the agent proxy + CA bundle). Failures are logged, not
 * fatal: a blocked asset simply isn't vendored, and the site falls back to a
 * cited link-out card. Never fabricates an image.
 *
 * Run:  node scripts/fetch-media.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MEDIA = resolve(ROOT, 'static/media');
const CA = '/root/.ccr/ca-bundle.crt';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const credits = [];
let ok = 0;
let fail = 0;

function curl(url, extraArgs = []) {
  const args = [
    '-sSL', '--fail', '--max-time', '45', '-A', UA,
    ...(existsSync(CA) ? ['--cacert', CA] : []),
    ...extraArgs, url,
  ];
  return execFileSync('curl', args, { maxBuffer: 64 * 1024 * 1024 });
}

function download(url, outRel, sourceLabel) {
  const out = resolve(MEDIA, outRel);
  mkdirSync(dirname(out), { recursive: true });
  try {
    const buf = curl(url, ['-o', out]);
    const size = statSync(out).size;
    if (size < 500) throw new Error(`too small (${size}b)`);
    credits.push({ file: `media/${outRel}`, source: sourceLabel || url, url });
    ok++;
    console.log(`  ok   media/${outRel}  (${(size / 1024).toFixed(0)} KB)`);
    return true;
  } catch (e) {
    fail++;
    console.log(`  FAIL media/${outRel}  <- ${url}  (${e.message.split('\n')[0]})`);
    return false;
  }
}

function ogImage(pageUrl) {
  try {
    const html = curl(pageUrl).toString('utf8');
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) return m[1].replace(/&amp;/g, '&');
    }
  } catch (e) {
    console.log(`  (og parse failed for ${pageUrl}: ${e.message.split('\n')[0]})`);
  }
  return null;
}

console.log('\n── avatar ──');
download('https://avatars.githubusercontent.com/u/132839265?v=4', 'avatar.jpg', 'github.com/fh1m');

console.log('\n── mongla_ws real images ──');
const RAW = 'https://raw.githubusercontent.com/fh1m/mongla_ws/main/docs/imgs';
const mongla = [
  ['sim/sim-pool-overview.webp', 'mongla/sim-pool-overview.webp'],
  ['sim/sim-gate-course.webp', 'mongla/sim-gate-course.webp'],
  ['sim/sim-bins-torpedo.webp', 'mongla/sim-bins-torpedo.webp'],
  ['sim/sim-slalom.webp', 'mongla/sim-slalom.webp'],
  ['sim/sim-bluerov-gate.webp', 'mongla/sim-bluerov-gate.webp'],
  ['banners/machine.png', 'mongla/machine.png'],
  ['banners/fundamentals.png', 'mongla/fundamentals.png'],
  ['banners/ledger.png', 'mongla/ledger.png'],
  ['mongla-banner.png', 'mongla/banner.png'],
  ['readme/wire-frame.webp', 'mongla/wire-frame.webp'],
  ['readme/pid-lab.webp', 'mongla/pid-lab.webp'],
  ['readme/flow-lab.webp', 'mongla/flow-lab.webp'],
  ['readme/brain-run.webp', 'mongla/brain-run.webp'],
];
for (const [p, out] of mongla) download(`${RAW}/${p}`, out, 'fh1m/mongla_ws');

console.log('\n── repo OG cards ──');
const repos = [
  'mongla_ws', 'duburi-codebase_RND', 'duburi-sim_ws', 'passless', 'cipher-project',
  'secure-terminal-p2p-chat', 'Track_and_Predict', 'Arduino-Vision', 'calib_challenge_fh1m',
  'Duburi', 'Detect-color-signs', 'E_Bhapa', 'Start-Page', 'Dristy', 'Duburi-AI-Machine-Vision',
];
for (const r of repos) {
  download(`https://opengraph.githubassets.com/1/fh1m/${r}`, `repos/${r}.png`, `github.com/fh1m/${r}`);
}

console.log('\n── press OG thumbnails ──');
const press = [
  ['tbs-robosub-2026', 'https://www.tbsnews.net/economy/corporates/bracu-duburi-qualifies-two-underwater-vehicles-robosub-2026-semi-finals-1467436'],
  ['tbs-robosub-2025', 'https://www.tbsnews.net/graduates/bracu-duburi-qualifies-directly-robosub-2025-semi-final-1202131'],
  ['bracu-entrepreneurship-2025', 'https://www.bracu.ac.bd/news/bracu-duburi-wins-special-entrepreneurship-award-robosub-2025'],
  ['bracuexpress-robotics', 'https://bracuexpress.com/bracu-duburis-innovation-elevates-bangladesh-in-robotics/'],
  ['bracu-mongoltori-urc', 'https://www.bracu.ac.bd/news/brac-universitys-mongol-tori-team-ranks-among-global-top-10-university-rover-challenge-2025'],
  ['bracu-mongoltori-ict', 'https://www.bracu.ac.bd/news/bracu-mongol-tori-first-runner-bangladesh-ict-and-innovation-awards-2025'],
  ['dailystar-hybrid-rocket', 'https://www.thedailystar.net/campus/news/first-hybrid-rocket-engine-bangladesh-tested-successfully-3418016'],
  ['dhakatribune-weather-balloon', 'https://www.dhakatribune.com/bangladesh/336802/aiub-aerd-launch-first-weather-balloon'],
];
for (const [slug, url] of press) {
  const img = ogImage(url);
  if (img) {
    const ext = img.split('?')[0].match(/\.(jpg|jpeg|png|webp|avif)$/i)?.[1] || 'jpg';
    download(img, `press/${slug}.${ext.toLowerCase()}`, url);
  } else {
    fail++;
    console.log(`  FAIL press/${slug}  (no og:image found)`);
  }
}

console.log('\n── publications ──');
{
  const img = ogImage('https://openreview.net/forum?id=qiFAySNAsW');
  if (img) download(img, 'pub/color-is-class-evidence.png', 'openreview.net');
  else console.log('  (openreview og not found — will use link-out card)');
}

// Write CREDITS.md
const md = [
  '# Media credits',
  '',
  'Every third-party asset vendored into this site, with its source. Repo/sim',
  'images are the author’s own (fh1m/mongla_ws). GitHub repo cards are generated',
  'by GitHub. Press thumbnails are the publications’ own OpenGraph images, used to',
  'credit and link their coverage of the teams the author worked on.',
  '',
  '| File | Source |',
  '| --- | --- |',
  ...credits.map((c) => `| \`${c.file}\` | ${c.source} |`),
  '',
].join('\n');
writeFileSync(resolve(MEDIA, 'CREDITS.md'), md);

console.log(`\n── done: ${ok} ok, ${fail} failed. CREDITS.md written (${credits.length} entries). ──\n`);
