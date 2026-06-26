/**
 * CMS-ready content model for the About section.
 * Production sources this from Sanity; here we ship typed placeholders
 * with the exact shape the CMS returns.
 */

export type AboutIconName = "developments" | "ownership" | "globe";

export type AboutFeature = {
	id: string;
	icon: AboutIconName;
	title: string;
	description: string;
};

export type AboutImage = {
	src: string;
	alt: string;
	blurDataURL?: string;
};

export type AboutAccent = {
	value: string;
	label: string;
};

export type AboutContent = {
	eyebrow: string;
	heading: string;
	paragraphs: string[];
	image: AboutImage;
	accent?: AboutAccent;
	features: AboutFeature[];
	cta: { label: string; href: string };
};

export const aboutContent: AboutContent = {
	eyebrow: "About Relcko",
	heading: "Permanent architecture, reimagined for a new era of ownership",
	paragraphs: [
		"Relcko is a global real estate house dedicated to landmark living — places designed to outlast trends and hold their meaning for generations. Every address we create begins with architecture worth keeping.",
		"What makes us different is how we think about ownership itself. We pair enduring buildings with a modern, transparent way to own them — so a residence can be held, understood, and passed on with the same clarity as any treasured asset.",
		"Digital ownership simply means your stake in a property is recorded clearly and securely, accessible from anywhere in the world. No opaque paperwork, no borders — just confident, verifiable ownership. We believe this is where real estate is going, and we are building it for people first, technology second.",
	],
	image: {
		src: "/images/about/relcko-vision.jpg",
		alt: "Sunlit atrium of a contemporary residential tower with layered balconies",
	},
	accent: { value: "12+", label: "Cities worldwide" },
	features: [
		{
			id: "feat-developments",
			icon: "developments",
			title: "Premium Developments",
			description:
				"A curated portfolio of architecturally significant residences, built to a standard that endures.",
		},
		{
			id: "feat-ownership",
			icon: "ownership",
			title: "Digital Ownership",
			description:
				"A clear, secure record of what you own — transparent, verifiable, and effortless to manage.",
		},
		{
			id: "feat-global",
			icon: "globe",
			title: "Global Accessibility",
			description:
				"Own and oversee a residence from anywhere, with a borderless experience designed around you.",
		},
	],
	cta: { label: "Discover Our Vision", href: "/about" },
};
