import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "sm" | "md" | "lg" | "xl" | "display";

export interface HeadingProps {
  /** Semantic tag override; defaults to h{level}. */
  as?: ElementType;
  level?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<HeadingSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
  display: "text-5xl",
};

/**
 * Editorial heading. Semantic level (a11y) is decoupled from visual size so
 * heading order stays correct regardless of styling.
 */
export function Heading({
  as,
  level = 2,
  size = "lg",
  className,
  children,
}: HeadingProps) {
  const Tag: ElementType = as ?? (`h${level}` as ElementType);
  return (
    <Tag
      className={cn(
        "font-display font-medium leading-[1.05] tracking-tight text-text-primary",
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
