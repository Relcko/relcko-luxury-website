/**
 * Easing presets. Cubic-bezier tuples for Framer Motion + GSAP ease strings.
 */
export type CubicBezier = [number, number, number, number];

export const easing = {
  out: [0.22, 1, 0.36, 1] as CubicBezier,
  inOut: [0.65, 0, 0.35, 1] as CubicBezier,
  in: [0.5, 0, 0.75, 0] as CubicBezier,
  expoOut: [0.16, 1, 0.3, 1] as CubicBezier,
} as const;

export type EasingName = keyof typeof easing;

/**
 * GSAP uses string eases; keep them mapped 1:1 to the Framer tuples above.
 */
export const gsapEase: Record<EasingName, string> = {
  out: "power3.out",
  inOut: "power2.inOut",
  in: "power2.in",
  expoOut: "expo.out",
} as const;
