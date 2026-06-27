import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

type GalleryCaptionProps = {
	children: ReactNode
	className?: string
}

export function GalleryCaption({ children, className }: GalleryCaptionProps) {
	return (
		<p
			className={cn(
				"text-balance font-display-sans text-lg font-medium text-text-primary",
				className,
			)}
		>
			{children}
		</p>
	)
}
