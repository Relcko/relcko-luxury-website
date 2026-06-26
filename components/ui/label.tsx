import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function Label({ className, required = false, children, ...props }: LabelProps) {
  return (
    <label className={cn("text-sm font-medium text-text-primary", className)} {...props}>
      {children}
      {required ? (
        <span className="ml-1 text-accent-gold" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
