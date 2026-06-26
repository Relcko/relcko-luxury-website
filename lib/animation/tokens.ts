/**
 * Animation design tokens. Centralized so durations, delays, distances, and stagger values stay
 * consistent across GSAP and Framer Motion.
 * NOTE: values only — no animation engine is imported or initialized here.
 */

/**
 * Animation durations in seconds.
 */
export const duration = {
  instant: 0.1,
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  slower: 0.9,
} as const;

/**
 * Animation delays in seconds.
 */
export const delay = {
  none: 0,
  xs: 0.05,
  sm: 0.1,
  md: 0.2,
  lg: 0.3,
} as const;

/**
 * Animation distances in pixels (for slide/fade effects).
 */
export const distance = {
  sm: 16,
  md: 32,
  lg: 64,
  xl: 96,
} as const;

/**
 * Stagger intervals in seconds (for lists/grids).
 */
export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

export type Duration = keyof typeof duration;
export type Delay = keyof typeof delay;
export type Distance = keyof typeof distance;
export type Stagger = keyof typeof stagger;
