/** Système d'animation : une seule courbe, trois durées. */
export const EASE = 'expo.out';

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
