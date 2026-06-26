import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Surface } from "@/components/ui/surface";
import type { SurfaceElevation } from "@/components/ui/surface";

export interface CardProps {
  elevation?: SurfaceElevation;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

export interface CardSlotProps {
  className?: string;
  children: ReactNode;
}

export function Card({
  elevation = "raised",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <Surface
      elevation={elevation}
      className={cn(
        "overflow-hidden",
        interactive &&
          "transition-colors duration-200 ease-out hover:border-accent-gold motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </Surface>
  );
}

export function CardHeader({ className, children }: CardSlotProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-6 pb-0 md:p-8 md:pb-0", className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: CardSlotProps) {
  return <div className={cn("p-6 md:p-8", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardSlotProps) {
  return (
    <div
      className={cn("flex items-center gap-3 p-6 pt-0 md:p-8 md:pt-0", className)}
    >
      {children}
    </div>
  );
}
