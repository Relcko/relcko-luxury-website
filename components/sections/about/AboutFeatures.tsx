"use client";

import { motion } from "framer-motion";
import { staggerContainer, childVariants } from "@/lib/animation";
import type { AboutFeature } from "@/lib/about";
import { cn } from "@/utils/cn";
import { AboutFeatureCard } from "./AboutFeatureCard";

type AboutFeaturesProps = {
	features: AboutFeature[];
	className?: string;
};

// No own trigger: this list is a nested stagger container that inherits
// hidden/visible from AboutContent and cascades to each card.
export function AboutFeatures({ features, className }: AboutFeaturesProps) {
	return (
		<motion.ul variants={staggerContainer()} className={cn("flex flex-col gap-6", className)}>
			{features.map((feature) => (
				<motion.li key={feature.id} variants={childVariants}>
					<AboutFeatureCard feature={feature} />
				</motion.li>
			))}
		</motion.ul>
	);
}
