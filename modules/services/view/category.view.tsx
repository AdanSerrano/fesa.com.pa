import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getCategoryWithItemsAction } from "../actions/services.actions";
import { ServicesHero } from "../components/services-hero";
import { ServiceCard } from "../components/service-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package } from "lucide-react";

interface CategoryViewProps {
  slug: string;
}

export async function CategoryView({ slug }: CategoryViewProps) {
  const locale = await getLocale();
  const t = await getTranslations("PublicServices");

  const category = await getCategoryWithItemsAction(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <AnimatedSection animation="fade-down" delay={0}>
        <Link href={`/${locale}/services`}>
          <Button variant="ghost" size="sm" className="mb-4 hover:bg-primary/5">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToServices")}
          </Button>
        </Link>
      </AnimatedSection>

      <ServicesHero
        title={category.name}
        subtitle={category.description || ""}
        showIcon={false}
      />

      <AnimatedSection animation="fade-up" delay={100}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{t("featuredTitle")}</h2>
            <Badge variant="secondary" className="gap-1.5">
              <Package className="h-3 w-3" />
              {category.items.length}
            </Badge>
          </div>
        </div>

        {category.items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((service, index) => (
              <AnimatedSection key={service.id} animation="fade-up" delay={150 + index * 50}>
                <ServiceCard
                  service={service}
                  locale={locale}
                  viewMoreLabel={t("viewMore")}
                />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {t("noServicesInCategory")}
            </p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
