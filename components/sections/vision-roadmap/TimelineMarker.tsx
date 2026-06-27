"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { easing } from "@/lib/animation";
import { cn } from "@/utils/cn";

/**
 * Marker reveal: a local scale/opacity Variant composed from the Phase 03
 * easing token. Inherits the visible state from the parent <li> trigger.
 */
const markerVariants: Variants = {
	hidden: { opacity: 0, scale: 0.4 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easing.out } },
};

type TimelineMarkerProps = {
	className?: string;
};

export function TimelineMarker({ className }: TimelineMarkerProps) {
	return (
		<motion.span
			variants={markerVariants}
			aria-hidden="true"
			className={cn(
				"flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated",
				className,
			)}
		>
			<span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
		</motion.span>
	);
}
