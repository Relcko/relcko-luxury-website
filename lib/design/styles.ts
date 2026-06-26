/**
 * Shared, token-driven class fragments reused across primitives so focus and
 * transition behavior never diverge (no duplicated styles).
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

export const transitionBase =
  "transition-colors duration-200 ease-out motion-reduce:transition-none";
