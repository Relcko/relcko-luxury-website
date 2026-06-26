import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { focusRing, transitionBase } from "@/lib/design/styles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = "text", ...props },
  ref,
) {
  return (
    <input
ref={ref}
      type={type}
      aria-invalid={invalid ? "true" : undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-bg-elevated px-4 text-base text-text-primary",
        "placeholder:text-text-subtle",
        invalid ? "border-danger" : "border-border",
        transitionBase,
        focusRing,
        className,
      )}
      {...props}
    />
  );
});
