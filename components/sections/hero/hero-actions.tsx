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
 * Hover scale + gold glow are CSS gated with motion-safe for reduced-motion users.
 */
const ctaMotion =
	"motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 " +
	"motion-safe:hover:scale-[1.03] motion-safe:hover:shadow-[0_0_40px_rgba(200,162,106,0.35)]";

export function HeroActions({ primary, secondary, className }: HeroActionsProps) {
	return (
		<div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
			<Button asChild variant="primary" size="lg" data-hero="cta" className={ctaMotion}>
				<Link href={primary.href}>{primary.label}</Link>
			</Button>
			{secondary ? (
				<Button asChild variant="secondary" size="lg" data-hero="cta" className={ctaMotion}>
					<Link href={secondary.href}>{secondary.label}</Link>
				</Button>
			) : null}
		</div>
	);
}
