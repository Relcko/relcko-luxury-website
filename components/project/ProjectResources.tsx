"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, MediaDocument } from "@/lib/project";
import { fadeVariants, revealVariants } from "@/lib/animation";
import { Container, Section, Heading, Text, Button } from "@/components/ui";

export type ProjectResourcesProps = {
  project: Project;
  className?: string;
};

/**
 * Format file size for display.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * ProjectResources displays floor plans,brochures, and related projects,
 * culminating in a final inquiry CTA.
 */
export function ProjectResources({ project, className }: ProjectResourcesProps) {
  const hasFloorPlans = project.media.floorPlans && project.media.floorPlans.length > 0;
  const hasVirtualTour = project.media.virtualTourUrl;

  return (
    <Section className={className}>
      <Container>
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="text-center"
        >
          <Text
            as="span"
            className="mb-4 font-display-sans text-xs uppercase tracking-[0.24em] text-accent"
          >
            Resources
          </Text>
          <Heading level={2} size="xl" className="max-w-[32ch]">
            Explore Further
          </Heading>
        </motion.div>
      </Container>

      {/* Floor Plans & Documents */}
      {hasFloorPlans && (
        <Container className="mt-12">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
{project.media.floorPlans?.map((doc) => (
              <DocumentCard key={doc.url} document={doc} />
            ))}
          </motion.div>
        </Container>
      )}

      {/* Virtual Tour CTA */}
      {hasVirtualTour && (
        <Container className="mt-12">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="rounded-2xl border border-border bg-bg-elevated p-8 text-center"
          >
            <p className="mb-4 text-4xl">🎯</p>
            <Heading level={3} size="lg">
              Virtual Tour Available
            </Heading>
            <Text className="mt-4 text-text-secondary">
              Experience this property from anywhere with our immersive virtual tour.
            </Text>
            <Button asChild size="lg" className="mt-6">
              <a href={project.media.virtualTourUrl} target="_blank" rel="noopener">
                Launch Virtual Tour
              </a>
            </Button>
          </motion.div>
        </Container>
      )}

      {/* Related Projects */}
      <Container className="mt-16">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          <Text
            as="span"
            className="mb-8 block font-display-sans text-xs uppercase tracking-[0.24em] text-accent"
          >
            Related Properties
          </Text>
          <div className="grid gap-6 md:grid-cols-3">
            <RelatedProjectCard
              title="Marina Bay Resort"
              category="Hospitality"
              slug="marina-bay-resort"
            />
            <RelatedProjectCard
              title="Urban Central Tower"
              category="Mixed-Use"
              slug="urban-central-tower"
            />
            <RelatedProjectCard
              title="Skyline Business Center"
              category="Commercial"
              slug="skyline-business-center"
            />
          </div>
        </motion.div>
      </Container>

      {/* Final Inquiry CTA */}
      <Container className="mt-16">
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className=" rounded-2xl border border-border bg-bg-elevated p-8 text-center lg:p-12"
        >
          <p className="mb-4 text-4xl">🏠</p>
          <Heading level={2} size="xl">
            Ready to Make It Yours?
          </Heading>
          <Text className="mx-auto mt-4 max-w-[48ch] text-lg text-text-secondary">
            Schedule a private viewing or request more information about{" "}
            {project.title}. Our team is ready to assist you.
          </Text>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <a href="/contact">Schedule Viewing</a>
            </Button>
<Button asChild variant="secondary" size="lg">
              <Link href="/news">Explore More Properties</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

/**
 * Document card for floor plans and brochures.
 */
function DocumentCard({ document }: { document: MediaDocument }) {
  return (
    <a
      href={document.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-border bg-bg-elevated p-4 transition-colors hover:border-accent"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-base text-lg">
        {document.type === "pdf" ? "📄" : "📝"}
      </span>
      <div className="flex-1">
        <p className="font-display-sans font-medium text-text-primary group-hover:text-accent">
          {document.title}
        </p>
        <p className="text-sm text-text-muted">
          {document.type.toUpperCase()} • {formatFileSize(document.fileSize)}
        </p>
      </div>
    </a>
  );
}

/**
 * Related project card.
 */
function RelatedProjectCard({
  title,
  category,
  slug,
}: {
  title: string;
  category: string;
  slug: string;
}) {
  return (
    <a
      href={`/projects/${slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-bg-elevated transition-colors hover:border-accent"
    >
      <div className="aspect-[4/3] bg-bg-base">
        <div className="flex h-full w-full items-center justify-center text-4xl">
          🏘️
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-accent">{category}</p>
        <p className="mt-1 font-display-sans font-medium text-text-primary group-hover:text-accent">
          {title}
        </p>
      </div>
    </a>
  );
}
