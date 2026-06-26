/**
 * useIsomorphicLayoutEffect — avoids React's SSR useLayoutEffect warning.
 */
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
