/**
 * GSAP + ScrollTrigger registration. SSR-safe and idempotent.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Idempotent, SSR-safe global registration.
 * Call once at app startup; safe to call multiple times.
 */
export function registerGsap(): typeof gsap {
  if (typeof window === "undefined" || registered) {
    return gsap;
  }
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  registered = true;
  return gsap;
}

/**
 * Creates a GSAP MatchMedia instance for responsive animations.
 */
export function createMatchMedia(
  scope?: Element | string | object,
): gsap.MatchMedia {
  registerGsap();
  return gsap.matchMedia(scope);
}

export { gsap, ScrollTrigger };
