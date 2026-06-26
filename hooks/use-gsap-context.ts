/**
 * useGsapContext — scoped GSAP context with automatic revert() cleanup.
 * The primary GSAP entry point for components.
 */
"use client";

import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";
import { gsap, registerGsap } from "@/lib/animation/gsap";

/**
 * Creates a scoped GSAP context that auto-cleans up on unmount.
 */
export function useGsapContext(
  setup: (self: gsap.Context) => void,
  scope: RefObject<Element | null>,
  deps: ReadonlyArray<unknown> = [],
): void {
  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const scopeEl = scope.current ?? undefined;
    const ctx = gsap.context(setup, scopeEl);
    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
