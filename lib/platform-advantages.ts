/**
 * CMS-ready content model for the Platform Advantages section. Production
 * sources this from Sanity; here we ship typed placeholders with the exact
 * shape the CMS returns. No hardcoded copy lives inside the components.
 * Tone: confidence and clarity — no marketing hype.
 */

export type AdvantageIconName =
	| "curated"
	| "ownership"
	| "diligence"
	| "global"
	| "secure"
	| "vision"

export type Advantage = {
	id: string
	icon: AdvantageIconName
	title: string
	description: string
}

export type PlatformAdvantagesContent = {
	eyebrow: string
	heading: string
	description: string
	advantages: Advantage[]
}

export const platformAdvantagesContent: PlatformAdvantagesContent = {
	eyebrow: "Why Relcko",
	heading: "A platform built to be trusted",
	description:
		"Trust is earned in the details. Every part of the Relcko experience — from the residences we select to the way you hold and manage them — is designed to be clear, considered, and dependable for the long term.",
	advantages: [
		{
			id: "adv-curated",
			icon: "curated",
			title: "Curated Properties",
			description:
				"Every residence is hand-selected for its architecture, location, and lasting value — never volume for its own sake.",
		},
		{
			id: "adv-ownership",
			icon: "ownership",
			title: "Transparent Digital Ownership",
			description:
				"What you own is recorded plainly and accessibly, so your stake is always clear and entirely yours.",
		},
		{
			id: "adv-diligence",
			icon: "diligence",
			title: "Professional Due Diligence",
			description:
				"Each opportunity is reviewed by experienced professionals before it ever reaches you.",
		},
		{
			id: "adv-global",
			icon: "global",
			title: "Global Access",
			description:
				"Own and manage residences across borders, with an experience that feels local wherever you are.",
		},
		{
			id: "adv-secure",
			icon: "secure",
			title: "Secure Platform",
			description:
				"Considered safeguards protect your ownership and information at every step, quietly and reliably.",
		},
		{
			id: "adv-vision",
			icon: "vision",
			title: "Long-Term Vision",
			description:
				"We build for decades, not headlines — aligning every decision with enduring value.",
		},
	],
}
