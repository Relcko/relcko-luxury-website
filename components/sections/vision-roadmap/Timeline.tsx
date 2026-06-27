"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { easing } from "@/lib/animation";
import type { RoadmapMilestone } from "@/lib/vision-roadmap";
import { cn } from "@/utils/cn";
import { TimelineItem } from "./TimelineItem";

const VIEWPORT = { once: true, margin: "-15% 0px" } as const;

/**
 * Timeline reveal: the vertical line grows from the top (scaleY, origin top).
 */
const lineVariants: Variants = {
	hidden: { scaleY: 0 },
	visible: { scaleY: 1, transition: { duration: 1.1, ease: easing.out } },
};

/**
 * Named style object (origin top) so the line scales downward from the start.
 */
const LINE_STYLE = { originY: 0 } as const;

/**
 * Container variants: wraps children with stagger.
 */
const containerVariants: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.12, staggerDirection: 1 },
	},
};

type TimelineProps = {
	milestones: RoadmapMilestone[];
	className?: string;
};

/**
 * Semantic ordered list. One stagger trigger cascades each <li> (and the line)
 * from hidden → visible — the "alternating stagger" as items reveal top to bottom.
 */
export function Timeline({ milestones, className }: TimelineProps) {
	return (
		<motion.ol
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("relative flex flex-col gap-12 lg:gap-20", className)}
		>
			<motion.span
				aria-hidden="true"
				variants={lineVariants}
				style={LINE_STYLE}
				className="pointer-events-none absolute top-1.5 bottom-1.5 left-[1.0625rem] w-px -translate-x-1/2 bg-border lg:left-1/2"
			/>
			{milestones.map((milestone, index) => (
				<TimelineItem key={milestone.id} milestone={milestone} index={index} />
			))}
		</motion.ol>
	);
}
