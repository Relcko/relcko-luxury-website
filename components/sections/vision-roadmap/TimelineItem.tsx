"use client";

import { motion } from "framer-motion";
import { childVariants } from "@/lib/animation";
import type { RoadmapMilestone } from "@/lib/vision-roadmap";
import { cn } from "@/utils/cn";
import { TimelineMarker } from "./TimelineMarker";
import { TimelineContent } from "./TimelineContent";
import { TimelineMedia } from "./TimelineMedia";

type TimelineItemProps = {
	milestone: RoadmapMilestone;
	index: number;
};

/**
 * One <li>. Fade-up via childVariants (a stagger child of the <ol>). Marker and
 * media inherit the visible state and play their own reveals. On lg the row is
 * a two-column grid and even/odd items alternate sides of the center line.
 */
export function TimelineItem({ milestone, index }: TimelineItemProps) {
	const isLeft = index % 2 === 0;

	return (
		<motion.li
			variants={childVariants}
			className="relative pl-14 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0"
		>
			<TimelineMarker className="absolute left-[1.0625rem] top-1.5 -translate-x-1/2 lg:left-1/2" />
			<div
				className={cn(
					"flex flex-col gap-4",
					isLeft
						? "lg:col-start-1 lg:items-end lg:pr-16 lg:text-right"
						: "lg:col-start-2 lg:pl-16",
				)}
			>
				<TimelineContent
					year={milestone.year}
					title={milestone.title}
					description={milestone.description}
				/>
				{milestone.image ? <TimelineMedia image={milestone.image} /> : null}
			</div>
		</motion.li>
	);
}
