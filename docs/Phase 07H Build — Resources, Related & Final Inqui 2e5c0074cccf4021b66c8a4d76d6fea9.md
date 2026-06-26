# Phase 07H Build — Resources, Related & Final Inquiry (Output)

<aside>
🎬

**Phase 07H — Project Resources, Related Projects & Final Inquiry.** The closing experience for every project page: three editorial blocks (Resources → Related Projects → Final Inquiry CTA) that leave visitors with a clear next step while keeping the editorial quality of the page. Placeholder content only, built on the frozen Phase 02 design system + Phase 03 motion. Delivered in **two parts** (this page = Part 1).

</aside>

<aside>
🤊

**Model gap + decision.** Resources need documents with file type/size, related cards need a per-project location, and the final inquiry needs CTAs + contact methods + a closing line — more than the frozen 07A model expresses. Per the standing rule I add **one optional additive field**, `Project.closingContent?: ProjectClosingData`, that **reuses existing types**: `ProjectDocument` (already has `fileType?`/`fileSize?`) for resources, and the existing related-project type `ProjectSummary` *wrapped* with a `location` string (the frozen `ProjectSummary`/`toSummary` are **not** modified). No existing `Project` field renamed/removed/retyped. The **Additive Optional Field Registry gets a 07H row**.

</aside>

<aside>
📄

**Files.** New: `components/project/resources/` (`ProjectResourcesSection.tsx`, `ResourcesDownloads.tsx`, `DownloadCard.tsx`, `index.ts`), `components/project/related/` (`RelatedProjectsSection.tsx`, `RelatedProjectCard.tsx`, `index.ts`), `components/project/final-inquiry/` (`FinalInquirySection.tsx`, `InquiryCTA.tsx`, `ContactOptions.tsx`, `index.ts`). **Edited:** `lib/project.ts` (additive types + builder), `components/project/ProjectLayout.tsx` (swap the closing slots), `components/project/index.ts` (barrel), and the registry page.

</aside>

<aside>
🔒

**Frozen-safe.** The three 07A closing components — `ProjectDownloads.tsx`, `RelatedProjects.tsx`, `ProjectFinalCTA.tsx` — are untouched on disk; only their imports/usages leave `ProjectLayout`. Resources keeps `id="downloads"` and Related keeps `id="related"`, so the sticky sidebar anchors and the frozen `PROJECT_SECTIONS` stay valid. Hero, Overview, Amenities, Gallery, Location, Investment all unchanged.

</aside>

<aside>
🧩

**Assumptions.** `@/components/ui` exports `Heading`, `Text` (tones `muted`/`subtle`/`accent`), `Button` (`variant`, `size`, `asChild`), `Badge`; `@/lib/animation` exports `staggerContainer`, `childVariants`, `reveal`; `cn` from `@/utils/cn`; `next/image` + `next/link`. `STATUS_LABELS` is the existing 07A status map. All content is placeholder — no working form, no email/backends; `tel:`/`mailto:`/route links only. If a name differs, only import lines change.

</aside>

---

## 1. `lib/project.ts` — additive types + placeholder builder

Appended after the existing `ProjectSummary`/`DownloadsInfo` declarations; existing types/fields untouched. **Reuses** `ProjectDocument` and `ProjectSummary`.

```tsx
// ────── Phase 07H — Resources, Related Projects & Final Inquiry (additive) ──────

// A single CTA link (label + destination). Kept minimal and reusable.
export type CTALink = {
	label: string
	href: string
}

// Reuses the existing ProjectDocument (id/title/href/fileType?/fileSize?).
export type ProjectResourcesContent = {
	eyebrow: string
	heading: string
	description?: string
	documents: ProjectDocument[]
}

// Reuses the existing related-project type (ProjectSummary) and adds the
// per-card location the closing brief requires — without modifying ProjectSummary.
export type RelatedProjectItem = {
	summary: ProjectSummary
	location: string
}

export type RelatedProjectsContent = {
	eyebrow: string
	heading: string
	items: RelatedProjectItem[]
}

export type ContactMethod = {
	id: string
	label: string
	value: string
	href: string
}

export type FinalInquiryData = {
	eyebrow: string
	heading: string
	closingStatement: string
	primaryCta: CTALink
	secondaryCta?: CTALink
	contactMethods: ContactMethod[]
}

export type ProjectClosingData = {
	resources: ProjectResourcesContent
	related: RelatedProjectsContent
	finalInquiry: FinalInquiryData
}
```

