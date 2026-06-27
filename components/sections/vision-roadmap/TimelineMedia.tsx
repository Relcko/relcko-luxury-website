"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { easing } from "@/lib/animation";
import type { RoadmapImage } from "@/lib/vision-roadmap";
import { cn } from "@/utils/cn";

/**
 * Image reveal: gentle fade + settle, composed from the Phase 03 easing token.
 */
const mediaVariants: Variants = {
	hidden: { opacity: 0, scale: 1.04 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: easing.out } },
};

type TimelineMediaProps = {
	image: RoadmapImage;
	className?: string;
};

export function TimelineMedia({ image, className }: TimelineMediaProps) {
	return (
		<motion.div
			variants={mediaVariants}
			className={cn(
				"relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-bg-elevated",
				className,
			)}
		>
			<Image
				src={image.src}
				alt={image.alt}
				fill
				loading="lazy"
				sizes="(min-width: 1024px) 28rem, (min-width: 640px) 80vw, 100vw"
				className="object-cover"
			/>
		</motion.div>
	);
}
