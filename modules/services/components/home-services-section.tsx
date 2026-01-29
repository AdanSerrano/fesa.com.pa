import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  ArrowRight,
  Briefcase,
  FolderOpen,
} from "lucide-react";
import type { PublicServiceCategory, PublicServiceItem } from "../types/services.types";

interface HomeServicesSectionProps {
  categories: PublicServiceCategory[];
  featuredServices: PublicServiceItem[];
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
  category: PublicServiceCategory;
  locale: string;
  viewMoreLabel: string;
}) {
  return (
    <Link href={`/${locale}/services/${category.slug}`} className="block h-full">
      <Card className="group h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-blue-600/10">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        </div>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {category.description}
            </p>
          )}
          <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all">
            <span>{viewMoreLabel}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

export const HomeServicesSection = memo(function HomeServicesSection({
  categories,
  locale,
  labels,
}: HomeServicesSectionProps) {
  const displayCategories = categories.slice(0, 4);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AnimatedSection animation="fade-up" delay={0}>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Briefcase className="mr-2 h-3.5 w-3.5" />
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
              <HomeCategoryCard
                category={category}
                locale={locale}
                viewMoreLabel={labels.viewMore}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={400}>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/services`}>
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
