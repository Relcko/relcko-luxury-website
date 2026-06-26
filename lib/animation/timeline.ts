/**
 * GSAP timeline helpers.
 */
import { gsap, registerGsap } from "./gsap";

/**
 * Creates a GSAP timeline with automatic GSAP registration.
 */
export function createTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
  registerGsap();
  return gsap.timeline(vars);
}

/**
 * Safely kills a timeline.
 */
export function killTimeline(timeline: gsap.core.Timeline | null): void {
  timeline?.kill();
}
