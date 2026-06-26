import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

/** Max-width (1600px) layout wrapper with responsive gutters (Spec §5). */
export function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-6 md:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
