/**
 * CMS-ready content model for the Global Impact section. Production sources
 * this from Sanity; here we ship typed placeholders with the exact shape the
 * CMS returns. No hardcoded copy lives inside the components. Values are
 * placeholders — understated, confidence-inspiring metrics.
 */

export type StatIconName =
	| "properties"
	| "cities"
	| "investors"
	| "aum"
	| "countries"
	| "experience"

export type Statistic = {
	id: string
	/** Raw numeric target the count-up animates toward. */
	value: number
	label: string
	description?: string
	/** Rendered before the value, e.g. "$". */
	prefix?: string
	/** Rendered after the value, e.g. "+" or "B". */
	suffix?: string
	/** Fixed decimal places for display + count-up (default 0). */
	decimals?: number
	icon?: StatIconName
}

export type GlobalImpactContent = {
	eyebrow: string
	heading: string
	description: string
	statistics: Statistic[]
}

export const globalImpactContent: GlobalImpactContent = {
	eyebrow: "Global Impact",
	heading: "Trusted at a global scale",
	description:
		"A growing portfolio, a worldwide community, and a track record measured in decades — the numbers behind a platform built for the long term.",
	statistics: [
		{
			id: "stat-properties",
			value: 320,
			suffix: "+",
			icon: "properties",
			label: "Premium properties",
			description: "Landmark residences across our curated portfolio.",
		},
		{
			id: "stat-cities",
			value: 28,
			suffix: "+",
			icon: "cities",
			label: "Cities worldwide",
		},
		{
			id: "stat-investors",
			value: 8500,
			suffix: "+",
			icon: "investors",
			label: "Global investors",
			description: "A community that spans continents and generations.",
		},
		{
			id: "stat-aum",
			value: 1.2,
			prefix: "$",
			suffix: "B",
			decimals: 1,
			icon: "aum",
			label: "Assets under management",
		},
		{
			id: "stat-countries",
			value: 24,
			icon: "countries",
			label: "Countries",
		},
		{
			id: "stat-experience",
			value: 15,
			suffix: "+",
			icon: "experience",
			label: "Years of experience",
			description: "Decades of disciplined, long-term stewardship.",
		},
	],
}