The single additive field on `Project` (placed after the existing `relatedProjects: ProjectSummary[]`):

```tsx
export type Project = {
	// …all existing fields unchanged…
	relatedProjects: ProjectSummary[]
	closingContent?: ProjectClosingData // 07H — additive, optional
	// …overviewContent?, amenitiesContent?, galleryContent?, locationContent?, investmentContent? …
}
```

Placeholder data + builder (generic, informational):

```tsx
const sharedResources: ProjectDocument[] = [
	{ id: "brochure", title: "Project brochure", href: "/downloads/brochure.pdf", fileType: "PDF", fileSize: "8.4 MB" },
	{ id: "floor-plans", title: "Floor plans", href: "/downloads/floor-plans.pdf", fileType: "PDF", fileSize: "4.2 MB" },
	{ id: "specifications", title: "Specifications", href: "/downloads/specifications.pdf", fileType: "PDF", fileSize: "1.8 MB" },
	{ id: "legal", title: "Legal overview", href: "/downloads/legal-overview.pdf", fileType: "PDF", fileSize: "2.6 MB" },
]

const sharedContactMethods: ContactMethod[] = [
	{ id: "call", label: "Call", value: "+000 0000 0000", href: "tel:+0000000000" },
	{ id: "email", label: "Email", value: "ownership@relcko.com", href: "mailto:ownership@relcko.com" },
	{ id: "visit", label: "Private viewing", value: "Book an appointment", href: "/contact" },
]

function buildClosingContent(project: Project, all: Project[]): ProjectClosingData {
	const related: RelatedProjectItem[] = all
		.filter((candidate) => candidate.slug !== project.slug)
		.slice(0, 3)
		.map((candidate) => ({
			summary: toSummary(candidate),
			location: `${candidate.location.city}, ${candidate.location.country}`,
		}))
	return {
		resources: {
			eyebrow: "Resources",
			heading: "Documents & downloads",
			description:
				"Everything you need to evaluate the opportunity in detail. Placeholder files — nothing is downloaded.",
			documents: sharedResources,
		},
		related: {
			eyebrow: "Related",
			heading: "More opportunities",
			items: related,
		},
		finalInquiry: {
			eyebrow: "Enquire",
			heading: `Begin your enquiry about ${project.title}`,
			closingStatement:
				"Speak with our ownership team to explore availability, ownership options, and the next steps — at your own pace.",
			primaryCta: { label: "Register your interest", href: "/contact" },
			secondaryCta: { label: "Explore more projects", href: "/projects" },
			contactMethods: sharedContactMethods,
		},
	}
}
```

Built in the existing post-build loop (where `relatedProjects` is already assigned), so the related items reuse the same summaries + each project's location:

```tsx
// existing loop — add the closingContent assignment alongside relatedProjects
for (const project of projects) {
	project.relatedProjects = allSummaries.filter((s) => s.slug !== project.slug)
	project.closingContent = buildClosingContent(project, projects) // 07H
}
```

<aside>
♻️

**Reuse, not duplication.** `resources.documents` is `ProjectDocument[]` (the existing type — already models file type + size). `related.items[].summary` is the existing `ProjectSummary` (the related-project type), wrapped with a `location` string so cards can show it without touching `ProjectSummary` or `toSummary`. Only genuinely new shapes (`CTALink`, `ContactMethod`, `FinalInquiryData`, and the three `*Content` wrappers) are added.

</aside>

---

## 2. `components/project/resources/DownloadCard.tsx` — pure resource card

