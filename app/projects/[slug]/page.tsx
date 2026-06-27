import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import {
  ProjectSection,
  ProjectBreadcrumb,
  QuickFacts,
  ProjectHero,
  ProjectOverview,
  ProjectHighlights,
  AmenitiesContent,
  ProjectGallery,
  ProjectLocation,
  ProjectInvestment,
  ProjectResources,
} from "@/components/project";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all project slugs (static generation)
 */
export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for each project detail page
 */
export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.seo.title,
    description: project.seo.description,
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      images: [project.seo.ogImage],
    },
  };
}

/**
 * Project Detail Page — Phases 07A–07H Complete Implementation
 *
 * Composites all project detail sections:
 * - 07A: ProjectSection, ProjectBreadcrumb, QuickFacts
 * - 07B: ProjectHero (cinematic hero with media)
 * - 07C: ProjectOverview + ProjectHighlights
 * - 07D: AmenitiesContent
 * - 07E: ProjectGallery
 * - 07F: ProjectLocation
 * - 07G: ProjectInvestment
 * - 07H: ProjectResources
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // 404 if project not found
  if (!project) {
    notFound();
  }

  return (
    <main>
      {/* 07A: Breadcrumb navigation */}
      <section className="pt-24 pb-0">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ProjectBreadcrumb
            items={[
              { label: "Projects", href: "/projects" },
              { label: project.title, href: `/projects/${slug}` },
            ]}
          />
        </div>
      </section>

      {/* 07B: Cinematic Project Hero */}
      <ProjectHero project={project} />

      {/* Quick facts grid */}
      <section className="pb-0">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <QuickFacts project={project} />
        </div>
      </section>

      {/* 07C: Project Overview & Highlights */}
      <ProjectSection id="overview" title="Overview">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProjectOverview project={project} />
          <ProjectHighlights project={project} />
        </div>
      </ProjectSection>

      {/* 07D: Amenities & Lifestyle */}
      <ProjectSection id="amenities" title="Amenities">
        <AmenitiesContent features={project.features} />
      </ProjectSection>

      {/* 07E: Immersive Gallery & Media */}
      <ProjectSection id="gallery" title="Gallery">
        <ProjectGallery media={project.media} />
      </ProjectSection>

      {/* 07F: Location & Connectivity */}
      <ProjectSection id="location" title="Location">
        <ProjectLocation location={project.location} />
      </ProjectSection>

      {/* 07G: Investment & Digital Ownership */}
      <ProjectSection id="investment" title="Investment">
        <ProjectInvestment
          pricing={project.pricing}
          ownershipModel={project.ownershipModel}
        />
      </ProjectSection>

      {/* 07H: Resources, Related Projects & Final Inquiry */}
      <ProjectSection id="resources" title="Resources">
        <ProjectResources project={project} />
      </ProjectSection>
    </main>
  );
}
