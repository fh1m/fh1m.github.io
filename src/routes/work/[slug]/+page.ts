import { error } from '@sveltejs/kit';
import { WORK } from '$lib/data/work';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export const load: PageLoad = ({ params }) => {
  const item = WORK.find((w) => w.slug === params.slug);
  if (!item) throw error(404, `No work entry “${params.slug}”`);
  const idx = WORK.findIndex((w) => w.slug === params.slug);
  const next = WORK[(idx + 1) % WORK.length];
  return { item, next };
};
