/**
 * Profile — single source of truth for person-level metadata.
 * Every string here is checked against the résumé (2026) and public sources.
 */

export const PROFILE = {
  name: 'Fahim Faisal',
  fullName: 'Muhammad Fahim Faisal',
  handle: 'fh1m',
  role: 'Autonomy & robotics engineer',
  roleLine: 'I build machines that perceive the world and act inside it.',
  location: 'Dhaka, Bangladesh',
  locationCode: 'BD',
  status: 'MACHINE STATUS: RUNNING',
  availability: 'Open to autonomy / robotics / ML roles',
  links: {
    github: 'https://github.com/fh1m',
    githubUser: 'fh1m',
    duburi: 'https://bracuduburi.com',
    email: 'mailto:fh1m.faisal.work@gmail.com',
    emailPlain: 'fh1m.faisal.work@gmail.com',
    resumeHandle: 'fh1m',
  },
  // The manifesto — verbatim from the brief. One line per entry.
  manifesto: [
    'I like machines that have to deal with reality.',
    'I like understanding what sits beneath the abstraction.',
    'I like taking expensive or opaque systems apart and rebuilding them from first principles.',
    'I like robotics because there is nowhere to hide: eventually the machine has to move.',
    'I like software because it lets an idea become behavior.',
    'I like hardware because physics gets the final vote.',
    'I like open source because knowledge should compound.',
    'I like difficult problems because they expose what I don’t understand.',
    'And I am still building.',
  ],
  // The one-liner the whole site is built around (his own, from mongla).
  thesis: 'Machines that have to work when nobody is watching.',
  intro:
    'Autonomy engineer working across underwater, aerial and ground robots — from the firmware on the board to the neural net that sees. I care about the seam between software and physics, and about numbers that come with the measurement that produced them.',
} as const;

export type Profile = typeof PROFILE;
