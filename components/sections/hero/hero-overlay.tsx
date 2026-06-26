/**
 * HeroOverlay — gradient/scrim overlay layer.
 */
import { cn } from "@/utils/cn";

export type HeroOverlayProps = {
	className?: string;
};

/**
 * Scrim that guarantees text contrast over any media.
 * Dual gradient: vertical darkening at the base for copy legibility,
 * plus a subtle radial vignette for editorial depth. No inline styles.
 */
export function HeroOverlay({ className }: HeroOverlayProps) {
	return (
		<div aria-hidden="true" className={cn("absolute inset-0", className)}>
			<div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-bg-base/10" />
			<div className="absolute inset-0 bg-gradient-to-r from-bg-base/70 via-transparent to-transparent" />
		</div>
	);
}
