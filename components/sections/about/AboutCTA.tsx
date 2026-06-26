import Link from "next/link";
import { Button } from "@/components/ui";

type AboutCTAProps = {
	label: string;
	href: string;
	className?: string;
};

export function AboutCTA({ label, href, className }: AboutCTAProps) {
	return (
		<Button asChild variant="primary" size="lg" className={className}>
			<Link href={href}>{label}</Link>
		</Button>
	);
}
