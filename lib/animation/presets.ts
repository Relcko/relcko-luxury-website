/**
 * Framer Motion variant presets, all built from tokens + easing (no magic values).
 */
import type { Variants } from "framer-motion";
import { duration, distance } from "./tokens";
import { easing } from "./easing";

export type SlideDirection = "up" | "down" | "left" | "right";

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: easing.out },
  },
};

export function slideVariants(
  direction: SlideDirection = "up",
  dist: number = distance.md,
): Variants {
  const axis: "x" | "y" =
    direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "down" || direction === "right" ? 1 : -1;

  return {
    hidden: { opacity: 0, [axis]: sign * dist },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: duration.base, ease: easing.out },
    },
  };
}

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: easing.out },
  },
};

export const revealVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: duration.slow, ease: easing.expoOut },
  },
};

export function staggerContainer(
  staggerChildren: number = 0.08,
  delayChildren: number = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/**
 * Default child variant for use inside <Stagger>.
 */
export const childVariants: Variants = {
  hidden: { opacity: 0, y: distance.sm },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easing.out },
  },
};
