/**
 * Project Adapter — Luxury Real Estate Website
 *
 * Converts Sanity project documents to frozen frontend Project interface.
 * React components must never receive raw Sanity documents.
 */

import type { Project, MediaImage } from '@/lib/project';
import type { SanityProject, SanityImage } from '@/lib/sanity/types';
import { imageUrl } from '@/lib/sanity/image';

/**
 * Convert Sanity image to MediaImage
 */
function adaptImage(image: SanityImage | undefined): MediaImage | null {
  if (!image?.asset?._ref) return null;

  try {
    const url = imageUrl.image(image).width(1200).auto('format').url();
    return {
      url,
      alt: image.alt || '',
      width: 1200,
      height: 900,
    };
  } catch {
    return null;
  }
}

/**
 * Convert Sanity gallery to Project media gallery
 */
function adaptGallery(gallery: SanityImage[] | undefined): Project['media']['gallery'] {
  if (!gallery?.length) return [];

  return gallery
    .map((img) => {
      if (!img?.asset?._ref) return null;
      try {
        const url = imageUrl.image(img).width(800).auto('format').url();
        return {
          url,
          alt: img.alt || '',
          width: 800,
          height: 600,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Project['media']['gallery'];
}

/**
 * Adapt Sanity document to frozen frontend Project interface
 */
export function adaptProject(doc: SanityProject | null | undefined): Project | null {
  if (!doc) return null;

  return {
    id: doc._id,
    slug: doc.slug?.current || '',
    title: doc.title || '',
    tagline: doc.tagline || '',
    description: doc.description || '',
    category: doc.category || 'residential',
    status: doc.status || 'planning',
    ownershipModel: doc.ownershipModel || 'freehold',
    location: {
      address: doc.location?.address || '',
      city: doc.location?.city || '',
      state: doc.location?.state || '',
      country: doc.location?.country || '',
      postalCode: doc.location?.postalCode || '',
      coordinates: doc.location?.coordinates,
    },
    pricing: {
      startingPrice: doc.pricing?.startingPrice || 0,
      currency: doc.pricing?.currency || '$',
      priceUnit: doc.pricing?.priceUnit || 'sqft',
      priceLabel: doc.pricing?.priceLabel,
    },
media: {
      featuredImage: adaptImage(doc.media?.featuredImage) ?? {
        url: '',
        alt: '',
        width: 1200,
        height: 900,
      },
      gallery: adaptGallery(doc.media?.gallery),
      video: undefined,
      virtualTourUrl: doc.media?.virtualTourUrl,
      floorPlans: undefined,
      model3d: undefined,
    },
    highlights: doc.highlights || [],
    features: {
      hasVirtualTour: doc.features?.hasVirtualTour,
      hasSmartHome: doc.features?.hasSmartHome,
      hasInfinityPool: doc.features?.hasInfinityPool,
      hasConcierge: doc.features?.hasConcierge,
      hasPrivateElevator: doc.features?.hasPrivateElevator,
      hasRooftopAccess: doc.features?.hasRooftopAccess,
      hasWineCellar: doc.features?.hasWineCellar,
      hasHomeTheater: doc.features?.hasHomeTheater,
      hasGym: doc.features?.hasGym,
      hasSpa: doc.features?.hasSpa,
      hasEVCharging: doc.features?.hasEVCharging,
      hasHelipad: doc.features?.hasHelipad,
    },
    timestamp: {
      createdAt: doc.timestamp?.createdAt || '',
      updatedAt: doc.timestamp?.updatedAt || '',
      launchDate: doc.timestamp?.launchDate,
      completionDate: doc.timestamp?.completionDate,
    },
seo: {
      title: doc.seo?.title || doc.title || '',
      description: doc.seo?.description || doc.description || '',
      ogImage: doc.seo?.ogImage ? (adaptImage(doc.seo.ogImage)?.url || '') : '',
      canonicalUrl: doc.seo?.canonicalUrl || '',
    },
  };
}

export default adaptProject;
