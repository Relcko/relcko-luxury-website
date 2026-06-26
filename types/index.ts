import type { ReactNode } from "react";

/** Shared prop contract for components that wrap children. */
export interface WithChildren {
  children: ReactNode;
}
