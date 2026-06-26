import type { ReactNode } from "react"
import { Text } from "@/components/ui"
import { cn } from "@/utils/cn"

type AdvantageDescriptionProps = {
	children: ReactNode
	className?: string
}

export function AdvantageDescription({ children, className }: AdvantageDescriptionProps) {
	return (
		<Text size="sm" tone="muted" className={cn("max-w-[42ch]", className)}>
			{children}
		</Text>
	)
}
