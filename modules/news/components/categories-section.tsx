"use client";

import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CategoryCard } from "./category-card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, LayoutGrid } from "lucide-react";
import type { PublicNewsCategory } from "../types/news.types";

interface CategoriesSectionProps {
  title: string;
  categories: PublicNewsCategory[];
  locale: string;
  viewMoreLabel: string;
  emptyMessage: string;
  itemsLabel?: string;
}

export const CategoriesSection = memo(function CategoriesSection({
  title,
  categories,
  locale,
  viewMoreLabel,
  emptyMessage,
  itemsLabel,
}: CategoriesSectionProps) {
  return (
    <section className="space-y-6">
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            </div>
          </div>
          {categories.length > 0 && (
            <Badge variant="secondary" className="hidden sm:flex gap-1.5">
              <FolderOpen className="h-3 w-3" />
              {categories.length}
            </Badge>
          )}
        </div>
      </AnimatedSection>

      {categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <AnimatedSection key={category.id} animation="fade-up" delay={100 + index * 30}>
              <CategoryCard
                category={category}
                locale={locale}
                viewMoreLabel={viewMoreLabel}
                itemsLabel={itemsLabel}
              />
            </AnimatedSection>
          ))}
        </div>
      ) : (
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </AnimatedSection>
      )}
    </section>
  );
});
CategoriesSection.displayName = "CategoriesSection";
