import { forwardRef, type ReactNode } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";
import { focusRing, transitionBase } from "@/lib/design/styles";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as a child component (e.g., Next.js Link). */
  asChild?: boolean;
  /** Child element to render when asChild is true. */
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-gold text-text-inverse hover:bg-accent-gold-hover font-medium",
  secondary:
    "border border-border-strong text-text-primary hover:border-accent-gold hover:text-accent-gold",
  ghost: "text-text-primary hover:bg-bg-surface",
  link: "h-auto px-0 text-accent-gold underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-13 px-8 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", asChild, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-display tracking-tight",
        "disabled:pointer-events-none disabled:opacity-50",
        transitionBase,
        focusRing,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