```tsx
import { Heading, Text } from "@/components/ui"
import type { ProjectDocument } from "@/lib/project"
import { cn } from "@/utils/cn"

type DownloadCardProps = {
	resource: ProjectDocument
	className?: string
}

// Pure / SSR. Shows title + "type · size" meta and a placeholder download
// affordance. No functional download — the href points at a placeholder asset.
// (Prop is named `resource` to avoid shadowing the global `document`.)
export function DownloadCard({ resource, className }: DownloadCardProps) {
	const meta = [resource.fileType, resource.fileSize].filter(Boolean).join(" · ")
	return (
		<article
			className={cn(
				"flex h-full flex-col gap-3 rounded-2xl border border-border bg-bg-elevated p-5",
				className,
			)}
		>
			<div className="flex flex-col gap-1">
				<Heading level={4} size="sm">
					{resource.title}
				</Heading>
				{meta ? (
					<Text size="sm" tone="subtle">
						{meta}
					</Text>
				) : null}
			</div>
			<a
				href={resource.href}
				download
				className="mt-auto inline-flex items-center gap-2 text-sm text-accent-gold underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
			>
				Download
				<span aria-hidden="true">↓</span>
			</a>
		</article>
	)
}
```

---

## 3. `components/project/related/RelatedProjectCard.tsx` — pure related card

```tsx
import Image from "next/image"
import Link from "next/link"
import { Heading, Text, Badge } from "@/components/ui"
import { STATUS_LABELS, type RelatedProjectItem } from "@/lib/project"
import { cn } from "@/utils/cn"

const FALLBACK_BLUR =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

type RelatedProjectCardProps = {
	item: RelatedProjectItem
	className?: string
}

// Pure / SSR. Whole card is a single link (the CTA). Image, title, location,
// and an optional status Badge. Hover/scale guarded by motion-safe.
export function RelatedProjectCard({ item, className }: RelatedProjectCardProps) {
	const { summary, location } = item
	return (
		<article
			className={cn(
				"group h-full overflow-hidden rounded-3xl border border-border bg-bg-elevated",
				className,
			)}
		>
			<Link
				href={`/projects/${summary.slug}`}
				className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
			>
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={summary.heroImage.src}
						alt={summary.heroImage.alt}
						fill
						loading="lazy"
						placeholder="blur"
						blurDataURL={summary.heroImage.blurDataURL ?? FALLBACK_BLUR}
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
					/>
					{summary.status ? (
						<div className="absolute left-4 top-4">
							<Badge>{STATUS_LABELS[summary.status]}</Badge>
						</div>
					) : null}
				</div>
				<div className="flex flex-1 flex-col gap-2 p-5">
					<Heading
						level={4}
						size="sm"
						className="transition-colors group-hover:text-accent-gold group-focus-visible:text-accent-gold"
					>
						{summary.title}
					</Heading>
					<Text size="sm" tone="muted">
						{location}
					</Text>
					<Text size="sm" tone="accent" className="mt-auto inline-flex items-center gap-1">
						View project
						<span aria-hidden="true" className="transition-transform motion-safe:group-hover:translate-x-1">
							→
						</span>
					</Text>
				</div>
			</Link>
		</article>
	)
}
```

---

## 4. `components/project/final-inquiry/ContactOptions.tsx` — pure contact methods

```tsx
import { Text } from "@/components/ui"
import type { ContactMethod } from "@/lib/project"
import { cn } from "@/utils/cn"

type ContactOptionsProps = {
	methods: ContactMethod[]
	className?: string
}

// Pure / SSR. Contact methods as accessible links (tel:/mailto:/route) — no
// form, no email service. Renders nothing when empty.
export function ContactOptions({ methods, className }: ContactOptionsProps) {
	if (methods.length === 0) return null
	return (
		<ul className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center", className)}>
			{methods.map((method) => (
				<li key={method.id}>
					<a
						href={method.href}
						className="flex flex-col items-center gap-0.5 rounded-2xl border border-border bg-bg-base px-5 py-3 transition-colors hover:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
					>
						<Text size="sm" tone="subtle" className="uppercase tracking-[0.16em]">
							{method.label}
						</Text>
						<Text size="sm" className="text-text-primary">
							{method.value}
						</Text>
					</a>
				</li>
			))}
		</ul>
	)
}
```

---

## 5. `components/project/final-inquiry/InquiryCTA.tsx` — pure primary/secondary CTA

