"use client";

import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Newspaper } from "lucide-react";

interface NewsHeroProps {
  title: string;
  subtitle: string;
  showIcon?: boolean;
}

export const NewsHero = memo(function NewsHero({
  title,
  subtitle,
  showIcon = true,
}: NewsHeroProps) {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative text-center space-y-4 py-12 md:py-20 px-6">
          {showIcon && (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <Newspaper className="h-7 w-7 text-primary" />
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
        </div>
      </div>
    </AnimatedSection>
  );
});
