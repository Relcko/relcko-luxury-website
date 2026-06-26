import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
export type GridGap = "none" | "sm" | "md" | "lg";

export interface GridProps {
  as?: ElementType;
  cols?: GridCols;
  gap?: GridGap;
  className?: string;
  children: ReactNode;
}

/** Responsive column counts: collapse on mobile, expand at sm/md/lg. */
const colStyles: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
};

const gapStyles: Record<GridGap, string> = {
  none: "gap-0",
  sm: "gap-4",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
};

export function Grid({
  as: Tag = "div",
  cols = 12,
  gap = "md",
  className,
  children,
}: GridProps) {
  return (
    <Tag className={cn("grid", colStyles[cols], gapStyles[gap], className)}>
      {children}
    </Tag>
  );
}
