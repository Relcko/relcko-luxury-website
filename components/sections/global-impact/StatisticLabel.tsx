import type { ReactNode } from "react"
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type StatisticLabelProps = {
	children: ReactNode
	className?: string
}

export function StatisticLabel({ children, className }: StatisticLabelProps) {
	return (
		<Text
			size="sm"
			tone="primary"
			className={cn("font-medium uppercase tracking-[0.16em]", className)}
		>
			{children}
		</Text>
	)
}
