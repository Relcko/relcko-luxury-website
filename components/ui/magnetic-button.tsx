/**
 * MagneticButton — magnetic hover effect with spring physics.
 */
"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { cn } from "@/utils/cn";
import type { ReactNode, MouseEventHandler } from "react";

type MagneticStrength = { x: number; y: number };

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  range?: number;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Magnetic button — draws cursor closer on hover.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.3,
  range = 0.8,
  disabled,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [magnetic, setMagnetic] = useState<MagneticStrength>({ x: 0, y: 0 });

  const x = useSpring(magnetic.x, { stiffness: 300, damping: 30 });
  const y = useSpring(magnetic.y, { stiffness: 300, damping: 30 });

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      setMagnetic({
        x: distanceX * strength * range,
        y: distanceY * strength * range,
      });
    };

    const onMouseLeave = () => {
      setMagnetic({ x: 0, y: 0 });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength, range]);

  return (
    <motion.button
      ref={ref}
      className={cn("inline-flex items-center justify-center", className)}
      style={{ x, y }}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
