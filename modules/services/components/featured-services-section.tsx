"use client";

import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ServiceCard } from "./service-card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star } from "lucide-react";
import type { PublicServiceItem } from "../types/services.types";

interface FeaturedServicesSectionProps {
  title: string;
  services: PublicServiceItem[];
  locale: string;
  viewMoreLabel: string;
}

export const FeaturedServicesSection = memo(function FeaturedServicesSection({
  title,
  services,
  locale,
  viewMoreLabel,
}: FeaturedServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section className="space-y-6">
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:flex gap-1.5 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
            <Sparkles className="h-3 w-3" />
            {services.length}
          </Badge>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <AnimatedSection key={service.id} animation="fade-up" delay={250 + index * 50}>
            <ServiceCard
              service={service}
              locale={locale}
              viewMoreLabel={viewMoreLabel}
            />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
});
