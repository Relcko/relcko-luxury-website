import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ContainerSize = "narrow" | "content" | "max";

export interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<ContainerSize, string> = {
  narrow: "max-w-narrow",
  content: "max-w-content",
  max: "max-w-[var(--container-max)]",
};

/** Centered, max-width layout wrapper with responsive gutters (Spec §5). */
export function Container({
  as: Tag = "div",
  size = "max",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 md:px-10 lg:px-16",
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
