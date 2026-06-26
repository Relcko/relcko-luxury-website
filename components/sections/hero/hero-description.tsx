/**
 * HeroDescription — lead copy.
 */
import { Text } from "@/components/ui";
import { cn } from "@/utils/cn";

export type HeroDescriptionProps = {
	children: string;
	className?: string;
};

export function HeroDescription({ children, className }: HeroDescriptionProps) {
return (
		<Text size="base" tone="muted" className={cn("max-w-[52ch]", className)}>
			{children}
		</Text>
	);
}
