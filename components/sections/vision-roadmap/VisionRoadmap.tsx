import { Container } from "@/components/ui";
import { visionRoadmapContent, type VisionRoadmapContent } from "@/lib/vision-roadmap";
import { cn } from "@/utils/cn";
import { RoadmapHeader } from "./RoadmapHeader";
import { Timeline } from "./Timeline";

type VisionRoadmapProps = {
	content?: VisionRoadmapContent;
	id?: string;
	className?: string;
};

/**
 * Server component. Native <section> guarantees id + aria-label. Centered
 * header sits above the alternating vertical timeline.
 */
export function VisionRoadmap({
	content = visionRoadmapContent,
	id = "vision",
	className,
}: VisionRoadmapProps) {
	return (
		<section
			id={id}
			aria-label={content.heading}
			className={cn("relative overflow-hidden bg-bg-base py-24 md:py-32 lg:py-40", className)}
		>
			<Container size="max">
				<div className="flex flex-col gap-14 md:gap-20">
					<RoadmapHeader content={content} />
					<Timeline milestones={content.milestones} />
				</div>
			</Container>
		</section>
	);
}
