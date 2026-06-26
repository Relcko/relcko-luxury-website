/**
 * NavActions — search + desktop CTA + hamburger.
 */
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchButton } from "./search-button";

export type NavActionsProps = {
	mobileOpen: boolean;
	onToggleMobile: () => void;
	mobileMenuId: string;
};

export function NavActions({
	mobileOpen,
	onToggleMobile,
	mobileMenuId,
}: NavActionsProps) {
	const router = useRouter();

	return (
		<div className="flex items-center gap-2">
			<SearchButton />
			<Button
				variant="primary"
				size="sm"
				className="hidden lg:inline-flex"
				onClick={() => router.push("/contact")}
			>
				Enquire
			</Button>
			<button
				type="button"
				aria-label={mobileOpen ? "Close menu" : "Open menu"}
				aria-expanded={mobileOpen}
				aria-controls={mobileMenuId}
				onClick={onToggleMobile}
				className="relative inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
			>
				<span aria-hidden="true" className="relative block h-4 w-6">
					<span
						className={`absolute left-0 block h-px w-full bg-text-primary transition-all duration-300 ease-out motion-reduce:transition-none ${
							mobileOpen
								? "top-1/2 -translate-y-1/2 rotate-45"
								: "top-0"
						}`}
					/>
					<span
						className={`absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-text-primary transition-opacity duration-200 ease-out motion-reduce:transition-none ${
							mobileOpen ? "opacity-0" : "opacity-100"
						}`}
					/>
					<span
						className={`absolute left-0 block h-px w-full bg-text-primary transition-all duration-300 ease-out motion-reduce:transition-none ${
							mobileOpen
								? "bottom-1/2 translate-y-1/2 -rotate-45"
								: "bottom-0"
						}`}
					/>
				</span>
			</button>
		</div>
	);
}
