/**
 * useLenis — re-exports the Lenis accessor.
 * NOTE: Provider created in providers/lenis-provider.tsx
 */
"use client";

import { useContext } from "react";
import { LenisContext } from "@/providers/lenis-provider";

/**
 * Returns the Lenis instance from context.
 */
export function useLenis() {
  return useContext(LenisContext);
}
