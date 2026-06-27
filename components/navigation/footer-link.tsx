import Link from "next/link";
import { Text } from "@/components/ui/text";

interface FooterLinkProps {
	label: string;
	href: string;
}

export function FooterLink({ label, href }: FooterLinkProps) {
	return (
		<Link
			href={href}
			className="block py-1 text-sm text-text-muted transition-colors hover:text-text-primary"
		>
			{label}
		</Link>
	);
}

interface FooterLinkGroupProps {
	heading: string;
	children: React.ReactNode;
}

export function FooterLinkGroup({ heading, children }: FooterLinkGroupProps) {
	return (
		<div>
<Text size="sm" className="mb-4 font-medium">
				{heading}
			</Text>
			<nav className="flex flex-col">{children}</nav>
		</div>
	);
}
