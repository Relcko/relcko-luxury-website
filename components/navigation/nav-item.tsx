/**
 * NavItem — desktop link with animated gold underline; opens mega menu on hover/focus.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import type { NavItemData } from "@/lib/navigation";

export type NavItemProps = {
	item: NavItemData;
	isOpen: boolean;
	onOpen: (id: string) => void;
	onClose: () => void;
};

export function NavItem({ item, isOpen, onOpen, onClose }: NavItemProps) {
	const pathname = usePathname();
	const isActive =
		item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
	const hasMenu = Boolean(item.megaMenu);

	return (
		<li
			className="relative"
			onMouseEnter={() => onOpen(item.id)}
			onMouseLeave={onClose}
		>
			<Link
				href={item.href}
				aria-current={isActive ? "page" : undefined}
				aria-haspopup={hasMenu || undefined}
				aria-expanded={hasMenu ? isOpen : undefined}
				onFocus={() => onOpen(item.id)}
				className={cn(
					"group relative inline-flex items-center py-2 text-sm tracking-wide",
					"text-text-primary/80 hover:text-text-primary",
					"transition-colors duration-200 ease-out motion-reduce:transition-none",
					"focus-visible:outline-none focus-visible:text-text-primary",
					isActive && "text-text-primary",
				)}
			>
				{item.label}
				<span
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-gold",
						"scale-x-0 transition-transform duration-300 ease-out motion-reduce:transition-none",
						"group-hover:scale-x-100 group-focus-visible:scale-x-100",
						(isActive || isOpen) && "scale-x-100",
					)}
				/>
			</Link>
		</li>
	);
}
