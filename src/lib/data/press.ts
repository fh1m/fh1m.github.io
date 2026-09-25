/**
 * Press — real coverage of the teams Fahim worked on. Every link is from the
 * résumé and resolves. Wording is press-verified: we state what the article
 * confirms, not unverified rankings. `image` points at a vendored OG thumbnail
 * (static/media/press/<slug>.jpg) with source credited in CREDITS.md.
 */

export interface Press {
  slug: string;
  source: string;
  title: string;
  url: string;
  year: string;
  team: 'duburi' | 'mongoltori' | 'aerd';
  image?: string; // vendored thumbnail path, if the fetch succeeded
}

export const PRESS: Press[] = [
  {
    slug: 'tbs-robosub-2026',
    source: 'The Business Standard',
    title: 'BRACU Duburi qualifies two underwater vehicles for RoboSub 2026 semi-finals',
    url: 'https://www.tbsnews.net/economy/corporates/bracu-duburi-qualifies-two-underwater-vehicles-robosub-2026-semi-finals-1467436',
    year: '2026',
    team: 'duburi',
    image: '/media/press/tbs-robosub-2026.png',
  },
  {
    slug: 'tbs-robosub-2025',
    source: 'The Business Standard',
    title: 'BRACU Duburi qualifies directly for RoboSub 2025 semi-final',
    url: 'https://www.tbsnews.net/graduates/bracu-duburi-qualifies-directly-robosub-2025-semi-final-1202131',
    year: '2025',
    team: 'duburi',
    image: '/media/press/tbs-robosub-2025.jpg',
  },
  {
    slug: 'bracu-entrepreneurship-2025',
    source: 'BRAC University',
    title: 'BRACU Duburi wins special ‘Entrepreneurship’ award at RoboSub 2025',
    url: 'https://www.bracu.ac.bd/news/bracu-duburi-wins-special-entrepreneurship-award-robosub-2025',
    year: '2025',
    team: 'duburi',
  },
  {
    slug: 'bracuexpress-robotics',
    source: 'BRACU Express',
    title: 'BRACU Duburi’s innovation elevates Bangladesh in robotics',
    url: 'https://bracuexpress.com/bracu-duburis-innovation-elevates-bangladesh-in-robotics/',
    year: '2025',
    team: 'duburi',
    image: '/media/press/bracuexpress-robotics.png',
  },
  {
    slug: 'bracu-mongoltori-urc',
    source: 'BRAC University',
    title: 'Mongol-Tori ranks among global top 10 at University Rover Challenge 2025',
    url: 'https://www.bracu.ac.bd/news/brac-universitys-mongol-tori-team-ranks-among-global-top-10-university-rover-challenge-2025',
    year: '2025',
    team: 'mongoltori',
  },
  {
    slug: 'bracu-mongoltori-ict',
    source: 'BRAC University',
    title: 'Mongol-Tori first runner-up at Bangladesh ICT & Innovation Awards 2025',
    url: 'https://www.bracu.ac.bd/news/bracu-mongol-tori-first-runner-bangladesh-ict-and-innovation-awards-2025',
    year: '2025',
    team: 'mongoltori',
  },
  {
    slug: 'dailystar-hybrid-rocket',
    source: 'The Daily Star',
    title: 'First hybrid rocket engine in Bangladesh tested successfully',
    url: 'https://www.thedailystar.net/campus/news/first-hybrid-rocket-engine-bangladesh-tested-successfully-3418016',
    year: '2024',
    team: 'aerd',
    image: '/media/press/dailystar-hybrid-rocket.png',
  },
  {
    slug: 'dhakatribune-weather-balloon',
    source: 'Dhaka Tribune',
    title: 'AIUB, AERD launch first weather balloon',
    url: 'https://www.dhakatribune.com/bangladesh/336802/aiub-aerd-launch-first-weather-balloon',
    year: '2023',
    team: 'aerd',
  },
];

// Press-verified competition timeline — stated the way the sources support it.
export const COMPETITIONS = [
  {
    year: '2023',
    event: 'RoboSub 2023',
    team: 'BRACU Duburi',
    line: 'Competed at RoboSub, San Diego — one of the few teams from Bangladesh on the world stage.',
  },
  {
    year: '2025',
    event: 'RoboSub 2025',
    team: 'BRACU Duburi',
    line: 'Direct-qualified for the semi-finals; won the special “Entrepreneurship” award.',
  },
  {
    year: '2025',
    event: 'University Rover Challenge 2025',
    team: 'BRACU Mongol-Tori',
    line: 'Ranked among the global top 10.',
  },
  {
    year: '2026',
    event: 'RoboSub 2026',
    team: 'BRACU Duburi',
    line: 'Qualified two underwater vehicles for the semi-finals.',
  },
];
