import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  ArrowRight,
  FolderOpen,
  Package,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  Star,
} from "lucide-react";
import type { PublicProductCategory, PublicProductItem } from "../types/products.types";

interface HomeProductsSectionProps {
  categories: PublicProductCategory[];
  featuredProducts: PublicProductItem[];
  locale: string;
  labels: {
    sectionTitle: string;
    sectionSubtitle: string;
    categoriesTitle: string;
    featuredTitle: string;
    viewAll: string;
    viewMore: string;
  };
}

const HomeCategoryCard = memo(function HomeCategoryCard({
  category,
  locale,
  viewMoreLabel,
}: {
  category: PublicProductCategory;
  locale: string;
  viewMoreLabel: string;
}) {
  return (
    <Link href={`/${locale}/products/${category.slug}`} className="block h-full">
      <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 overflow-hidden">
        <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                <FolderOpen className="h-7 w-7 text-primary" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
        <CardContent className="pt-4 pb-5">
          <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
              {category.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-sm font-medium text-primary">
              {viewMoreLabel}
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

const HomeProductCard = memo(function HomeProductCard({
  product,
  locale,
}: {
  product: PublicProductItem;
  locale: string;
}) {
  const formattedPrice = product.price !== null
    ? new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
        style: "currency",
        currency: "MXN",
      }).format(product.price)
    : null;

  return (
    <Link href={`/${locale}/products/${product.categorySlug}/${product.slug}`} className="block h-full">
      <Card className="group h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="h-14 w-14 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                <Package className="h-7 w-7 text-primary" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 text-xs bg-background/90 backdrop-blur-sm border-0 shadow-sm"
          >
            {product.categoryName}
          </Badge>
          {formattedPrice && (
            <Badge
              variant="default"
              className="absolute bottom-3 right-3 text-xs bg-primary text-primary-foreground shadow-sm"
            >
              {formattedPrice}
            </Badge>
          )}
        </div>
        <CardContent className="pt-4 pb-5">
          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});

export const HomeProductsSection = memo(function HomeProductsSection({
  categories,
  featuredProducts,
  locale,
  labels,
}: HomeProductsSectionProps) {
  const displayCategories = categories.slice(0, 4);
  const displayProducts = featuredProducts.slice(0, 3);

  if (categories.length === 0 && featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden border-b">
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container px-4 md:px-6 relative">
        <AnimatedSection animation="fade-up" delay={0}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              {labels.sectionTitle}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              {labels.sectionTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              {labels.sectionSubtitle}
            </p>
          </div>
        </AnimatedSection>

        {displayCategories.length > 0 && (
          <div className="mb-14">
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{labels.categoriesTitle}</h3>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-primary/5" asChild>
                  <Link href={`/${locale}/products`}>
                    {labels.viewAll}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {displayCategories.map((category, index) => (
                <AnimatedSection key={category.id} animation="fade-up" delay={150 + index * 50}>
                  <HomeCategoryCard
                    category={category}
                    locale={locale}
                    viewMoreLabel={labels.viewMore}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {displayProducts.length > 0 && (
          <div>
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold">{labels.featuredTitle}</h3>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-primary/5" asChild>
                  <Link href={`/${locale}/products`}>
                    {labels.viewAll}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product, index) => (
                <AnimatedSection key={product.id} animation="fade-up" delay={350 + index * 50}>
                  <HomeProductCard
                    product={product}
                    locale={locale}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
