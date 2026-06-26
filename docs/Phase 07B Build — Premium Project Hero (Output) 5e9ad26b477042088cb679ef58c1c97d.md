# Phase 07B Build — Premium Project Hero (Output)

---

## 18. Layout adjustment — `ProjectHero` moved full-bleed (supersedes §12 placement)

Layout-only change to **`components/project/ProjectLayout.tsx`**: `ProjectHero` now renders **outside** the content `Container` (so it spans the full viewport width), while the breadcrumb, quick facts, the 2-column body, and the final CTA stay **inside** the existing `Container`. No hero component is touched and the `Project` data model is unchanged — only `ProjectLayout`'s JSX structure moves. The breadcrumb now sits just below the full-bleed hero (the first element inside the container).

```tsx
import dynamic from "next/dynamic"
import { Container } from "@/components/ui"
import type { Project, ProjectSummary } from "@/lib/project"
import { ProjectBreadcrumb } from "./ProjectBreadcrumb"
import { ProjectHero } from "./hero"
import { QuickFacts } from "./QuickFacts"
import { ProjectOverview } from "./ProjectOverview"
import { ProjectHighlights } from "./ProjectHighlights"
import { ProjectAmenities } from "./ProjectAmenities"
import { ProjectInvestment } from "./ProjectInvestment"
import { ProjectDownloads } from "./ProjectDownloads"
import { ProjectFinalCTA } from "./ProjectFinalCTA"
import { ProjectSidebar } from "./ProjectSidebar"

// Height-reserving fallback keeps layout shift at zero while a section loads.
function SectionFallback({ label }: { label: string }) {
	return (
		<div
			aria-hidden="true"
			data-loading={label}
			className="min-h-[16rem] animate-pulse rounded-2xl border border-border bg-bg-elevated"
		/>
	)
}

// Below-the-fold sections are dynamically imported → smaller initial bundle,
// lazy hydration, placeholder fallbacks. (No ssr:false → still SSR'd, zero CLS.)
const ProjectLocation = dynamic(
	() => import("./ProjectLocation").then((m) => m.ProjectLocation),
	{ loading: () => <SectionFallback label="location" /> },
)
const ProjectGallery = dynamic(
	() => import("./ProjectGallery").then((m) => m.ProjectGallery),
	{ loading: () => <SectionFallback label="gallery" /> },
)
const RelatedProjects = dynamic(
	() => import("./RelatedProjects").then((m) => m.RelatedProjects),
	{ loading: () => <SectionFallback label="related" /> },
)

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
	return (
		<main className="bg-bg-base pb-24">
			{/* Full-bleed hero — intentionally OUTSIDE the content Container */}
			<ProjectHero project={project} />

			{/* Everything else stays within the existing Container */}
			<Container size="max">
				<div className="flex flex-col gap-8 pt-8 md:pt-10">
					<ProjectBreadcrumb items={crumbs} />
					<QuickFacts items={project.quickFacts} />
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem]">
						<div className="flex flex-col">
							<ProjectOverview overview={project.overview} />
							<ProjectHighlights highlights={project.highlights} />
							<ProjectAmenities amenities={project.amenities} />
							<ProjectLocation location={project.location} />
							<ProjectGallery images={project.media.gallery} />
							<ProjectInvestment investment={project.investment} />
							<ProjectDownloads downloads={project.downloads} />
							<RelatedProjects projects={project.relatedProjects} />
						</div>
						<ProjectSidebar
							previous={previous}
							next={next}
							className="order-first lg:order-none lg:sticky lg:top-28 lg:h-fit"
						/>
					</div>
					<ProjectFinalCTA project={project} />
				</div>
			</Container>
		</main>
	)
}
```

<aside>
🔒

**What changed vs. what's frozen.** The *only* edit is `ProjectLayout`'s JSX: the hero left the `Container` and the breadcrumb dropped to just under it; `main` lost its top padding (the hero now owns the top edge) and the inner stack gained `pt-8 md:pt-10`. **Unchanged:** all 9 hero components, every 07A section component, the `Project` data model, section order, the 2-column grid, the sticky sidebar, and the dynamic imports.

</aside>

<aside>
🧩

**One visual note (no action needed):** because the hero components are frozen, `ProjectHero` keeps its `rounded-3xl border` treatment. Full-bleed, that rounding/border now meets the screen edges. If you later want truly flush edges, that's a one-line tweak *inside* `ProjectHero` (drop `rounded-3xl border border-border`) — I left it untouched to honor “no changes to the Hero components.”

</aside>

<aside>
✅

**Layout adjustment complete.** `ProjectHero` is now full-bleed outside the content `Container`; the rest of the page remains inside `ProjectLayout`. Phase 07A architecture and all hero components are preserved. Run `npm run lint && npx tsc --noEmit && npm run build` to confirm.

</aside>