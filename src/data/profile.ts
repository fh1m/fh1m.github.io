/**
 * Profile data module — single source of truth for person-level metadata.
 * Consumed by layouts, pages, and the JSON-LD Person schema (todo 15).
 *
 * All copy is drafted from the embedded content specification in
 * `.omo/plans/fahim-personal-site.md`. Anything uncertain carries a
 * `[VERIFY]` comment and is covered by the README content-review checklist.
 */

export interface ProfileLinks {
  github: string;
  duburi: string;
  email: string;
}

export interface Profile {
  name: string;
  handle: string;
  roleLine: string;
  location: string;
  links: ProfileLinks;
  statusLine: string;
  manifestoLines: string[];
  obsessions: string[];
  nextUp: string[];
}

export const PROFILE: Profile = {
  name: 'Fahim Faisal',
  handle: 'fh1m',
  roleLine: 'builds machines that perceive the world and act inside it',
  location: 'Dhaka, Bangladesh',
  links: {
    github: 'https://github.com/fh1m',
    duburi: 'https://bracu-duburi.com',
    // Cross-checked against the resume header (the current authoritative
    // source, 2026) — updated from fahim.2002.faisal@gmail.com. The old
    // address is not wrong, it's just not the one the resume leads with.
    email: 'mailto:fh1m.faisal.work@gmail.com',
  },
  statusLine: 'MACHINE STATUS: RUNNING',
  // Verbatim manifesto block, brief #46 (plan line 63) — one line per array entry.
  manifestoLines: [
    'I like machines that have to deal with reality.',
    'I like understanding what sits beneath the abstraction.',
    'I like taking expensive or opaque systems apart conceptually and rebuilding them from first principles.',
    'I like robotics because there is nowhere to hide: eventually the machine has to move.',
    'I like software because it lets an idea become behavior.',
    'I like hardware because physics gets the final vote.',
    'I like open source because knowledge should compound.',
    'I like difficult problems because they expose what I don\u2019t understand.',
    'And I am still building.',
  ],
  // [CURRENTLY RUNNING] list, drafted from the Now-page spec (plan todo 13).
  obsessions: [
    'low-cost autonomous systems',
    'integrated vision/control boards and embedded architecture',
    'visual navigation without expensive sensing',
    'AUV robustness on Duburi — the same mission, every time',
    'the Unauthorized Engineering collective',
    'camera pipelines and frame timing',
  ],
  // [NEXT:] block, drafted from the Now-page spec (plan todo 13, brief #39).
  nextUp: [
    'world-class autonomy engineering',
    'embodied intelligence — perceive, reason, act',
    'integrated robotic computers',
    'open-source autonomous systems',
    'systems with automotive- and aerospace-grade reliability',
    'built from Bangladesh',
  ],
};