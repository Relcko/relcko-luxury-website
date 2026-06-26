import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { focusRing, transitionBase } from "@/lib/design/styles";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid ? "true" : undefined}
        className={cn(
          "w-full resize-y rounded-md border bg-bg-elevated px-4 py-3 text-base text-text-primary",
          "placeholder:text-text-subtle",
          invalid ? "border-danger" : "border-border",
          transitionBase,
          focusRing,
          className,
        )}
        {...props}
      />
    );
  },
);
