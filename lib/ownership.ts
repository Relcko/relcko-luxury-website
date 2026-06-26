/**
 * CMS-ready content model for the Ownership Journey.
 * Production sources this from Sanity; here we ship typed placeholders with the exact shape
 * the CMS returns. No hardcoded copy lives inside the components.
 */

export type JourneyIconName = "explore" | "invest" | "own" | "track" | "grow"

export type JourneyStep = {
	id: string
	step: number
	icon: JourneyIconName
	title: string
	description: string
}

export type OwnershipContent = {
	eyebrow: string
	heading: string
	description: string
	steps: JourneyStep[]
	cta: { label: string; href: string }
}

export const ownershipContent: OwnershipContent = {
	eyebrow: "The Ownership Journey",
	heading: "Ownership, made effortless",
	description:
		"From the first viewing to long-term growth, owning with Relcko is a guided, transparent journey — five simple steps that take you from discovery to a residence you truly own.",
	steps: [
		{
			id: "step-explore",
			step: 1,
			icon: "explore",
			title: "Explore premium properties",
			description:
				"Browse a curated collection of landmark residences, each presented with the detail and clarity you would expect of a flagship address.",
		},
		{
			id: "step-invest",
			step: 2,
			icon: "invest",
			title: "Choose an opportunity",
			description:
				"Select the residence and the stake that suit your ambitions, with clear terms and transparent pricing from the very first step.",
		},
		{
			id: "step-own",
			step: 3,
			icon: "own",
			title: "Complete digital ownership",
			description:
				"Finalize your ownership securely online — your stake is recorded clearly and held in your name, wherever you are in the world.",
		},
		{
			id: "step-track",
			step: 4,
			icon: "track",
			title: "Track your investment",
			description:
				"Follow your portfolio in one elegant dashboard, with everything you own visible at a glance and updated in real time.",
		},
		{
			id: "step-grow",
			step: 5,
			icon: "grow",
			title: "Grow with the platform",
			description:
				"Reinvest, expand, or pass on your holdings as your portfolio matures alongside a growing global community.",
		},
	],
	cta: { label: "Start Your Journey", href: "/ownership" },
}
