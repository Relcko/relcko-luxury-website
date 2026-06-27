import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Logo } from "./logo";
import { FooterLink, FooterLinkGroup } from "./footer-link";
import { navItems } from "@/lib/navigation";

export function Footer() {
	return (
		<footer className="border-t border-border bg-bg-base py-16">
			<Container>
				<div className="grid gap-12 md:grid-cols-4">
					{/* Logo + tagline */}
					<div className="md:col-span-1">
						<Logo />
						<Text size="sm" tone="muted" className="mt-4">
							Redefining luxury living through timeless design and
							exceptional craftsmanship.
						</Text>
					</div>

					{/* Link columns */}
					{navItems.slice(0, 3).map((item) => (
						<FooterLinkGroup key={item.id} heading={item.label}>
							{item.megaMenu?.columns.map((col) =>
								col.links.map((link) => (
									<FooterLink key={link.href} {...link} />
								)),
							)}
						</FooterLinkGroup>
					))}
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
					<Text size="sm" tone="muted">
						© {new Date().getFullYear()} Lumière Estates. All rights reserved.
					</Text>
					<div className="flex gap-6">
						<a
							href="/privacy"
							className="text-sm text-text-muted hover:text-text-primary"
						>
							Privacy
						</a>
						<a
							href="/terms"
							className="text-sm text-text-muted hover:text-text-primary"
						>
							Terms
						</a>
					</div>
				</div>
			</Container>
		</footer>
	);
}
