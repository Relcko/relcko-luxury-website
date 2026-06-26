import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant = "solid" | "outline" | "muted";

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  solid: "bg-accent-gold text-text-inverse",
  outline: "border border-accent-gold text-accent-gold",
  muted: "bg-accent-gold-muted text-accent-gold",
};

export function Badge({ variant = "muted", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
