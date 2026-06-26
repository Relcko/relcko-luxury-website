/**
 * LenisProvider — global smooth scroll.
 * Driven by the GSAP ticker (no second RAF loop), syncs ScrollTrigger,
 * handles resize, respects reduced motion, and tears everything down on unmount.
 */
"use client";

import Lenis from "lenis";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animation/gsap";

export const LenisContext = createContext<Lenis | null>(null);

/**
 * Returns the Lenis instance from context.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Global smooth scroll provider.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Reduced motion: skip smooth scroll entirely, use native scrolling.
    if (typeof window === "undefined" || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return;
    }

    registerGsap();
    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    setLenis(instance);

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    // One animation loop for the whole app: GSAP's ticker drives Lenis.
    const update = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(update);

    const onResize = () => {
      instance.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(update);
      instance.off("scroll", onScroll);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
