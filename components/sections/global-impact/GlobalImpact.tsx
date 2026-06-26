import { Container } from "@/components/ui"
import { globalImpactContent, type GlobalImpactContent } from "@/lib/global-impact"
import { cn } from "@/utils/cn"
import { ImpactHeader } from "./ImpactHeader"
import { StatisticsGrid } from "./StatisticsGrid"

type GlobalImpactProps = {
	content?: GlobalImpactContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Centered
// header sits above the responsive statistics grid.
export function GlobalImpact({
	content = globalImpactContent,
	id = "impact",
	className,
}: GlobalImpactProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="flex flex-col gap-14 md:gap-20">
					<ImpactHeader content={content} />
					<StatisticsGrid statistics={content.statistics} />
				</div>
			</Container>
		</section>
	)
}
