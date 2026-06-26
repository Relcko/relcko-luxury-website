import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type SurfaceElevation = "flat" | "raised" | "floating";

export interface SurfaceProps {
  as?: ElementType;
  elevation?: SurfaceElevation;
  bordered?: boolean;
  className?: string;
  children: ReactNode;
}

const elevationStyles: Record<SurfaceElevation, string> = {
  flat: "bg-bg-elevated",
  raised: "bg-bg-elevated shadow-md",
  floating: "bg-bg-surface shadow-lg",
};

/** Base elevated panel. Card and future overlays build on this. */
export function Surface({
  as: Tag = "div",
  elevation = "flat",
  bordered = true,
  className,
  children,
}: SurfaceProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg",
        bordered && "border border-border",
        elevationStyles[elevation],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
