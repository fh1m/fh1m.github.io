import { writable } from 'svelte/store';

export const scrollProgress = writable(0); // 0..1 of the page
export const scrollY = writable(0);
export const bootDone = writable(false);
export const paletteOpen = writable(false);
export const reducedMotion = writable(false);
