/**
 * Animation design tokens (Spec §13). Centralized so durations/easings stay
 * consistent once GSAP/Framer Motion are wired in Phase 02.
 * NOTE: values only — no animation engine is imported or initialized here.
 */
export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const delay = {
  none: 0,
  short: 0.08,
  stagger: 0.12,
} as const;
