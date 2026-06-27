/**
 * Vision & Roadmap content model.
 * Production sources this from Sanity; here we ship typed placeholders.
 */

export type RoadmapImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
};

export type RoadmapMilestone = {
	id: string;
	year: string;
	title: string;
	description: string;
	image?: RoadmapImage;
};

export type VisionRoadmapContent = {
	eyebrow: string;
	heading: string;
	description: string;
	milestones: RoadmapMilestone[];
};

export const visionRoadmapContent: VisionRoadmapContent = {
	eyebrow: "Vision & Roadmap",
	heading: "Building the future of ownership",
	description:
		"A deliberate path from a single foundation to a global ecosystem — each stage measured, each ambition grounded in what we have already delivered.",
	milestones: [
		{
			id: "milestone-foundation",
			year: "2019",
			title: "Foundation",
			description:
				"The platform is established on a principle of disciplined, transparent ownership and a long-term view.",
		},
		{
			id: "milestone-developments",
			year: "2021",
			title: "Premium Developments",
			description:
				"A curated portfolio of landmark residences takes shape across the first wave of flagship cities.",
			image: {
				src: "/images/roadmap/developments.jpg",
				alt: "Architectural model of a premium residential development",
				width: 1280,
				height: 800,
			},
		},
		{
			id: "milestone-ownership",
			year: "2023",
			title: "Digital Ownership",
			description:
				"Ownership becomes fully digital — transparent records, streamlined transfers, and clarity at every step.",
		},
		{
			id: "milestone-expansion",
			year: "2025",
			title: "Global Expansion",
			description:
				"The platform extends across continents, opening access to a worldwide community of investors.",
			image: {
				src: "/images/roadmap/expansion.jpg",
				alt: "World map highlighting the platform's growing international presence",
				width: 1280,
				height: 800,
			},
		},
		{
			id: "milestone-ecosystem",
			year: "2027",
			title: "Future Ecosystem",
			description:
				"A connected ecosystem of services, partners, and tools — built around a single, trusted standard of ownership.",
			image: {
				src: "/images/roadmap/ecosystem.jpg",
				alt: "Abstract visualization of a connected digital ecosystem",
				width: 1280,
				height: 800,
			},
		},
	],
};
