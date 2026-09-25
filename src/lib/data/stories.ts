/**
 * Project stories — told as backstory, not cards. Each beat pairs real imagery
 * with the decision or moment behind it. Grounded in bracuduburi.com, the repos,
 * and AERD's public record.
 */

export interface Beat {
  img?: string;
  imgFit?: 'cover' | 'contain';
  label?: string;
  caption?: string;
  credit?: string;
  heading: string;
  body: string;
  pull?: string;
}

export interface Story {
  slug: string;
  eyebrow: string;
  title: string;
  standfirst: string;
  accent: string;
  beats: Beat[];
}

export const STORIES: Story[] = [
  {
    slug: 'duburi',
    eyebrow: 'underwater · 2023 — 2026',
    title: 'How Duburi learned to see',
    standfirst:
      'Bangladesh’s first autonomous underwater vehicle team, founded at BRAC University in 2017. I joined the vision subteam in 2023 and left it running the engineering. This is the machine that put the country on the RoboSub stage — four vehicle generations, one stubborn idea: an AUV that understands the pool before it moves.',
    accent: 'var(--sea-lit)',
    beats: [
      {
        img: '/media/duburi/auv42.png',
        imgFit: 'contain',
        label: 'duburi 4.2 · the current hull',
        caption: 'Duburi 4.2 — Jetson Orin + Pixhawk, eight thrusters, two cameras.',
        credit: 'bracuduburi.com',
        heading: 'A vehicle that has to be right on its own',
        body: 'Underwater there is no radio, no GPS, and no second chance to explain yourself. Everything Duburi does — find the gate, align, fire, surface — it decides from the inside, from a camera and an IMU and pressure. The whole design is downstream of that one fact.',
      },
      {
        img: '/media/duburi/v41.png',
        imgFit: 'contain',
        label: 'four generations',
        caption: 'From Duburi 1.0 to 4.5 — each hull a rebuild, not a patch.',
        credit: 'bracuduburi.com',
        heading: 'Rebuilt, not patched',
        body: 'The vehicle line runs from 1.0 to 4.5, plus a mini-AUV, Dubomini. Every generation re-opened the architecture instead of bolting onto the last — the same instinct Jim Keller has about chips. The mechanical, electrical and software subteams move together because the machine is one system.',
        pull: 'A vehicle that cannot measure its own motion must not claim it did not move.',
      },
      {
        img: '/media/duburi/grabber.png',
        imgFit: 'contain',
        label: 'manipulation',
        caption: 'The grabber, dropper and torpedo — the tasks that score points.',
        credit: 'bracuduburi.com',
        heading: 'The vision stack, rebuilt on CNNs',
        body: 'I rebuilt perception on modern CNN architecture with a custom dataset pipeline — Domain-Specific Pretraining and Source-Free Domain Adaptation so the model survives water it was never trained on — and deployed it to edge inference on the vehicle. Then I wrapped it in tooling so the team could train, deploy and debug without me in the loop.',
      },
      {
        img: '/media/duburi/winning.jpg',
        label: 'san diego',
        caption: 'RoboSub — direct-qualified for the 2025 semi-finals; a special Entrepreneurship award.',
        credit: 'bracuduburi.com',
        heading: 'The record',
        body: 'RoboSub 2023: 2nd overall plus the Ingenuity award. 2025: semi-finals and a special Entrepreneurship award, 8th of 58. 2026: two vehicles qualified for the semi-finals. Between them, three participation certificates from San Diego — and a country on the board.',
      },
    ],
  },
  {
    slug: 'aerd',
    eyebrow: 'air · 2023 — 2025',
    title: 'From rockets to water',
    standfirst:
      'Before the AUV there was a rocket. At Amateur Experimental Rocketry Dhaka I worked A&GNC, trajectory prediction and parachute — part of the team behind Bangladesh’s first successfully tested hybrid rocket engine. The question was always the same one water would later ask: how does a machine control itself when it cannot ask for help?',
    accent: 'var(--red-lit)',
    beats: [
      {
        img: '/media/aerd/cover.jpg',
        label: 'aerd · hybrid propulsion',
        caption: 'Amateur Experimental Rocketry Dhaka — founded 2022, sponsored by AIUB’s D2A2I.',
        credit: 'pcbway.com',
        heading: 'The hardest place to hide',
        body: 'I started where machines are hardest to hide: something that has to leave the ground. Guidance, navigation and control for experimental rocketry — a ROS 2 stack for data acquisition, and a VSLAM stack for GPS-denied flight where, like underwater, there is nothing overhead to trust.',
      },
      {
        img: '/media/aerd/dailystar-engine.png',
        label: 'a first for bangladesh',
        caption: 'The first hybrid rocket engine tested in Bangladesh — covered by The Daily Star.',
        credit: 'thedailystar.net',
        heading: 'A national first, on a bench',
        body: 'The engine fired successfully at AIUB’s research facility — the first hybrid rocket engine ever tested in the country, covered by The Daily Star, Dhaka Tribune and others. I also led V1 of an in-house flight computer for a monocopter UAV, and ran RocketPy trajectory prediction against real flight-test data.',
        pull: 'Physics gets the final vote.',
      },
      {
        img: '/media/aerd/mou-03.jpg',
        label: 'the institution',
        caption: 'The AIUB × AERD agreement — turning a student team into a research program.',
        credit: 'aiub.edu',
        heading: 'Controls that had to hold',
        body: 'At BRACU’s LASSET lab I built an in-house PID controller for a TVC gimbal and a 2-axis controller, and submitted the demo to the Research Excellence Awards Initiative for funding. The gimbal is where I learned that a controller is not clever — it is patient, many times a second.',
      },
    ],
  },
];
