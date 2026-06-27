/**
 * Mock Projects Data — Luxury Real Estate Website
 *
 * Sample project data for development and demonstration.
 * In production, this would be replaced by CMS-loaded data.
 */

import type { Project } from './project';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'aurora-heights',
    title: 'Aurora Heights',
    tagline: 'Where luxury meets the sky',
    description: 'An iconic residential tower offering panoramic views of the city skyline. Featuring floor-to-ceiling windows, private terraces, and world-class amenities.',
    location: {
      address: '123 Park Avenue',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    category: 'residential',
    status: 'completed',
    ownershipModel: 'freehold',
    pricing: {
      startingPrice: 2500000,
      currency: '$',
      priceUnit: 'sqft',
    },
    media: {
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1600596542415-9a4ea9d2b9e2?w=1200',
        alt: 'Aurora Heights exterior view',
        width: 1200,
        height: 900,
      },
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1600596542415-9a4ea9d2b9e2?w=800',
          alt: 'Living room',
          width: 800,
          height: 600,
        },
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          alt: 'Bedroom',
          width: 800,
          height: 600,
        },
      ],
    },
    highlights: [
      'Floor-to-ceiling windows with panoramic views',
      'Private rooftop terraces',
      '24/7 concierge service',
    ],
    features: {
      hasConcierge: true,
      hasInfinityPool: true,
      hasGym: true,
      hasSpa: true,
      hasSmartHome: true,
    },
    timestamp: {
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      completionDate: '2025-12-01T00:00:00Z',
    },
    seo: {
      title: 'Aurora Heights - Luxury Living in New York',
      description: 'Experience luxury living at Aurora Heights, featuring panoramic city views and world-class amenities.',
      ogImage: 'https://images.unsplash.com/photo-1600596542415-9a4ea9d2b9e2?w=1200',
      canonicalUrl: 'https://lumiere-estates.com/projects/aurora-heights',
    },
  },
  {
    id: '2',
    slug: 'marina-bay-resort',
    title: 'Marina Bay Resort',
    tagline: 'Your private coastal sanctuary',
    description: 'An exclusive beachfront resort featuring private villas, infinity pools, and direct beach access.',
    location: {
      address: '456 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      country: 'United States',
      postalCode: '33139',
      coordinates: { lat: 25.7617, lng: -80.1918 },
    },
    category: 'hospitality',
    status: 'under-construction',
    ownershipModel: 'leasehold',
    pricing: {
      startingPrice: 1500000,
      currency: '$',
      priceUnit: 'sqft',
      priceLabel: 'From $1.5M',
    },
    media: {
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        alt: 'Marina Bay Resort aerial view',
        width: 1200,
        height: 900,
      },
      gallery: [],
    },
    highlights: [
      'Direct beach access',
      'Private infinity pools',
      'Marina and yacht club',
    ],
    features: {
      hasInfinityPool: true,
      hasConcierge: true,
      hasSpa: true,
      hasPrivateElevator: true,
    },
    timestamp: {
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-06-15T00:00:00Z',
      completionDate: '2026-06-01T00:00:00Z',
    },
    seo: {
      title: 'Marina Bay Resort - Beachfront Luxury',
      description: 'Your private coastal sanctuary at Marina Bay Resort.',
      ogImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      canonicalUrl: 'https://lumiere-estates.com/projects/marina-bay-resort',
    },
  },
  {
    id: '3',
    slug: 'urban-central-tower',
    title: 'Urban Central Tower',
    tagline: 'The heart of city living',
    description: 'A mixed-use development combining luxury residences, premium office space, and retail destinations.',
    location: {
      address: '789 Commerce Street',
      city: 'Chicago',
      state: 'IL',
      country: 'United States',
      postalCode: '60601',
      coordinates: { lat: 41.8781, lng: -87.6298 },
    },
    category: 'mixed-use',
    status: 'planning',
    ownershipModel: 'strata',
    pricing: {
      startingPrice: 800000,
      currency: '$',
      priceUnit: 'sqft',
    },
    media: {
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        alt: 'Urban Central Tower rendering',
        width: 1200,
        height: 900,
      },
      gallery: [],
    },
    highlights: [
      'Mixed-use development',
      'Premium office space',
      'Retail destinations',
    ],
    features: {
      hasSmartHome: true,
      hasEVCharging: true,
    },
    timestamp: {
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-06-20T00:00:00Z',
      launchDate: '2025-01-01T00:00:00Z',
    },
    seo: {
      title: 'Urban Central Tower - Mixed-Use Development',
      description: 'The future of urban living at Urban Central Tower.',
      ogImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
      canonicalUrl: 'https://lumiere-estates.com/projects/urban-central-tower',
    },
  },
  {
    id: '4',
    slug: 'pacific-palace-estate',
    title: 'Pacific Palace Estate',
    tagline: 'Timeless elegance, modern luxury',
    description: 'A prestigious estate featuring Mediterranean-inspired architecture with contemporary interiors.',
    location: {
      address: '101 Pacific Coast Highway',
      city: 'Malibu',
      state: 'CA',
      country: 'United States',
      postalCode: '90265',
      coordinates: { lat: 34.0259, lng: -118.7798 },
    },
    category: 'residential',
    status: 'completed',
    ownershipModel: 'freehold',
    pricing: {
      startingPrice: 12000000,
      currency: '$',
      priceUnit: 'total',
      priceLabel: '$12M',
    },
    media: {
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63fc8fd1?w=1200',
        alt: 'Pacific Palace Estate exterior',
        width: 1200,
        height: 900,
      },
      gallery: [],
    },
    highlights: [
      'Mediterranean-inspired architecture',
      '10,000 sq ft of living space',
      'Private beach access',
    ],
    features: {
      hasInfinityPool: true,
      hasWineCellar: true,
      hasHomeTheater: true,
      hasGym: true,
      hasSpa: true,
      hasHelipad: true,
    },
    timestamp: {
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-05-01T00:00:00Z',
    },
    seo: {
      title: 'Pacific Palace Estate - Malibu Luxury',
      description: 'Timeless elegance at Pacific Palace Estate in Malibu.',
      ogImage: 'https://images.unsplash.com/photo-1613490493576-7fde63fc8fd1?w=1200',
      canonicalUrl: 'https://lumiere-estates.com/projects/pacific-palace-estate',
    },
  },
  {
    id: '5',
    slug: 'skyline-business-center',
    title: 'Skyline Business Center',
    tagline: 'Elevate your business',
    description: 'A Class A commercial office tower with state-of-the-art facilities and smart building technology.',
    location: {
      address: '500 Financial District',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      postalCode: '94111',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    category: 'commercial',
    status: 'sold-out',
    ownershipModel: 'freehold',
    pricing: {
      startingPrice: 500000,
      currency: '$',
      priceUnit: 'sqft',
    },
    media: {
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
        alt: 'Skyline Business Center exterior',
        width: 1200,
        height: 900,
      },
      gallery: [],
    },
    highlights: [
      'LEED Platinum certified',
      'Smart building technology',
      'Rooftop garden and lounge',
    ],
    features: {
      hasSmartHome: true,
      hasEVCharging: true,
    },
    timestamp: {
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    },
    seo: {
      title: 'Skyline Business Center - San Francisco',
      description: 'Class A commercial office space in San Francisco.',
      ogImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
      canonicalUrl: 'https://lumiere-estates.com/projects/skyline-business-center',
    },
  },
];

/**
 * Get featured projects (completed or under-construction)
 */
export function getFeaturedProjects(): Project[] {
  return projects.filter(
    (p) => p.status === 'completed' || p.status === 'under-construction'
  );
}

/**
 * Get project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Get all project slugs for static generation
 */
export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/**
 * Get all projects
 */
export function getAllProjects(): Project[] {
  return projects;
}
