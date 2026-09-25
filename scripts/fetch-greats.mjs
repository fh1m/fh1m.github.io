/** Fetch freely-licensed portraits of the "greats" via Wikipedia REST summary
 *  (lead image = upload.wikimedia.org, CC/PD). Attribution: Wikimedia Commons. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MEDIA = resolve(import.meta.dirname, '../static/media');
const CA = '/root/.ccr/ca-bundle.crt';
const UA = 'fh1m-site/1.0 (portfolio; contact fh1m.faisal.work@gmail.com)';
mkdirSync(resolve(MEDIA, 'greats'), { recursive: true });

const people = [
  ['feynman', 'Richard_Feynman'],
  ['hotz', 'George_Hotz'],
  ['carmack', 'John_Carmack'],
  ['karpathy', 'Andrej_Karpathy'],
  ['keller', 'Jim_Keller_(engineer)'],
  ['lattner', 'Chris_Lattner'],
  ['graham', 'Paul_Graham_(programmer)'],
  ['urban', 'Tim_Urban'],
  ['west', 'Kanye_West'],
  ['rubin', 'Rick_Rubin'],
];

function curl(url, extra = []) {
  return execFileSync('curl', ['-sSL', '--fail', '--max-time', '30', '-A', UA, ...(existsSync(CA) ? ['--cacert', CA] : []), ...extra, url], { maxBuffer: 32 * 1024 * 1024 });
}

let ok = 0, fail = 0;
const credits = [];
for (const [slug, title] of people) {
  try {
    const j = JSON.parse(curl(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`).toString());
    const src = j.originalimage?.source || j.thumbnail?.source;
    if (!src) throw new Error('no lead image');
    const ext = src.split('?')[0].match(/\.(jpg|jpeg|png|webp)$/i)?.[1]?.toLowerCase() || 'jpg';
    const out = resolve(MEDIA, `greats/${slug}.${ext}`);
    curl(src, ['-o', out]);
    if (statSync(out).size < 800) throw new Error('too small');
    ok++; credits.push(`| \`media/greats/${slug}.${ext}\` | Wikimedia Commons (${title.replace(/_/g, ' ')}) |`);
    console.log(`  ok   greats/${slug}.${ext}`);
  } catch (e) { fail++; console.log(`  FAIL ${slug}  (${String(e.message).split('\n')[0]})`); }
}
appendFileSync(resolve(MEDIA, 'CREDITS.md'), '\n' + credits.join('\n') + '\n');
console.log(`\ndone: ${ok} ok, ${fail} failed\n`);
