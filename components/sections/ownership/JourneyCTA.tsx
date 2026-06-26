import Link from "next/link"
import { Button } from "@/components/ui"

type JourneyCTAProps = {
	label: string
	href: string
	className?: string
}

export function JourneyCTA({ label, href, className }: JourneyCTAProps) {
	return (
		<Button asChild variant="primary" size="lg" className={className}>
			<Link href={href}>{label}</Link>
		</Button>
	)
}