```tsx
import Link from "next/link"
import { Button } from "@/components/ui"
import type { CTALink } from "@/lib/project"
import { cn } from "@/utils/cn"

type InquiryCTAProps = {
	primary: CTALink
	secondary?: CTALink
	className?: string
}

// Pure / SSR. Reuses the Phase 02 Button (asChild -> next/link) for focus ring
// and routing. Secondary is optional.
export function InquiryCTA({ primary, secondary, className }: InquiryCTAProps) {
	return (
		<div className={cn("flex flex-col gap-3 sm:flex-row sm:justify-center", className)}>
			<Button asChild variant="primary" size="lg">
				<Link href={primary.href}>{primary.label}</Link>
			</Button>
			{secondary ? (
				<Button asChild variant="secondary" size="lg">
					<Link href={secondary.href}>{secondary.label}</Link>
				</Button>
			) : null}
		</div>
	)
}
```

<aside>
⏭️

Part 2 (next) appends `ResourcesDownloads`, the three section orchestrators (`ProjectResourcesSection`, `RelatedProjectsSection`, `FinalInquirySection`), the three barrels, the `ProjectLayout` + main-barrel integration, the registry update, and the deliverable explanations.

</aside>

---

## 6. `components/project/resources/ResourcesDownloads.tsx` — resource grid (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants } from "@/lib/animation"
import type { ProjectDocument } from "@/lib/project"
import { cn } from "@/utils/cn"
import { DownloadCard } from "./DownloadCard"

type ResourcesDownloadsProps = {
	documents: ProjectDocument[]
	className?: string
}

// Staggered grid of resource cards (card reveal). Inherits "visible" from the
// section; renders nothing when empty.
export function ResourcesDownloads({ documents, className }: ResourcesDownloadsProps) {
	if (documents.length === 0) return null
	return (
		<motion.ul
			variants={staggerContainer}
			className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
		>
			{documents.map((resource) => (
				<motion.li key={resource.id} variants={childVariants}>
					<DownloadCard resource={resource} />
				</motion.li>
			))}
		</motion.ul>
	)
}
```

---

## 7. `components/project/resources/ProjectResourcesSection.tsx` — Resources block (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { ProjectResourcesContent } from "@/lib/project"
import { cn } from "@/utils/cn"
import { ResourcesDownloads } from "./ResourcesDownloads"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type ProjectResourcesSectionProps = {
	content: ProjectResourcesContent
	className?: string
}

// Block 1 of the closing experience. Keeps id="downloads" so the frozen
// PROJECT_SECTIONS sidebar anchor still resolves. Single whileInView trigger.
export function ProjectResourcesSection({ content, className }: ProjectResourcesSectionProps) {
	return (
		<motion.section
			id="downloads"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<motion.span
						variants={childVariants}
						className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold"
					>
						{content.eyebrow}
					</motion.span>
					<motion.div variants={reveal}>
						<Heading level={2} size="xl" className="text-balance">
							{content.heading}
						</Heading>
					</motion.div>
					{content.description ? (
						<motion.div variants={childVariants}>
							<Text tone="muted" className="max-w-2xl">
								{content.description}
							</Text>
						</motion.div>
					) : null}
				</div>
				<ResourcesDownloads documents={content.documents} />
			</div>
		</motion.section>
	)
}
```

---

## 8. `components/project/related/RelatedProjectsSection.tsx` — Related block (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants, reveal } from "@/lib/animation"
import { Heading } from "@/components/ui"
import type { RelatedProjectsContent } from "@/lib/project"
import { cn } from "@/utils/cn"
import { RelatedProjectCard } from "./RelatedProjectCard"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type RelatedProjectsSectionProps = {
	content: RelatedProjectsContent
	className?: string
}

// Block 2 of the closing experience. Keeps id="related" for the sidebar anchor.
// Cards reveal on a stagger; renders nothing when there are no items.
export function RelatedProjectsSection({ content, className }: RelatedProjectsSectionProps) {
	if (content.items.length === 0) return null
	return (
		<motion.section
			id="related"
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn("scroll-mt-28 border-t border-border/60 py-16 md:py-24", className)}
		>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<motion.span
						variants={childVariants}
						className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold"
					>
						{content.eyebrow}
					</motion.span>
					<motion.div variants={reveal}>
						<Heading level={2} size="xl" className="text-balance">
							{content.heading}
						</Heading>
					</motion.div>
				</div>
				<motion.ul
					variants={staggerContainer}
					className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					{content.items.map((item) => (
						<motion.li key={item.summary.id} variants={childVariants}>
							<RelatedProjectCard item={item} />
						</motion.li>
					))}
				</motion.ul>
			</div>
		</motion.section>
	)
}
```

---

## 9. `components/project/final-inquiry/FinalInquirySection.tsx` — Final Inquiry block (client)

```tsx
"use client"

