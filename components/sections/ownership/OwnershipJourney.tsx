import { Container } from "@/components/ui"
import { ownershipContent, type OwnershipContent } from "@/lib/ownership"
import { cn } from "@/utils/cn"
import { JourneyHeader } from "./JourneyHeader"
import { JourneyTimeline } from "./JourneyTimeline"

type OwnershipJourneyProps = {
	content?: OwnershipContent
	id?: string
	className?: string
}

/**
 * Server component.
 * Native <section> guarantees id + aria-label. Editorial intro is the left column,
 * the journey timeline the right.
 */
export function OwnershipJourney({
	content = ownershipContent,
	id = "ownership",
	className,
}: OwnershipJourneyProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
					<JourneyHeader content={content} />
					<JourneyTimeline steps={content.steps} />
				</div>
			</Container>
		</section>
	)
}
