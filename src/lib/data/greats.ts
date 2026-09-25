/**
 * The greats — the people whose thinking shaped how Fahim builds. Each carries
 * a real (CC-licensed) portrait where available, the WORK that mattered, the
 * quote, and one honest line on what it changed in his own engineering.
 * Portraits: static/media/greats/<slug>.(jpg|png) — null → monogram fallback.
 */

export interface Great {
  slug: string;
  name: string;
  role: string;
  years: string;
  img: string | null;
  ext?: string;
  quote: string;
  work: string; // the thing they made
  why: string; // what it changed for fahim
  accent: string;
  url?: string;
}

export const GREATS: Great[] = [
  {
    slug: 'feynman',
    name: 'Richard Feynman',
    role: 'physicist',
    years: '1918–1988',
    img: '/media/greats/feynman.jpg',
    quote: 'You must not fool yourself — and you are the easiest person to fool.',
    work: 'Path integrals, QED, the Challenger O-ring demo — physics you could see.',
    why: 'The whole “measure, then ship” discipline is his. A number without the measurement that made it is a way of fooling yourself.',
    accent: 'var(--red-lit)',
    url: 'https://calteches.library.caltech.edu/51/2/CargoCult.htm',
  },
  {
    slug: 'hotz',
    name: 'George Hotz',
    role: 'geohot · tinygrad, comma.ai',
    years: 'b. 1989',
    img: '/media/greats/hotz.jpg',
    quote: 'Complex things eventually collapse under their own weight.',
    work: 'tinygrad — “the RISC of the ML stack” — and openpilot, self-driving on a phone.',
    why: 'The reason the stack stays small. Every new layer has to justify itself against a delete. I attempted his comma.ai calibration challenge for the same reason.',
    accent: 'var(--sea-lit)',
    url: 'https://www.latent.space/p/geohot',
  },
  {
    slug: 'carmack',
    name: 'John Carmack',
    role: 'id Software · Oculus',
    years: 'b. 1970',
    img: '/media/greats/carmack.jpg',
    quote: 'The speed of light sucks.',
    work: 'Doom, Quake, the fast inverse square root — and VR latency mitigation.',
    why: 'Why the vision pipeline is a mailbox, not a queue. An old correct answer is a wrong answer; latency is a first-class bug.',
    accent: 'var(--amber-lit)',
    url: 'https://danluu.com/latency-mitigation/',
  },
  {
    slug: 'karpathy',
    name: 'Andrej Karpathy',
    role: 'Tesla Autopilot · OpenAI',
    years: 'b. 1986',
    img: '/media/greats/karpathy.png',
    ext: 'png',
    quote: 'Software 2.0 — the program compiled from data.',
    work: 'The Software 2.0 essay, micrograd, nanoGPT, cs231n — teaching a generation to see nets clearly.',
    why: 'The dataset is the program. My detection work lives or dies on the pipeline that makes the data, not the model that eats it.',
    accent: 'var(--state-water)',
    url: 'https://karpathy.medium.com/software-2-0-a64152b37c35',
  },
  {
    slug: 'keller',
    name: 'Jim Keller',
    role: 'chip architect · AMD, Tesla, Tenstorrent',
    years: 'b. 1958',
    img: '/media/greats/keller.jpg',
    quote: 'Every few years, design it again rather than patch it.',
    work: 'Zen, Apple A4/A5, the Athlon — the cores under a decade of computing.',
    why: 'Why Mongla is a rebuild, not a patch of the last vehicle. Sometimes the honest move is to start the architecture over.',
    accent: 'var(--state-soft)',
  },
  {
    slug: 'lattner',
    name: 'Chris Lattner',
    role: 'LLVM · Swift · Mojo',
    years: 'b. 1978',
    img: '/media/greats/lattner.jpg',
    quote: 'Work backwards from the speed of light of hardware.',
    work: 'LLVM, Clang, Swift, MLIR, Mojo — the compilers everything else stands on.',
    why: 'Know the hardware’s real ceiling, then write toward it. The board runs 500 Hz because that is what the silicon allows, measured.',
    accent: 'var(--sea-lit)',
  },
  {
    slug: 'graham',
    name: 'Paul Graham',
    role: 'programmer · Y Combinator',
    years: 'b. 1964',
    img: '/media/greats/graham.jpg',
    quote: 'Live in the future, then build what’s missing.',
    work: 'Viaweb, Arc/Bel, On Lisp, and the essays that started a thousand startups.',
    why: 'Build the thing you wish existed. Mongla exists because I wanted an AUV stack that refused to lie, and none did.',
    accent: 'var(--amber-lit)',
    url: 'https://paulgraham.com/startupideas.html',
  },
  {
    slug: 'urban',
    name: 'Tim Urban',
    role: 'Wait But Why',
    years: 'b. 1981',
    img: '/media/greats/urban.jpg',
    quote: 'The chef reasons from first principles; the cook follows a recipe.',
    work: 'Wait But Why — hard ideas drawn in stick figures until they’re obvious.',
    why: 'Decide whether you’re cooking or being a chef, on purpose. On the hard parts of the vehicle, I try to be the chef.',
    accent: 'var(--red-lit)',
  },
  {
    slug: 'west',
    name: 'Kanye West',
    role: 'artist · designer',
    years: 'b. 1977',
    img: '/media/greats/west.jpg',
    quote: 'The world can be saved through design — everything needs to be architected.',
    work: 'The College Dropout, 808s, Yeezy — form and feeling engineered on purpose.',
    why: 'Nothing gets to be an accident. The console on the front page is designed, because the machine underneath it is.',
    accent: 'var(--state-water)',
  },
  {
    slug: 'rubin',
    name: 'Rick Rubin',
    role: 'producer',
    years: 'b. 1963',
    img: '/media/greats/rubin.jpg',
    quote: 'Keep removing until it hurts — that’s usually where the soul of the thing is.',
    work: 'Def Jam, Johnny Cash’s American Recordings, The Creative Act — subtraction as a craft.',
    why: 'Subtraction is a feature. The best commits I write are the ones that delete more than they add.',
    accent: 'var(--amber-lit)',
  },
];
