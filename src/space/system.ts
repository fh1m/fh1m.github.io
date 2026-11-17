/**
 * The fh1m system: the map of the site. A star (me), four worlds (the four places a machine can
 * fail), their moons (projects), a belt of wrong ideas (lessons), a few stations (notes, CV,
 * time, the tea house) and, far out, the pale blue dot (home).
 * Every body here has a panel with the same id in Panels.astro.
 */
import { projects } from "../data/elements";
import { lessons } from "../data/lessons";

export type Kind = "star" | "planet" | "moon" | "station" | "rock" | "home" | "probe";
export type Surface = "gas" | "ocean" | "desert" | "silicon" | "rock" | "earth";
export interface Body {
  id: string; label: string; kind: Kind; parent?: string;
  orbit: number; size: number; speed: number; phase: number; tilt?: number;
  surface?: Surface; colours?: [string, string, string]; year: number; zone?: "air" | "water" | "earth" | "fire";
}

const firstYear = (y: string) => (/\d{4}/.test(y) ? +y.match(/\d{4}/)![0] : 2021);

export const PLANETS: Body[] = [
  { id: "air", label: "Air", kind: "planet", orbit: 34, size: 4.2, speed: 0.020, phase: 0.6, tilt: 0.18, surface: "gas", colours: ["#c99a5b", "#e9d2a6", "#8a5a33"], year: 2023, zone: "air" },
  { id: "water", label: "Water", kind: "planet", orbit: 54, size: 3.6, speed: 0.014, phase: 2.4, tilt: 0.3, surface: "ocean", colours: ["#14345c", "#2f6fa8", "#d9e6ef"], year: 2023, zone: "water" },
  { id: "earth", label: "Land", kind: "planet", orbit: 76, size: 3.0, speed: 0.010, phase: 4.1, tilt: 0.1, surface: "desert", colours: ["#7a4a2e", "#b98552", "#d9b98a"], year: 2024, zone: "earth" },
  { id: "fire", label: "Silicon", kind: "planet", orbit: 98, size: 3.3, speed: 0.008, phase: 5.4, tilt: 0.22, surface: "silicon", colours: ["#14161c", "#2a2f3a", "#e0864a"], year: 2021, zone: "fire" },
];

/** Projects orbit the world they belong to. */
export const MOONS: Body[] = projects.map((p, i, all) => {
  const sibs = all.filter((q) => q.element === p.element), k = sibs.indexOf(p);
  const planet = PLANETS.find((x) => x.id === p.element)!;
  return {
    id: p.slug, label: p.title, kind: "moon", parent: planet.id,
    orbit: planet.size + 2.6 + k * 1.9, size: 0.42 + ((i * 37) % 5) * 0.06, speed: 0.22 / (1 + k * 0.5), phase: k * 2.1 + i,
    surface: "rock", year: firstYear(p.years), zone: planet.zone,
  } as Body;
});

export const STATIONS: Body[] = [
  { id: "library", label: "The library (notes)", kind: "station", orbit: 21, size: 0.9, speed: 0.03, phase: 1.2, year: 2026 },
  { id: "cv", label: "CV", kind: "station", orbit: 23, size: 0.8, speed: 0.028, phase: 3.9, year: 2023 },
  { id: "timemachine", label: "The time machine", kind: "station", orbit: 115, size: 1.1, speed: 0.004, phase: 2.0, year: 2021 },
  { id: "teahouse", label: "The tea house", kind: "station", orbit: 66, size: 0.7, speed: 0.012, phase: 0.2, year: 2021 },
];

/** The belt between Water and Land: every wrong idea, filed. */
export const ROCKS: Body[] = lessons.map((l, i) => ({
  id: `lesson-${l.slug}`, label: l.title, kind: "rock", orbit: 64 + ((i * 7) % 5) - 2, size: 0.55, speed: 0.011, phase: (i / lessons.length) * Math.PI * 2,
  year: +l.date.slice(0, 4), zone: l.element as Body["zone"],
}));

export const HOME: Body = { id: "home", label: "Home: the pale blue dot", kind: "home", orbit: 150, size: 1.6, speed: 0.002, phase: 3.3, surface: "earth", year: 2002 };
export const PROBE: Body = { id: "voyager", label: "Voyager 1", kind: "probe", orbit: 175, size: 1, speed: 0.0015, phase: 4.2, year: 1977 };

export const ALL: Body[] = [...PLANETS, ...MOONS, ...STATIONS, ...ROCKS, HOME, PROBE];
export const byId = Object.fromEntries(ALL.map((b) => [b.id, b])) as Record<string, Body>;
