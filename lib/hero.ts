/**
 * CMS-ready Hero content model.
 * In production these fields are sourced from Sanity; here we ship typed
 * placeholder data with the exact shape the CMS will return.
 */

export type HeroMediaSource =
	| {
			kind: "image";
			/** Path under /public or a remote CMS URL. */
			src: string;
			/** Required for a11y; empty string only for decorative media. */
			alt: string;
			/** Low-quality placeholder data URL (optional). */
			blurDataURL?: string;
	  }
	| {
			kind: "video";
			/** Ordered by preference; browser picks the first it can play. */
			sources: Array<{ src: string; type: "video/webm" | "video/mp4" }>;
			/** Optimized still shown as the LCP element + video fallback. */
			poster: string;
			/** Optional LQIP for the poster image. */
			blurDataURL?: string;
			/** Accessible label describing the footage. */
			label: string;
	  };

export type HeroCta = {
	label: string;
	href: string;
};

export type HeroContent = {
	eyebrow: string;
	heading: string;
	subheading?: string;
	description: string;
	primaryCta: HeroCta;
	secondaryCta?: HeroCta;
	media: HeroMediaSource;
	/** Accessible name for the hero landmark region. */
	regionLabel: string;
};

// Placeholder content — swap `media.src` for real assets in /public/images/hero/
// or wire to the CMS query in Phase 06+.
export const heroContent: HeroContent = {
	eyebrow: "Private Collection · Est. 2026",
	heading: "Architecture for a Considered Life",
	subheading: "Limited residences in the world's most coveted addresses",
	description:
		"Lumière Estates curates a portfolio of architecturally significant homes — each a study in light, proportion, and permanence. Tokenized ownership, reimagined for the discerning few.",
	primaryCta: { label: "Explore Residences", href: "/projects" },
	secondaryCta: { label: "Request Private Tour", href: "/contact" },
	media: {
		kind: "image",
		src: "/images/hero/hero-poster.jpg",
		alt: "Floor-to-ceiling glass residence overlooking a still infinity pool at dusk",
	},
	regionLabel: "Lumière Estates — featured residences",
};
