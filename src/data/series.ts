/**
 * The notes, as series: each one a sequence that builds from first principles, Azeria-style,
 * with a persistent series navigator. Order matters inside a series; `part` in each note.
 */
import type { Domain } from "./story";

export interface Series { id: string; title: string; bn: string; domain: Domain; blurb: string }

export const series: Series[] = [
  { id: "machines", title: "The machines", bn: "যন্ত্র", domain: "workshop", blurb: "The long versions of the river's chapters: what each machine was, who built what, and how it went." },
  { id: "water", title: "Water, from first principles", bn: "জল", domain: "water", blurb: "Why there's no radio down there, what water does to colour and to angles, and how a camera becomes a speedometer." },
  { id: "seeing", title: "Seeing", bn: "দৃষ্টি", domain: "sight", blurb: "What detectors actually look at, how to make them run on small chips, and how to tell when they're lying." },
  { id: "time", title: "Time", bn: "সময়", domain: "time", blurb: "Every number a robot uses is about a moment that has already gone. Frame age, gaps, delay and the people in the loop." },
  { id: "truth", title: "Measuring honestly", bn: "সত্য", domain: "ground", blurb: "Liars in the data, canaries, retractions, and the cheapest experiment in robotics: leaving the robot alone." },
  { id: "build", title: "Building things that run", bn: "নির্মাণ", domain: "air", blurb: "Reachability, boundaries, process trees, and small tools: the difference between code that exists and code that runs." },
];

export const seriesById = Object.fromEntries(series.map((s) => [s.id, s])) as Record<string, Series>;