import { motion } from "framer-motion"
import { staggerContainer, childVariants, reveal } from "@/lib/animation"
import { Heading, Text } from "@/components/ui"
import type { FinalInquiryData } from "@/lib/project"
import { cn } from "@/utils/cn"
import { InquiryCTA } from "./InquiryCTA"
import { ContactOptions } from "./ContactOptions"

const VIEWPORT = { once: true, margin: "-12% 0px" } as const

type FinalInquirySectionProps = {
	content: FinalInquiryData
	className?: string
}

// Block 3 — the refined closing CTA. Full-width centred panel (no anchor; it
// sits outside the section nav, like the frozen ProjectFinalCTA it replaces).
export function FinalInquirySection({ content, className }: FinalInquirySectionProps) {
	return (
		<motion.section
			aria-label={content.heading}
			variants={staggerContainer}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT}
			className={cn(
				"scroll-mt-28 rounded-3xl border border-border bg-bg-elevated p-8 text-center md:p-14",
				className,
			)}
		>
			<div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
				<motion.span
					variants={childVariants}
					className="font-display-sans text-sm uppercase tracking-[0.28em] text-accent-gold"
				>
					{content.eyebrow}
				</motion.span>
				<motion.div variants={reveal}>
					<Heading level={2} size="xl" className="text-balance">
						{content.heading}
					</Heading>
				</motion.div>
				<motion.div variants={childVariants}>
					<Text tone="muted" className="text-balance">
						{content.closingStatement}
					</Text>
				</motion.div>
				<motion.div variants={reveal} className="w-full">
					<InquiryCTA primary={content.primaryCta} secondary={content.secondaryCta} />
				</motion.div>
				<motion.div variants={childVariants} className="w-full">
					<ContactOptions methods={content.contactMethods} />
				</motion.div>
			</div>
		</motion.section>
	)
}
```

---

## 10. Barrels — one per new directory

`components/project/resources/index.ts`:

```tsx
export { ProjectResourcesSection } from "./ProjectResourcesSection"
export { ResourcesDownloads } from "./ResourcesDownloads"
export { DownloadCard } from "./DownloadCard"
```

`components/project/related/index.ts`:

```tsx
export { RelatedProjectsSection } from "./RelatedProjectsSection"
export { RelatedProjectCard } from "./RelatedProjectCard"
```

`components/project/final-inquiry/index.ts`:

```tsx
export { FinalInquirySection } from "./FinalInquirySection"
export { InquiryCTA } from "./InquiryCTA"
export { ContactOptions } from "./ContactOptions"
```

---

## 11. `ProjectLayout.tsx` — integrate the closing experience (the 07A render edit)

Swaps the three frozen closing slots (`ProjectDownloads`, `RelatedProjects`, `ProjectFinalCTA`) for the new sections. Resources + Related sit in the main content column (preserving the `#downloads` / `#related` anchors); the Final Inquiry is the full-width closing panel. With the last dynamic import gone, `next/dynamic` + `SectionFallback` are removed (no unused symbols). Full file:

