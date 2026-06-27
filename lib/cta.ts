/**
 * Final CTA content — CMS-ready.
 */
export interface FinalCTAData {
	eyebrow: string
	heading: string
	description: string
	cta: {
		primary: {
			label: string
			href: string
		}
		secondary: {
			label: string
			href: string
		}
	}
}

// Placeholder — shaped for direct CMS mapping.
export const finalCTAContent: FinalCTAData = {
	eyebrow: "Begin Your Journey",
	heading: "Experience the Extraordinary",
	description:
		"Every masterpiece begins with a single conversation. Whether you seek a residence that reflects your achievements or an investment in enduring value, our team is ready to guide you.",
	cta: {
		primary: {
			label: "Schedule a Private Viewing",
			href: "/contact?topic=viewing",
		},
		secondary: {
			label: "Explore Projects",
			href: "/projects",
		},
	},
}
