import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  ArrowRight,
  Newspaper,
  FolderOpen,
} from "lucide-react";
import type { PublicNewsCategory, PublicNewsArticle } from "../types/news.types";

interface HomeNewsSectionProps {
  categories: PublicNewsCategory[];
  featuredNews: PublicNewsArticle[];
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

const HomeNewsCategoryCard = memo(function HomeNewsCategoryCard({
  category,
  locale,
  viewMoreLabel,
}: {
  category: PublicNewsCategory;
  locale: string;
  viewMoreLabel: string;
}) {
  return (
    <Link href={`/${locale}/news/${category.slug}`} className="group block h-full">
      <div className="relative h-full rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:border-brand-400/40 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {category.image ? (
            <>
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-500/5">
              <div className="h-16 w-16 rounded-xl bg-brand-500/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <FolderOpen className="h-8 w-8 text-brand-600" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-600 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {category.description}
            </p>
          )}
          <div className="flex items-center text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{viewMoreLabel}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
});

export const HomeNewsSection = memo(function HomeNewsSection({
  categories,
  locale,
  labels,
}: HomeNewsSectionProps) {
  const displayCategories = categories.slice(0, 4);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimatedSection animation="fade-up" delay={0}>
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">
              <Newspaper className="mr-2 h-3.5 w-3.5" />
              {labels.sectionTitle}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {labels.sectionTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {labels.sectionSubtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category, index) => (
            <AnimatedSection key={category.id} animation="fade-up" delay={index * 100}>
              <HomeNewsCategoryCard
                category={category}
                locale={locale}
                viewMoreLabel={labels.viewMore}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400}>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href={`/${locale}/news`}>
                {labels.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});