```tsx
import { Container } from "@/components/ui"
import type { Project, ProjectSummary } from "@/lib/project"
import { ProjectBreadcrumb } from "./ProjectBreadcrumb"
import { ProjectHero } from "./hero"
import { QuickFacts } from "./QuickFacts"
import { ProjectOverviewSection } from "./overview"
import { ProjectAmenitiesSection } from "./amenities"
import { ProjectGallerySection } from "./gallery"
import { ProjectLocationSection } from "./location"
import { ProjectInvestmentSection } from "./investment"
import { ProjectResourcesSection } from "./resources"
import { RelatedProjectsSection } from "./related"
import { FinalInquirySection } from "./final-inquiry"
import { ProjectSidebar } from "./ProjectSidebar"

type ProjectLayoutProps = {
	project: Project
	previous?: ProjectSummary
	next?: ProjectSummary
}

export function ProjectLayout({ project, previous, next }: ProjectLayoutProps) {
	const crumbs = [
		{ label: "Home", href: "/" },
		{ label: "Projects", href: "/projects" },
		{ label: project.title },
	]
	const closing = project.closingContent
	return (
		<main className="bg-bg-base pb-24">
			{/* Full-bleed hero — intentionally OUTSIDE the content Container */}
			<ProjectHero project={project} />

			<Container size="max">
				<div className="flex flex-col gap-8 pt-8 md:pt-10">
					<ProjectBreadcrumb items={crumbs} />
					<QuickFacts items={project.quickFacts} />
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem]">
						<div className="flex flex-col">
							{project.overviewContent ? (
								<ProjectOverviewSection content={project.overviewContent} />
							) : null}
							{project.amenitiesContent ? (
								<ProjectAmenitiesSection content={project.amenitiesContent} />
							) : null}
							{project.galleryContent ? (
								<ProjectGallerySection content={project.galleryContent} />
							) : null}
							{project.locationContent ? (
								<ProjectLocationSection
									content={project.locationContent}
									location={project.location}
								/>
							) : null}
							{project.investmentContent ? (
								<ProjectInvestmentSection content={project.investmentContent} />
							) : null}
							{/* 07H — Resources + Related replace the frozen Downloads + Related slots */}
							{closing ? (
								<>
									<ProjectResourcesSection content={closing.resources} />
									<RelatedProjectsSection content={closing.related} />
								</>
							) : null}
						</div>
						<ProjectSidebar
							previous={previous}
							next={next}
							className="order-first lg:order-none lg:sticky lg:top-28 lg:h-fit"
						/>
					</div>
					{/* 07H — Final Inquiry replaces the frozen ProjectFinalCTA */}
					{closing ? <FinalInquirySection content={closing.finalInquiry} /> : null}
				</div>
			</Container>
		</main>
	)
}
```

<aside>
🔒

**Frozen-safe.** `ProjectDownloads.tsx`, `RelatedProjects.tsx`, and `ProjectFinalCTA.tsx` (07A) stay on disk — only their imports/usages leave `ProjectLayout`. Final running order: Overview → Amenities → Gallery → Location → Investment → **Resources** → **Related** (in the main column) → **Final Inquiry** (full-width), with the sticky sidebar unchanged.

</aside>

---

## 12. `components/project/index.ts` — re-export the three new groups (edit)

Append to the existing barrel (all existing exports left as-is):

```tsx
// …existing exports unchanged…
export * from "./location"
export * from "./investment"
export * from "./resources"
export * from "./related"
export * from "./final-inquiry"
```

---

## 13. Deliverable 3 — Component hierarchy

```jsx
ProjectLayout (end of page)
 ├── [main column] ProjectResourcesSection   (client: motion.section #downloads)
 │    └── ResourcesDownloads              (client: <ul>, card stagger)
 │         └── DownloadCard               (pure: <article>, title + type·size + link)
 ├── [main column] RelatedProjectsSection    (client: motion.section #related)
 │    └── RelatedProjectCard            (pure: <article><Link>, image/title/location/status/CTA)
 └── [full width] FinalInquirySection        (client: motion.section, centred)
      ├── InquiryCTA                     (pure: primary + optional secondary Button->Link)
      └── ContactOptions                 (pure: tel:/mailto:/route links)
```

- **8 components** across three folders. The five leaf components (`DownloadCard`, `RelatedProjectCard`, `InquiryCTA`, `ContactOptions`, plus the SSR markup) are **pure**; motion lives only in the three section shells + `ResourcesDownloads`.
- **Heading hierarchy**: Hero `h1` → each section `h2` (Resources / Related / Final Inquiry headings) → `h4` on each `DownloadCard` and `RelatedProjectCard` title (consistent with the other 07x card components).

## 14. Deliverable 4 — CMS bindings

