/**
 * Sanity Image Builder — Luxury Real Estate Website
 *
 * Image URL builder for Sanity image assets.
 * Uses @sanity/image-url for URL generation.
 */

import createImageUrlBuilder from '@sanity/image-url';

/**
 * Environment-based configuration
 */
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
};

/**
 * Image URL builder instance
 */
export const imageUrl = createImageUrlBuilder({
  projectId: config.projectId,
  dataset: config.dataset,
});

/**
 * Type for sanity image source
 */
type ImageSource = {
  asset: {
    _ref: string;
    _type: 'reference';
  };
} | {
  asset: {
    url?: string;
  };
};

/**
 * Get URL for a Sanity image with options
 */
export function urlFor(source: ImageSource | null | undefined, options?: {
  width?: number;
  height?: number;
  quality?: number;
}) {
  if (!source) return null;

  let builder = imageUrl.image(source as Parameters<typeof imageUrl.image>[0]);

  if (options?.width) builder = builder.width(options.width);
  if (options?.height) builder = builder.height(options.height);
  if (options?.quality) builder = builder.quality(options.quality);

  return builder;
}

/**
 * Get blur placeholder URL (tiny, low quality)
 */
export function blurPlaceholder(source: ImageSource | null | undefined): string | null {
  if (!source) return null;
  try {
    return imageUrl
      .image(source as Parameters<typeof imageUrl.image>[0])
      .width(20)
      .quality(10)
      .blur(50)
      .auto('format')
      .url();
  } catch {
    return null;
  }
}

/**
 * Get srcSet for responsive images
 */
export function srcSet(
  source: ImageSource | null | undefined,
  widths: number[] = [320, 640, 960, 1280, 1920, 2560]
): string {
  if (!source) return '';

  const builder = imageUrl.image(source as Parameters<typeof imageUrl.image>[0]);

  return widths
    .map((w) => `${builder.width(w).auto('format').url()} ${w}w`)
    .join(', ');
}

export default imageUrl;
