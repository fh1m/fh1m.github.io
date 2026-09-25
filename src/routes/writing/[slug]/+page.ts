import { error } from '@sveltejs/kit';
import { WRITING } from '$lib/data/writing';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
  return WRITING.map((e) => ({ slug: e.slug }));
}

export const load: PageLoad = ({ params }) => {
  const essay = WRITING.find((e) => e.slug === params.slug);
  if (!essay) throw error(404, `No essay “${params.slug}”`);
  const idx = WRITING.findIndex((e) => e.slug === params.slug);
  const next = WRITING[(idx + 1) % WRITING.length];
  return { essay, next };
};
