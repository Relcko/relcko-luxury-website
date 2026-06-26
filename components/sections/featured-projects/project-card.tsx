'use client';

import { useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Card, CardBody, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/project';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  priority = false,
  className,
}: ProjectCardProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => {
    if (shouldReduceMotion || !imageRef.current) return;
    gsap.to(imageRef.current, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
  }, [shouldReduceMotion]);

  const handleMouseLeave = useCallback(() => {
    if (shouldReduceMotion || !imageRef.current) return;
    gsap.to(imageRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' });
  }, [shouldReduceMotion]);

  const statusVariant = {
    planning: 'outline' as const,
    'under-construction': 'outline' as const,
    completed: 'solid' as const,
    'sold-out': 'muted' as const,
  }[project.status];

  const categoryLabel = {
    residential: 'Residential',
    commercial: 'Commercial',
    'mixed-use': 'Mixed Use',
    hospitality: 'Hospitality',
    industrial: 'Industrial',
    infrastructure: 'Infrastructure',
  }[project.category];

  return (
    <Link href={`/projects/${project.slug}`} className={cn('block group', className)}>
      <Card interactive className="h-full">
{/* Image Container */}
        <div
          ref={imageRef}
          className="relative aspect-[4/3] overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={project.media.featuredImage.url}
            alt={project.media.featuredImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 will-change-transform"
            priority={priority}
          />
          {/* Overlay gradient on hover */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          />
        </div>

        {/* Content */}
        <CardBody className="flex flex-col gap-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusVariant}>
              {project.status.replace('-', ' ')}
            </Badge>
            <Badge variant="outline">
              {categoryLabel}
            </Badge>
          </div>

          {/* Title */}
          <Heading level={3} className="font-medium">
            {project.title}
          </Heading>

          {/* Tagline */}
          <Text size="sm" className="text-opacity-medium">
            {project.tagline}
          </Text>

          {/* Location */}
          <Text size="sm" className="text-opacity-low">
            {project.location.city}, {project.location.country}
          </Text>

          {/* Footer */}
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <Text size="sm" className="font-medium">
                {project.pricing.priceLabel ||
                  `From ${project.pricing.currency}${project.pricing.startingPrice.toLocaleString()}`}
              </Text>
              <Button variant="ghost" size="sm" className="-mr-2">
                View Details
              </Button>
            </div>
          </CardFooter>
        </CardBody>
      </Card>
    </Link>
  );
}
