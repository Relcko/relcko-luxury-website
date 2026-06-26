"use client";

import { motion } from "framer-motion";
import { staggerContainer, childVariants } from "@/lib/animation";
import type { AboutContent as AboutContentData } from "@/lib/about";
import { cn } from "@/utils/cn";
import { AboutHeading } from "./AboutHeading";
import { AboutDescription } from "./AboutDescription";
import { AboutFeatures } from "./AboutFeatures";
import { AboutCTA } from "./AboutCTA";

// Named const keeps inline object literals out of JSX (project convention).
const VIEWPORT = { once: true, margin: "-15% 0px" } as const;

type AboutContentProps = {
	content: Pick<
		AboutContentData,
		"eyebrow" | "heading" | "paragraphs" | "features" | "cta"
	>;
	className?: string;
};

// Single scroll trigger for the whole right column. staggerContainer cascades
// hidden/visible to each block (fade-up); AboutFeatures is a nested stagger
// container that then cascades to its cards — no extra triggers, Phase 03 only.
export function AboutContent({ content, className }: AboutContentProps) {
	return (
		<motion.div
			variants={staggerContainer()}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("flex flex-col gap-8", className)}
		>
			<motion.div variants={childVariants}>
				<AboutHeading eyebrow={content.eyebrow} heading={content.heading} />
			</motion.div>
			<motion.div variants={childVariants}>
				<AboutDescription paragraphs={content.paragraphs} />
			</motion.div>
			<AboutFeatures features={content.features} />
			<motion.div variants={childVariants}>
				<AboutCTA label={content.cta.label} href={content.cta.href} />
			</motion.div>
		</motion.div>
	);
}
