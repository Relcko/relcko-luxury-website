/**
 * Pure ScrollTrigger config factories — they return ScrollTrigger.Vars, they do NOT instantiate triggers.
 */

interface ScrollTriggerVars {
  trigger?: Element | string;
  start?: string;
  end?: string;
  toggleActions?: string;
  scrub?: boolean | number;
  pin?: boolean | string;
  [key: string]: unknown;
}

/**
 * Standard reveal trigger: fires when element enters 80% from top of viewport.
 */
export function revealTrigger(
  trigger: Element,
  overrides: Partial<ScrollTriggerVars> = {},
): ScrollTriggerVars {
  return {
    trigger,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
    ...overrides,
  };
}

/**
 * Scrub trigger: links animation progress to scroll position.
 */
export function scrubTrigger(
  trigger: Element,
  overrides: Partial<ScrollTriggerVars> = {},
): ScrollTriggerVars {
  return {
    trigger,
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    ...overrides,
  };
}

/**
 * Pin trigger: pins element during scroll.
 */
export function pinTrigger(
  trigger: Element,
  overrides: Partial<ScrollTriggerVars> = {},
): ScrollTriggerVars {
  return {
    trigger,
    start: "top top",
    end: "+=100%",
    pin: true,
    ...overrides,
  };
}
