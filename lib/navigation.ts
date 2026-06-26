/**
 * Navigation data — CMS-ready menu structure.
 */
export type NavLink = {
	label: string
	href: string
}

export type MegaColumn = {
	heading: string
	links: NavLink[]
}

export type MegaFeatured = {
	title: string
	description: string
	href: string
	image: string
	imageAlt: string
}

export type NavItemData = {
	id: string
	label: string
	href: string
	megaMenu?: {
		columns: MegaColumn[]
		featured: MegaFeatured
	}
}

// Placeholder data — shaped to be replaced 1:1 by a CMS query later.
export const navItems: NavItemData[] = [
	{
		id: "projects",
		label: "Projects",
		href: "/projects",
		megaMenu: {
			columns: [
				{
					heading: "By Status",
					links: [
						{ label: "Ready to Move", href: "/projects?status=ready" },
						{ label: "Under Construction", href: "/projects?status=building" },
						{ label: "New Launches", href: "/projects?status=launch" },
					],
				},
				{
					heading: "By Type",
					links: [
						{ label: "Apartments", href: "/projects?type=apartments" },
						{ label: "Villas", href: "/projects?type=villas" },
						{ label: "Penthouses", href: "/projects?type=penthouses" },
					],
				},
				{
					heading: "By City",
					links: [
						{ label: "Mumbai", href: "/projects?city=mumbai" },
						{ label: "Goa", href: "/projects?city=goa" },
						{ label: "Dubai", href: "/projects?city=dubai" },
					],
				},
			],
			featured: {
				title: "Azure Bay Residences",
				description: "Limited waterfront collection — now previewing.",
				href: "/projects/azure-bay",
				image: "/images/nav/projects.jpg",
				imageAlt: "Azure Bay Residences waterfront facade",
			},
		},
	},
	{
		id: "communities",
		label: "Communities",
		href: "/communities",
		megaMenu: {
			columns: [
				{
					heading: "Featured",
					links: [
						{ label: "Marina District", href: "/communities/marina" },
						{ label: "Hillside Estates", href: "/communities/hillside" },
						{ label: "Coastal Greens", href: "/communities/coastal" },
					],
				},
				{
					heading: "Lifestyle",
					links: [
						{ label: "Waterfront Living", href: "/communities?lifestyle=waterfront" },
						{ label: "Golf & Leisure", href: "/communities?lifestyle=golf" },
						{ label: "Wellness", href: "/communities?lifestyle=wellness" },
					],
				},
			],
			featured: {
				title: "Marina District",
				description: "A waterfront neighbourhood designed around the promenade.",
				href: "/communities/marina",
				image: "/images/nav/communities.jpg",
				imageAlt: "Marina District promenade at dusk",
			},
		},
	},
	{
		id: "about",
		label: "About",
		href: "/about",
		megaMenu: {
			columns: [
				{
					heading: "Company",
					links: [
						{ label: "Our Story", href: "/about/story" },
						{ label: "Leadership", href: "/about/leadership" },
						{ label: "Careers", href: "/about/careers" },
					],
				},
				{
					heading: "Approach",
					links: [
						{ label: "Design Philosophy", href: "/about/design" },
						{ label: "Sustainability", href: "/about/sustainability" },
						{ label: "Craftsmanship", href: "/about/craft" },
					],
				},
			],
			featured: {
				title: "The Lumière Standard",
				description: "How we design, build, and deliver enduring value.",
				href: "/about/standard",
				image: "/images/nav/about.jpg",
				imageAlt: "Architectural detail of a Lumière residence",
			},
		},
	},
	{
		id: "contact",
		label: "Contact",
		href: "/contact",
		megaMenu: {
			columns: [
				{
					heading: "Get in touch",
					links: [
						{ label: "Sales Enquiries", href: "/contact?topic=sales" },
						{ label: "Schedule a Visit", href: "/contact?topic=visit" },
						{ label: "Press", href: "/contact?topic=press" },
					],
				},
				{
					heading: "Offices",
					links: [
						{ label: "Mumbai", href: "/contact/mumbai" },
						{ label: "Dubai", href: "/contact/dubai" },
					],
				},
			],
			featured: {
				title: "Visit the Gallery",
				description: "Experience materials and finishes in person.",
				href: "/contact/gallery",
				image: "/images/nav/contact.jpg",
				imageAlt: "Lumière experience gallery interior",
			},
		},
	},
]
