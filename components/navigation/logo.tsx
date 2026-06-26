/**
 * Logo — brand link with optional scaling.
 */
import Link from "next/link";
import { cn } from "@/utils/cn";

export type LogoProps = {
	scaled?: boolean;
	className?: string;
};

export function Logo({ scaled = false, className }: LogoProps) {
	return (
		<Link
			href="/"
			aria-label="Lumière Estates — home"
			className={cn(
				"font-display-sans text-lg font-semibold tracking-[0.22em] text-text-primary",
				"origin-left transition-transform duration-300 ease-out motion-reduce:transition-none",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
				scaled ? "scale-90" : "scale-100",
				className,
			)}
		>
			LUMIÈRE
		</Link>
	);
}
