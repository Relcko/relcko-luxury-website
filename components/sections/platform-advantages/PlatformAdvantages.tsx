import { Container } from "@/components/ui"
import {
	platformAdvantagesContent,
	type PlatformAdvantagesContent,
} from "@/lib/platform-advantages"
import { cn } from "@/utils/cn"
import { AdvantagesHeader } from "./AdvantagesHeader"
import { AdvantagesGrid } from "./AdvantagesGrid"

type PlatformAdvantagesProps = {
	content?: PlatformAdvantagesContent
	id?: string
	className?: string
}

// Server component. Native <section> guarantees id + aria-label. Editorial
// intro is the left column, the advantage grid the right.
export function PlatformAdvantages({
	content = platformAdvantagesContent,
	id = "advantages",
	className,
}: PlatformAdvantagesProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
					<AdvantagesHeader content={content} />
					<AdvantagesGrid advantages={content.advantages} />
				</div>
			</Container>
		</section>
	)
}
