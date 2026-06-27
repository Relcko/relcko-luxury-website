import { Text } from "@/components/ui/text";

interface CTADescriptionProps {
	description: string;
}

export function CTADescription({ description }: CTADescriptionProps) {
	return (
		<Text size="lg" tone="muted" className="mx-auto max-w-[48ch] text-center">
			{description}
		</Text>
	);
}