- One optional additive field: `Project.closingContent?: ProjectClosingData` — **no duplicate models, no changed/removed fields**.
- **Reuses existing types**: `closingContent.resources.documents` is `ProjectDocument[]` (already carries `fileType?`/`fileSize?`); `closingContent.related.items[].summary` is the existing `ProjectSummary` (related-project type), wrapped with a `location` string so the frozen `ProjectSummary`/`toSummary` are untouched.
- Field-by-field: `resources` (`eyebrow`/`heading`/`description?`/`documents[]`) → `ProjectResourcesSection` → `ResourcesDownloads` → `DownloadCard`; `related` (`eyebrow`/`heading`/`items[]`) → `RelatedProjectsSection` → `RelatedProjectCard`; `finalInquiry` (`eyebrow`/`heading`/`closingStatement`/`primaryCta`/`secondaryCta?`/`contactMethods[]`) → `FinalInquirySection` → `InquiryCTA` + `ContactOptions`.
- **No hardcoded content** — every string/asset comes from data; placeholders live in `buildClosingContent(project, projects)`, computed in the same post-build loop that already wires `relatedProjects`. Swap the placeholder block for a Sanity fetch returning this shape and nothing else changes.
- `closingContent` is **optional** → records without it still type-check; `ProjectLayout` guards every render; `ResourcesDownloads`, `RelatedProjectsSection`, and `ContactOptions` each no-op on empty data.

## 15. Deliverable 5 — Animation approach (Phase 03 only)

- **One trigger per block**: each of the three sections is its own `whileInView` (`once: true`) and propagates `"visible"` to descendants declaring `variants` (no child sets its own `initial`/`animate`).
- **Fade-up** = `childVariants` (eyebrows, descriptions, contact methods). **Stagger reveal** = `staggerContainer` on the section + nested lists. **Card reveal** = nested `staggerContainer` on the resources grid and the related-cards grid (each card a `childVariants` item). **CTA reveal** = `reveal` mask wrapping the heading and the `InquiryCTA`. All composed from existing Phase 03 variants — **no new infrastructure**, no parallax, no pinning.
- **Reduced motion**: handled globally by Phase 03's `MotionConfig reducedMotion="user"` — transforms/masks collapse; the `motion-safe:` hover/scale on related cards is disabled; content stays fully visible.

## 16. Deliverable 7 — Responsive behavior (zero CLS)

- **Mobile (`<640`)**: single column — resource cards one-up, related cards one-up, CTA buttons and contact methods stacked; generous `py-16` rhythm between blocks.
- **Tablet (`640–1023`)**: resources two-up (`sm:grid-cols-2`), related two-up, CTA + contact methods go horizontal (`sm:flex-row`).
- **Desktop (`≥1024`)**: the three editorial blocks read top-to-bottom with full rhythm — resources four-up (`lg:grid-cols-4`), related three-up (`lg:grid-cols-3`), Final Inquiry a centred full-width panel.
- **Zero CLS / lightweight**: every image (`RelatedProjectCard`) uses `next/image` `fill` in a fixed `4/3` box with blur placeholder + responsive `sizes`; Resources/Final Inquiry are text + bordered panels (nothing to lazy-load); `h-full` equalises card heights; `scroll-mt-28` keeps the `#downloads` / `#related` anchors clean.

## 17. Verify & QA

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- [ ]  All three closing blocks render in order on every project route
- [ ]  Resources show title + file type + size; "Download" link is focusable (placeholder, no real file needed)
- [ ]  3 related cards show image, title, location, status badge, and act as the CTA link
- [ ]  Final Inquiry shows primary + secondary CTA, closing statement, and contact methods (tel:/[mailto:/route](mailto:/route))
- [ ]  No form, no email/backend, no wallet/payment/auth
- [ ]  Sidebar `Downloads` + `Related` anchors still scroll correctly
- [ ]  Heading order: h1 → h2 → h4
- [ ]  `prefers-reduced-motion`: no transform/mask/hover-scale; content fully visible
- [ ]  Zero ESLint / TS errors

<aside>
🧩

**Assumptions to reconcile:** `@/components/ui` (`Heading`, `Text` with `subtle`/`muted`/`accent` tones, `Button` with `asChild`, `Badge`), `@/lib/animation` (`staggerContainer`, `childVariants`, `reveal`), `cn` from `@/utils/cn`, `next/image` + `next/link`, and the existing `STATUS_LABELS`. All content is placeholder. If a name differs, only import lines change.

</aside>

<aside>
🛑

**STOP — Phase 07H complete (and with it the full Project detail experience, 07A–07H). Awaiting approval before Phase 08.** I author these as Notion pages but can't run `lint`/`tsc`/`build` myself — run the verify block and paste any errors and I'll fix the exact file(s).

</aside>