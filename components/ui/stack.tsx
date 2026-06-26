import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type StackDirection = "row" | "col";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "end" | "between";

export interface StackProps {
  as?: ElementType;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

const gapStyles: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

const alignStyles: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyStyles: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/** Flexbox layout primitive (vertical by default). */
export function Stack({
  as: Tag = "div",
  direction = "col",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  children,
}: StackProps) {
  return (
    <Tag
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        gapStyles[gap],
        alignStyles[align],
        justifyStyles[justify],
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
