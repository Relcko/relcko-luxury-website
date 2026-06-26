import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
export type TextTone = "primary" | "muted" | "subtle" | "accent";

export interface TextProps {
  as?: ElementType;
  size?: TextSize;
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const toneStyles: Record<TextTone, string> = {
  primary: "text-text-primary",
  muted: "text-text-muted",
  subtle: "text-text-subtle",
  accent: "text-accent-gold",
};

export function Text({
  as: Tag = "p",
  size = "base",
  tone = "muted",
  className,
  children,
}: TextProps) {
  return (
    <Tag
      className={cn(
        "font-body leading-relaxed",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
