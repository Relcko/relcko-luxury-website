"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { childVariants } from "@/lib/animation";
import { Heading, Text } from "@/components/ui";
import type { VisionRoadmapContent } from "@/lib/vision-roadmap";
import { cn } from "@/utils/cn";

const VIEWPORT = { once: true, margin: "-15% 0px" } as const;

type RoadmapHeaderProps = {
	content: Pick<VisionRoadmapContent, "eyebrow" | "heading" | "description">;
	className?: string;
};

/**
 * Container variants: wraps children with stagger.
 */
const containerVariants: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.1, staggerDirection: 1 },
	},
};

export function RoadmapHeader({ content, className }: RoadmapHeaderProps) {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("mx-auto flex max-w-2xl flex-col items-center gap-4 text-center", className)}
		>
			<motion.div variants={childVariants} className="flex flex-col items-center gap-3">
				<span className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold">
					{content.eyebrow}
				</span>
				<Heading level={2} size="xl" className="text-balance">
					{content.heading}
				</Heading>
			</motion.div>
			<motion.div variants={childVariants}>
<Text size="base" tone="muted" className="text-balance">
					{content.description}
				</Text>
			</motion.div>
		</motion.div>
	);
}
