/**
 * useMatchMedia — responsive GSAP via gsap.matchMedia.
 * Auto-reverts per breakpoint and supports reduced-motion conditions.
 */
"use client";

import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";
import { gsap, registerGsap } from "@/lib/animation/gsap";

/**
 * Hook for responsive GSAP animations using matchMedia.
 */
export function useMatchMedia(
  conditions: Record<string, string>,
  setup: (context: gsap.Context) => void,
  scope?: RefObject<Element | null>,
  deps: ReadonlyArray<unknown> = [],
): void {
  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const mm = gsap.matchMedia(scope ?? undefined);
    mm.add(conditions, setup);
    return () => {
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
