/**
 * Principles console.
 *  - VOICES: the people whose thinking shaped the work (the "shoulders" from
 *    the mongla site's dive panel). Quotes verbatim, attributed, with source.
 *  - PRINCIPLES: hard-won lines from Fahim's own commit history and the
 *    doctrines his repos run on — the engineering register of the work.
 */

export interface Voice {
  name: string;
  depth: number; // metres, for the dive scale
  quote: string;
  idea?: string;
  source: string;
  url?: string;
}

export const VOICES: Voice[] = [
  {
    name: 'Richard Feynman',
    depth: 12,
    quote: 'You must not fool yourself — and you are the easiest person to fool.',
    source: 'Cargo Cult Science, 1974',
    url: 'https://calteches.library.caltech.edu/51/2/CargoCult.htm',
  },
  {
    name: 'George Hotz',
    depth: 20,
    quote: 'Complex things eventually collapse under their own weight.',
    idea: 'tinygrad as “the RISC of the machine-learning stack.”',
    source: 'Latent Space interview',
    url: 'https://www.latent.space/p/geohot',
  },
  {
    name: 'John Carmack',
    depth: 28,
    quote: 'The speed of light sucks.',
    source: 'Latency Mitigation Strategies',
    url: 'https://danluu.com/latency-mitigation/',
  },
  {
    name: 'Andrej Karpathy',
    depth: 36,
    quote: 'Software 2.0 — the program compiled from data.',
    source: 'Software 2.0',
    url: 'https://karpathy.medium.com/software-2-0-a64152b37c35',
  },
  {
    name: 'Jim Keller',
    depth: 44,
    quote: 'Every few years, design it again rather than patch it.',
    source: 'On designing from scratch',
  },
  {
    name: 'Chris Lattner',
    depth: 52,
    quote: 'Work backwards from the speed of light of hardware.',
    source: 'Deep dive on Mojo',
  },
  {
    name: 'Paul Graham',
    depth: 60,
    quote: 'Live in the future, then build what’s missing.',
    source: 'How to Get Startup Ideas',
    url: 'https://paulgraham.com/startupideas.html',
  },
  {
    name: 'Tim Urban',
    depth: 68,
    quote: 'The chef reasons from first principles; the cook works off a recipe.',
    source: 'The Cook and the Chef',
  },
  {
    name: 'Kanye West',
    depth: 76,
    quote: 'The world can be saved through design, and everything needs to actually be architected.',
    source: 'Harvard GSD, 2013',
  },
  {
    name: 'Rick Rubin',
    depth: 84,
    quote: 'Inspiration comes first. You come next. The audience comes last.',
    idea: 'Keep removing until it hurts — that is usually where the soul of the thing is.',
    source: 'The Creative Act',
  },
];

export interface Principle {
  text: string;
  source: string; // commit hash or doc
  theme: string;
}

export const PRINCIPLES: Principle[] = [
  {
    text: 'The best change is often a negative diff. LOC is debt, not output.',
    source: 'geohot-guidelines',
    theme: 'Simplicity',
  },
  {
    text: 'You can always make your software do more. The magic is making it do more without adding complexity — because complex things collapse under their own weight.',
    source: 'geohot-guidelines',
    theme: 'Simplicity',
  },
  {
    text: 'A number with no bar cannot be wrong, so it never gets checked — it just gets quoted, and eventually shipped.',
    source: 'measured-bars.md',
    theme: 'Measure',
  },
  {
    text: 'Score through the shipped code path, or do not score. A harness that re-implements the pipeline measures the harness.',
    source: 'commit 4e802df',
    theme: 'Measure',
  },
  {
    text: 'A test that has never failed against a real defect is not a guard.',
    source: 'commit 74d7d42',
    theme: 'Measure',
  },
  {
    text: 'Refuse loudly. A verb that reports success while the vehicle does nothing is the failure mode that ends competition runs.',
    source: 'CLAUDE.md §9',
    theme: 'Honesty',
  },
  {
    text: 'The recurring defect is a plausible number standing in for an absent measurement.',
    source: 'CLAUDE.md §8',
    theme: 'Honesty',
  },
  {
    text: 'A parameter that is read, logged and then ignored is worse than an unsupported one: every log says it worked.',
    source: 'commit 190d7a8',
    theme: 'Honesty',
  },
  {
    text: 'The honest outcome of a measurement is often that the guess was good.',
    source: 'commit 8687387',
    theme: 'Honesty',
  },
  {
    text: 'A capability is only real if the path to it is.',
    source: 'commit 28833da',
    theme: 'Reachability',
  },
  {
    text: 'Ask what actually runs before admiring what exists.',
    source: 'bumblebee-doctrine',
    theme: 'Reachability',
  },
  {
    text: 'The machine is not magic — look at the actual value; don’t reason about what it “should” be.',
    source: 'geohot-guidelines',
    theme: 'First principles',
  },
  {
    text: 'A missing low-level feature is a pull request, not a host workaround. The answer is never a workaround on the host.',
    source: 'the-shift.md',
    theme: 'First principles',
  },
  {
    text: 'A rung that names the wrong prop confidently is worse than one that reports LOST — because LOST is honest.',
    source: 'commit a7b5028',
    theme: 'Honesty',
  },
  {
    text: 'One truth, two copies is the bug. When two places state the same constant, make one read the other.',
    source: 'CLAUDE.md §9',
    theme: 'Simplicity',
  },
  {
    text: 'Redundancy beats optimisation. When you cannot pick a threshold, run both and let the consumer choose.',
    source: 'bumblebee-doctrine',
    theme: 'Robustness',
  },
];

// The author's own line — the register the whole thing aims for.
export const AUTHOR_LINE = {
  text: 'I left on principle, and I am building this on hope rather than optimism. Hope is the decision to keep working on the better version of a thing while the current version is still broken.',
  source: 'Muhammad Fahim Faisal · Dhaka · 2026',
};
