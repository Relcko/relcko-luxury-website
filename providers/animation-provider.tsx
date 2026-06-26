/**
 * AnimationProvider — top-level composition.
 * Registers GSAP globally, applies Framer's reducedMotion, and mounts Lenis.
 */
"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { registerGsap } from "@/lib/animation/gsap";
import { LenisProvider } from "./lenis-provider";

/**
 * Global animation provider composition.
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  useIsomorphicLayoutEffect(() => {
    registerGsap();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>{children}</LenisProvider>
    </MotionConfig>
  );
}
