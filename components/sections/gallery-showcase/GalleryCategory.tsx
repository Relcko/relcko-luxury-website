import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

type GalleryCategoryProps = {
	children: ReactNode
	className?: string
}

export function GalleryCategory({ children, className }: GalleryCategoryProps) {
	return (
		<span
			className={cn(
				"font-display-sans text-xs uppercase tracking-[0.24em] text-accent-gold",
				className,
			)}
		>
			{children}
		</span>
	)
}
