/**
 * Shoulders and beliefs. Quotes are short and attributed; where a line is a paraphrase
 * of an idea rather than a verbatim quote, `paraphrase: true` says so. No portraits (rights unclear).
 * Beliefs are fh1m's own lines, each pointing at the work or record it came from.
 */

export interface Voice { name: string; line: string; source: string; href?: string; paraphrase?: boolean; changed: string }

/** People whose ideas show up as decisions in the work. `changed` is the decision. */
export const voices: Voice[] = [
  { name: "Richard Feynman", line: "The first principle is that you must not fool yourself, and you are the easiest person to fool.", source: "Cargo Cult Science, 1974", href: "https://calteches.library.caltech.edu/51/2/CargoCult.htm", changed: "Every number on this site carries the measurement that produced it, and the retractions stay in the ledger." },
  { name: "Claude Shannon", line: "I just wondered how things were put together.", source: "interview, 1989", changed: "A value a sensor can't stand behind isn't a small error, it's not information. Absence renders as --, never 0.0." },
  { name: "John Carmack", line: "The speed of light sucks.", source: "on latency", href: "https://danluu.com/latency-mitigation/", changed: "A keep-up thread that throws frames away: 396 ms of staleness down to 16.9 ms." },
  { name: "George Hotz", line: "Complex things eventually collapse under their own weight.", source: "Latent Space interview", href: "https://www.latent.space/p/geohot", paraphrase: true, changed: "Delete before adding. The best change is often a negative diff." },
  { name: "Andrej Karpathy", line: "Software 2.0: the program is compiled from data.", source: "Software 2.0, 2017", href: "https://karpathy.medium.com/software-2-0-a64152b37c35", paraphrase: true, changed: "A detector is a component you shape with data, not an oracle; the 2025 gate model failed on blur its data never showed it." },
  { name: "Jim Keller", line: "Every few years, design it again rather than patch it.", source: "on designing from scratch", paraphrase: true, changed: "Mongla is a rebuild, not a patch of the stack before it. So was this site." },
  { name: "Chris Lattner", line: "Work backwards from the speed of light of the hardware.", source: "on Mojo", paraphrase: true, changed: "Optimise until the sensor is the limit: authority 1.000 at the 99th percentile on both cameras." },
  { name: "Paul Graham", line: "Live in the future, then build what's missing.", source: "How to Get Startup Ideas, 2012", href: "https://paulgraham.com/startupideas.html", changed: "Tools built because the shop didn't sell them: a start page, a WebAuthn login, a K210 firmware." },
  { name: "Tim Urban", line: "The chef reasons from first principles; the cook follows the recipe.", source: "The Cook and the Chef, 2015", href: "https://waitbutwhy.com/2015/11/the-cook-and-the-chef-musks-secret-sauce.html", paraphrase: true, changed: "Underwater-vision advice gets measured on our own footage before it's believed. Most of it didn't survive." },
];

/** Engineering beliefs, in fh1m's own words, each with the record it came from. */
export const beliefs: { line: string; from: string }[] = [
  { line: "A capability is only real if the path to it is.", from: "mongla_ws commit 28833da" },
  { line: "A number with no bar cannot be wrong, so it never gets checked. It just gets quoted, and eventually shipped.", from: "measured-bars.md" },
  { line: "Score through the shipped code path, or do not score. A harness that re-implements the pipeline measures the harness.", from: "mongla_ws commit 4e802df" },
  { line: "A test that has never failed against a real defect is not a guard.", from: "mongla_ws commit 74d7d42" },
  { line: "Refuse loudly. A verb that reports success while the vehicle does nothing is the failure that ends competition runs.", from: "Mongla design rules" },
  { line: "A parameter that is read, logged and then ignored is worse than an unsupported one: every log says it worked.", from: "mongla_ws commit 190d7a8" },
  { line: "One truth, two copies is the bug. When two places state the same constant, make one read the other.", from: "Mongla design rules" },
  { line: "Treating \"I could not measure\" as \"it did not move\" is the same mistake in every disguise.", from: "measured-bars.md §13" },
  { line: "Freshness over throughput. An old correct answer is a wrong answer for a moving vehicle.", from: "camera-latency.md" },
  { line: "When you can't pick a threshold, run both and let the consumer choose.", from: "the bumblebee doctrine" },
];
