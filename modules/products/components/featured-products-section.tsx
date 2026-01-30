"use client";

import { memo } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ProductCard } from "./product-card";
import { Badge } from "@/components/ui/badge";
import { Package, Star } from "lucide-react";
import type { PublicProductItem } from "../types/products.types";

interface FeaturedProductsSectionProps {
  title: string;
  products: PublicProductItem[];
  locale: string;
  viewMoreLabel: string;
}

export const FeaturedProductsSection = memo(function FeaturedProductsSection({
  title,
  products,
  locale,
  viewMoreLabel,
}: FeaturedProductsSectionProps) {
  return (
    <section className="space-y-6">
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:flex gap-1.5">
            <Package className="h-3 w-3" />
            {products.length}
          </Badge>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <AnimatedSection key={product.id} animation="fade-up" delay={150 + index * 30}>
            <ProductCard
              product={product}
              locale={locale}
              viewMoreLabel={viewMoreLabel}
            />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
});
FeaturedProductsSection.displayName = "FeaturedProductsSection";
