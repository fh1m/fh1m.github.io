/**
 * Stats — real, sourced numbers. Every value carries where it came from.
 * The story here is ACTIVITY, not popularity (top repo has 2 stars).
 * `--` (null) renders as a dash, never a fabricated 0.
 */

export interface Stat {
  key: string;
  value: string;
  label: string;
  note: string;
  accent?: 'signal' | 'red' | 'amber' | 'water';
}

export const HEADLINE_STATS: Stat[] = [
  {
    key: 'commits',
    value: '1,038',
    label: 'commits · one repo · 5 months',
    note: 'mongla_ws, 2026-04 → 2026-09, sole author — ~6.5/day sustained',
    accent: 'red',
  },
  {
    key: 'tests',
    value: '3,756',
    label: 'tests passing',
    note: 'mongla_ws test suite — the discipline: no number without a measurement',
    accent: 'water',
  },
  {
    key: 'loop',
    value: '500 Hz',
    label: 'control loop',
    note: 'custom flight-controller firmware, ESP32 core — sensors, control, DShot',
    accent: 'signal',
  },
  {
    key: 'repos',
    value: '24',
    label: 'public repositories',
    note: 'github.com/fh1m — Python-led, from rockets to underwater to rovers',
    accent: 'amber',
  },
];

// Real language mix across public repos (GitHub primary-language field).
// Honest: no repo has C++ or Rust as its PUBLIC primary language.
export const LANGUAGES = [
  { name: 'Python', count: 13, color: 'var(--sea-lit)' },
  { name: 'C', count: 2, color: 'var(--red-lit)' },
  { name: 'Jupyter', count: 2, color: 'var(--amber)' },
  { name: 'JavaScript', count: 1, color: 'var(--state-water)' },
  { name: 'Astro', count: 1, color: 'var(--state-soft)' },
  { name: 'Vim Script', count: 1, color: 'var(--ok)' },
  { name: 'Other', count: 4, color: 'var(--ink-3)' },
];

export const LANGUAGE_NOTE =
  'Primary language of 24 public repos. C++ / Rust live inside repos as non-primary languages (firmware, embedded) — not shown here, because this chart only counts what GitHub marks as a repo’s top language.';

// mongla_ws real per-day commit cadence, summarised into buckets for the
// contribution heatmap. Two verified bursts: Sep 3–6 (~100) and Sep 23–24 (~100).
export const CONTRIB_NOTE =
  'Real commit cadence on mongla_ws (Apr–Sep 2026). 1,038 commits, sole author. Two documented bursts: ~100 commits in Sep 3–6, and ~100 in Sep 23–24.';

export const CADENCE = {
  totalCommits: 1038,
  spanDays: 159,
  perDay: 6.5,
  spanLabel: '2026-04-18 → 2026-09-24',
};
