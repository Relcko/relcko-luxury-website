/**
 * CustomCursor — trailing dot with expand on interactive hover.
 */
"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/utils/cn";

interface CustomCursorProps {
  className?: string;
  size?: number;
  hoverSize?: number;
}

/**
 * Custom cursor — only shown on device with fine pointer (mouse).
 */
export function CustomCursor({
  className,
  size = 12,
  hoverSize = 48,
}: CustomCursorProps) {
  const reducedMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 28 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button";
      setIsHovering(!!isInteractive);
    };

    const onMouseOut = () => setIsHovering(false);

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseover", onMouseOver);
    document.body.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseover", onMouseOver);
      document.body.removeEventListener("mouseout", onMouseOut);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <motion.div
      className={cn(
        "fixed pointer-events-none z-[9999] rounded-full mix-blend-difference",
        className
      )}
      style={{
        x,
        y,
        width: isHovering ? hoverSize : size,
        height: isHovering ? hoverSize : size,
        backgroundColor: "var(--accent-gold)",
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}
