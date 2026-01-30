"use client";

import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FolderOpen, Layers } from "lucide-react";

interface ServicesHeroProps {
  title: string;
  subtitle: string;
  showIcon?: boolean;
  stats?: {
    categories: number;
    items: number;
    itemsLabel: string;
  };
}

export const ServicesHero = memo(function ServicesHero({
  title,
  subtitle,
  showIcon = true,
  stats,
}: ServicesHeroProps) {
  return (
    <AnimatedSection animation="fade-up" delay={50}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative text-center space-y-4 py-10 md:py-16 px-6">
          {showIcon && (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 shadow-lg shadow-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
          {stats && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                <FolderOpen className="h-3.5 w-3.5" />
                {stats.categories} {stats.categories === 1 ? "categoría" : "categorías"}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                <Layers className="h-3.5 w-3.5" />
                {stats.itemsLabel}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
});
ServicesHero.displayName = "ServicesHero";
