import type { ReactNode } from "react"
import { Heading } from "@/components/ui"

type AdvantageTitleProps = {
	children: ReactNode
	className?: string
}

export function AdvantageTitle({ children, className }: AdvantageTitleProps) {
	return (
		<Heading level={3} size="sm" className={className}>
			{children}
		</Heading>
	)
}
