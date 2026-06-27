import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface CTAActionsProps {
	primary: { label: string; href: string };
	secondary: { label: string; href: string };
	className?: string;
}

export function CTAActions({
	primary,
	secondary,
	className,
}: CTAActionsProps) {
	return (
		<div className={cn("flex flex-wrap justify-center gap-4", className)}>
			<Button asChild size="lg" variant="primary">
				<a href={primary.href}>{primary.label}</a>
			</Button>
			<Button asChild size="lg" variant="secondary">
				<a href={secondary.href}>{secondary.label}</a>
			</Button>
		</div>
	);
}
