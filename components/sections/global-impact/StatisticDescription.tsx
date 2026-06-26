import type { ReactNode } from "react"
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type StatisticDescriptionProps = {
	children: ReactNode
	className?: string
}

export function StatisticDescription({ children, className }: StatisticDescriptionProps) {
	return (
		<Text size="sm" tone="muted" className={cn("max-w-[34ch]", className)}>
			{children}
		</Text>
	)
}
