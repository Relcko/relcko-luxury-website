/**
 * HeroScrollIndicator — scroll cue.
 */
import { cn } from "@/utils/cn";

export type HeroScrollIndicatorProps = {
	/** Anchor id of the next section to jump to. */
	targetId: string;
	className?: string;
};

/**
 * Static, accessible scroll cue. Animation (bounce/fade) is added in 05B.
 * Rendered as a real link so keyboard + screen-reader users can skip down.
 */
export function HeroScrollIndicator({ targetId, className }: HeroScrollIndicatorProps) {
	return (
		<a
			href={`#${targetId}`}
			className={cn(
				"group inline-flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-text-primary focus-visible:text-text-primary",
				className,
			)}
			data-hero-scroll-indicator
		>
			<span className="font-display-sans text-xs uppercase tracking-[0.3em]">
				Scroll
			</span>
			<span
				aria-hidden="true"
				className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5"
			>
				<span className="h-2 w-0.5 rounded-full bg-accent-gold" />
			</span>
			<span className="sr-only">Scroll to explore the residences</span>
		</a>
	);
}
