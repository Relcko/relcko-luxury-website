/**
 * Navbar — desktop navigation wrapper.
 */
"use client";

import { NavItem } from "./nav-item";
import { navItems } from "@/lib/navigation";

export type NavbarProps = {
	activeMenu: string | null;
	onOpen: (id: string) => void;
	onClose: () => void;
};

export function Navbar({ activeMenu, onOpen, onClose }: NavbarProps) {
	return (
		<nav aria-label="Primary" className="hidden lg:block">
			<ul className="flex items-center gap-8">
				{navItems.map((item) => (
					<NavItem
						key={item.id}
						item={item}
						isOpen={activeMenu === item.id}
						onOpen={onOpen}
						onClose={onClose}
					/>
				))}
			</ul>
		</nav>
	);
}
