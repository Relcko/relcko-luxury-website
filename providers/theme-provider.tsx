"use client";

import { createContext, useContext } from "react";
import type { WithChildren } from "@/types";

type Theme = "dark";

interface ThemeContextValue {
  readonly theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark" });

/**
 * The brand is a fixed dark luxury palette (Spec §5), so the provider locks the
 * theme to "dark" and exposes it via context. A future multi-theme requirement
 * would only change this file.
 */
export function ThemeProvider({ children }: WithChildren) {
  const value: ThemeContextValue = { theme: "dark" };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
