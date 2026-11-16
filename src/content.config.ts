import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Notes: long-form field notes, project re-grades and essays from the Mongla notebook. */
const notes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    date: z.string(),               // YYYY-MM or YYYY-MM-DD
    series: z.enum(["machines", "water", "seeing", "time", "truth", "build"]),
    part: z.number().int().positive(),
    kind: z.enum(["project", "essay", "regrade", "story"]),
    repo: z.string().optional(),
    sources: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    heroPlot: z.boolean().default(false), // a white-background chart: invert it onto black
  }),
});

export const collections = { notes };
