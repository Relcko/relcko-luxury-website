import { Text } from "@/components/ui";
import { cn } from "@/utils/cn";

type AboutDescriptionProps = {
	paragraphs: string[];
	className?: string;
};

export function AboutDescription({ paragraphs, className }: AboutDescriptionProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
{paragraphs.map((paragraph, index) => (
				<Text key={`about-paragraph-${index}`} size="base" tone="muted" className="max-w-[60ch]">
					{paragraph}
				</Text>
			))}
		</div>
	);
}
