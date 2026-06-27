"use client";

import { motion } from "framer-motion";
import type { ProjectMedia } from "@/lib/project";
import type { GalleryItemData, GalleryCategoryName } from "@/lib/gallery-showcase";
import { fadeVariants, revealVariants } from "@/lib/animation";
import { Container, Section, Heading, Text } from "@/components/ui";
import { GalleryGrid } from "@/components/sections/gallery-showcase";

export type ProjectGalleryProps = {
  media: ProjectMedia;
  className?: string;
};

/**
 * Fallback blur placeholder when per-item blurDataURL isn't provided.
 */
const FALLBACK_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

/**
 * ProjectGallery displays a project's media gallery.
 * Transforms ProjectMedia.gallery into GalleryItemData format for the existing GalleryGrid.
 */
export function ProjectGallery({ media, className }: ProjectGalleryProps) {
  // Transform ProjectMedia.gallery into GalleryItemData[]
  const galleryItems: GalleryItemData[] = media.gallery.map((image, index) => ({
    id: `gallery-${index}`,
    image: {
      src: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height,
      blurDataURL: image.blurDataUrl ?? FALLBACK_BLUR,
    },
    category: "Interiors" as GalleryCategoryName,
    caption: image.alt,
    span: index === 0 ? "hero" : "standard",
  }));

  if (galleryItems.length === 0) {
    return null;
  }

  return (
    <Section className={className}>
      <Container>
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col items-center text-center"
        >
          <Text
            as="span"
            className="mb-4 font-display-sans text-xs uppercase tracking-[0.24em] text-accent"
          >
            Gallery
          </Text>
          <Heading level={2} size="xl" className="max-w-[28ch]">
            Visual Journey
          </Heading>
          <Text className="mt-6 max-w-[48ch] text-lg text-text-muted">
            Explore the visual elegance of this exceptional property through our
            curated collection of photographs.
          </Text>
        </motion.div>
      </Container>

      <Container>
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="pt-12"
        >
          <GalleryGrid items={galleryItems} />
        </motion.div>
      </Container>
    </Section>
  );
}
