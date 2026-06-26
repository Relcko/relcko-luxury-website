"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { Advantage } from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"
import { AdvantageCard } from "./AdvantageCard"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

type AdvantagesGridProps = {
	advantages: Advantage[]
	className?: string
}

// One stagger trigger on the list cascades hidden/visible to each card
// (fade-up reveal). Two columns from sm upward = a 2×3 grid for six items.
export function AdvantagesGrid({ advantages, className }: AdvantagesGridProps) {
	return (
		<motion.ul
			variants={staggerContainer()}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", className)}
		>
			{advantages.map((advantage) => (
				<motion.li key={advantage.id} variants={childVariants} className="h-full">
					<AdvantageCard advantage={advantage} />
				</motion.li>
			))}
		</motion.ul>
	)
}
