/**
 * Astro 5 content collections — `src/content.config.ts` (project root).
 *
 * Three collections, all loaded with the Astro 5 `glob` loader:
 *   - `machines`  → src/content/machines/*.md   (10 entries, todo 6)
 *   - `notebook`  → src/content/notebook/*.md   (8 entries, todo 7)
 *   - `log`       → src/content/log/*.md        (6 entries, todo 7)
 *
 * Date formats are load-bearing for sorting (plan todo 5):
 *   dateStart / dateEnd / notebook.date = ISO `YYYY-MM`
 *   log.year = `YYYY`
 *
 * Schemas mirror the plan's content model exactly. Every field carries a
 * `.describe()` so `astro check` diagnostics are readable.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const machines = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/machines' }),
  schema: z.object({
    name: z.string().describe('Display name of the machine / project'),
    category: z
      .enum(['underwater', 'air', 'perception', 'compute', 'systems'])
      .describe('Taxonomy category (brief #48)'),
    status: z
      .enum(['running', 'prototype', 'failed', 'retired', 'ongoing', 'closed'])
      .describe('Lifecycle status of the machine'),
    yearLabel: z.string().describe('Short human label for the active years, e.g. "2023—present"'),
    dateStart: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'dateStart must be ISO YYYY-MM')
      .describe('ISO YYYY-MM start date — used for sorting'),
    dateEnd: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'dateEnd must be ISO YYYY-MM')
      .optional()
      .describe('ISO YYYY-MM end date — omit while the machine is still active'),
    summary: z.string().describe('One-line summary shown on index rows'),
    tags: z.array(z.string()).describe('Topic tags'),
    repoLink: z.string().optional().describe('Public source repository URL'),
    metrics: z
      .array(
        z.object({
          label: z.string().describe('Metric label, e.g. "WORLD RANK"'),
          value: z.string().describe('Metric value, e.g. "2ND (2023)"'),
        }),
      )
      .optional()
      .describe('Optional label/value metric strip for the detail page'),
    draft: z.boolean().describe('True hides the entry from production builds'),
  }),
});

const notebook = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notebook' }),
  schema: z.object({
    title: z.string().describe('Essay title'),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'date must be ISO YYYY-MM')
      .describe('ISO YYYY-MM publish date — used for sorting'),
    tags: z.array(z.string()).describe('Topic tags'),
    status: z
      .enum(['open', 'closed', 'ongoing'])
      .describe('Writing status of the entry'),
  }),
});

const log = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/log' }),
  schema: z.object({
    title: z.string().describe('Phase title'),
    phaseLabel: z.string().describe('Short mono label for the phase, e.g. "PHASE 01"'),
    year: z
      .string()
      .regex(/^\d{4}$/, 'year must be four digits (YYYY)')
      .describe('Four-digit year — used for chronological sorting'),
    dateLabel: z.string().optional().describe('Optional human date-range label'),
    phase: z
      .enum([
        'Student',
        'Builder',
        'Vision Engineer',
        'Technical Lead',
        'Systems Engineer',
        'Independent Builder',
      ])
      .describe('One of the six mission-log phases (brief #48 timeline)'),
  }),
});

export const collections = { machines, notebook, log };