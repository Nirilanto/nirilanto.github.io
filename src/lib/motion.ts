/** Système d'animation (Motion) : une seule courbe, trois durées. */
import type { Easing } from 'motion';

/** Équivalent de « expo.out », identique à la courbe CSS --ease-expo. */
export const EASE: Easing = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
