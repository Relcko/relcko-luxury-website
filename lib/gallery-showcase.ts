/**
 * CMS-ready content model for the Gallery & Media Showcase.
 * Production sources this from Sanity; here we ship typed placeholders with
 * the exact shape the CMS returns. No hardcoded copy lives inside components.
 */

export type GalleryCategoryName =
	| "Architecture"
	| "Interiors"
	| "Lifestyle"
	| "Construction"
	| "Community"
	| "Design"

/** Controls the editorial masonry footprint on desktop. */
export type GallerySpan = "hero" | "tall" | "wide" | "standard"

export type GalleryImage = {
	src: string
	alt: string
	width: number
	height: number
	blurDataURL?: string
}

export type GalleryVideo = {
	src: string
	poster?: string
}

export type GalleryItemData = {
	id: string
	image: GalleryImage
	video?: GalleryVideo
	category: GalleryCategoryName
	caption: string
	href?: string
	span?: GallerySpan
}

export type GalleryShowcaseContent = {
	eyebrow: string
	heading: string
	description: string
	cta?: { label: string; href: string }
	items: GalleryItemData[]
}

/** Fallback blur placeholder when per-item blurDataURL isn't authored. */
const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

/** Typed placeholder content for development. */
export const galleryShowcaseContent: GalleryShowcaseContent = {
	eyebrow: "Gallery",
	heading: "A closer look at the craft",
	description:
		"An editorial study of the spaces, materials, and moments that define the portfolio — from architecture and interiors to the lives lived within.",
	cta: { label: "Explore the full gallery", href: "/gallery" },
	items: [
		{
			id: "gallery-architecture",
			span: "hero",
			category: "Architecture",
			caption: "Sculptural facades that hold the skyline",
			href: "/gallery",
			image: {
				src: "/images/gallery/architecture.jpg",
				alt: "Dusk view of a sculptural residential tower facade",
				width: 1600,
				height: 1200,
				blurDataURL: FALLBACK_BLUR,
			},
		},
		{
			id: "gallery-interiors",
			span: "standard",
			category: "Interiors",
			caption: "Interiors finished to the millimetre",
			href: "/gallery",
			image: {
				src: "/images/gallery/interiors.jpg",
				alt: "Warmly lit living room with bespoke joinery",
				width: 1200,
				height: 1200,
				blurDataURL: FALLBACK_BLUR,
			},
		},
		{
			id: "gallery-lifestyle",
			span: "tall",
			category: "Lifestyle",
			caption: "A daily rhythm of light and calm",
			href: "/gallery",
			image: {
				src: "/images/gallery/lifestyle.jpg",
				alt: "Resident enjoying a sunlit terrace overlooking the city",
				width: 1000,
				height: 1300,
				blurDataURL: FALLBACK_BLUR,
			},
		},
		{
			id: "gallery-construction",
			span: "standard",
			category: "Construction",
			caption: "Engineering held to a higher standard",
			href: "/gallery",
			video: { src: "/videos/gallery/construction.mp4" },
			image: {
				src: "/images/gallery/construction.jpg",
				alt: "Construction detail of a precision concrete structure",
				width: 1200,
				height: 900,
				blurDataURL: FALLBACK_BLUR,
			},
		},
		{
			id: "gallery-design",
			span: "wide",
			category: "Design",
			caption: "Materials chosen to age beautifully",
			href: "/gallery",
			image: {
				src: "/images/gallery/design.jpg",
				alt: "Close study of natural stone and brushed brass detailing",
				width: 1600,
				height: 900,
				blurDataURL: FALLBACK_BLUR,
			},
		},
		{
			id: "gallery-community",
			span: "standard",
			category: "Community",
			caption: "Spaces designed to bring people together",
			href: "/gallery",
			image: {
				src: "/images/gallery/community.jpg",
				alt: "Residents gathering in a landscaped communal courtyard",
				width: 1200,
				height: 900,
				blurDataURL: FALLBACK_BLUR,
			},
		},
		{
			id: "gallery-detail",
			span: "standard",
			category: "Design",
			caption: "Detail that rewards a second glance",
			href: "/gallery",
			image: {
				src: "/images/gallery/detail.jpg",
				alt: "Macro photograph of a refined architectural junction",
				width: 1200,
				height: 1200,
				blurDataURL: FALLBACK_BLUR,
			},
		},
	],
}
