"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { childVariants } from "@/lib/animation"
import type { Statistic } from "@/lib/global-impact"
import { cn } from "@/utils/cn"
import { StatisticCard } from "./StatisticCard"

const VIEWPORT = { once: true, margin: "-15% 0px" } as const

// Stagger container with reduced type issues.
const containerVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0,
		},
	},
}

type StatisticsGridProps = {
	statistics: Statistic[]
	className?: string
}

// One stagger trigger on the list cascades hidden/visible to each card
// (fade-up reveal). 1 → 2 → 3 columns; six metrics settle into a 3×2 grid.
export function StatisticsGrid({ statistics, className }: StatisticsGridProps) {
	return (
		<motion.ul
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
				className,
			)}
		>
			{statistics.map((statistic) => (
				<motion.li key={statistic.id} variants={childVariants}>
					<StatisticCard statistic={statistic} />
				</motion.li>
			))}
		</motion.ul>
	)
}
