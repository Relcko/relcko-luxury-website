import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/container";
import type { ContainerSize } from "@/components/ui/container";

export type SectionSpacing = "sm" | "md" | "lg";

export interface SectionProps {
  as?: ElementType;
  spacing?: SectionSpacing;
  containerSize?: ContainerSize;
  /** When true, render children full-bleed with no inner Container. */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
}

const spacingStyles: Record<SectionSpacing, string> = {
  sm: "py-16 md:py-20",
  md: "py-24 md:py-32",
  lg: "py-32 md:py-48",
};

/** Vertical-rhythm wrapper for page sections (Spec §5 "sections breathe"). */
export function Section({
  as: Tag = "section",
  spacing = "md",
  containerSize = "max",
  bleed = false,
  className,
  children,
}: SectionProps) {
  return (
    <Tag className={cn(spacingStyles[spacing], className)}>
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </Tag>
  );
}
