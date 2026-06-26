/**
 * HeroActions — CTA layer (primary + secondary).
 */
import Link from "next/link";
import type { HeroCta } from "@/lib/hero";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";

export type HeroActionsProps = {
	primary: HeroCta;
	secondary?: HeroCta;
	className?: string;
};

/**
 * CTA layer. Buttons render as Next.js Links via asChild-free composition:
 * we wrap Button in Link so navigation + button styling stay decoupled.
 * Keyboard accessible by default (native anchors).
 */
export function HeroActions({ primary, secondary, className }: HeroActionsProps) {
	return (
		<div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
			<Button asChild variant="primary" size="lg">
				<Link href={primary.href}>{primary.label}</Link>
			</Button>
			{secondary ? (
				<Button asChild variant="secondary" size="lg">
					<Link href={secondary.href}>{secondary.label}</Link>
				</Button>
			) : null}
		</div>
	);
}
