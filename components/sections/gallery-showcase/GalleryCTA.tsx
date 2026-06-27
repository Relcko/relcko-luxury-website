import { Button } from "@/components/ui"

type GalleryCTAProps = {
	label: string
	href: string
	className?: string
}

/** Closing call-to-action using the Phase 02 Button with asChild for link forwarding. */
export function GalleryCTA({ label, href, className }: GalleryCTAProps) {
	return (
		<Button asChild variant="secondary" size="lg" className={className}>
			<a href={href}>{label}</a>
		</Button>
	)
}
