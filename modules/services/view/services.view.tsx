import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getServicesPageDataAction } from "../actions/services.actions";
import { ServicesHero } from "../components/services-hero";
import { CategoriesSection } from "../components/categories-section";
import { FeaturedServicesSection } from "../components/featured-services-section";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Home } from "lucide-react";

export async function ServicesView() {
  const locale = await getLocale();
  const t = await getTranslations("PublicServices");
  const tBreadcrumb = await getTranslations("Breadcrumb");

  const { categories, featuredServices } = await getServicesPageDataAction();

  const totalServices = categories.reduce((acc, cat) => acc + cat.itemCount, 0);

  const labels = {
    title: t("title"),
    subtitle: t("subtitle"),
    categoriesTitle: t("categoriesTitle"),
    featuredTitle: t("featuredTitle"),
    viewMore: t("viewMore"),
    noCategories: t("noCategories"),
    itemsCount: t("itemsCount", { count: totalServices }),
    services: t("servicesInCategory"),
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-6 sm:py-10 space-y-8 sm:space-y-12 relative">
        <AnimatedSection animation="fade-down" delay={0}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${locale}`} className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    {tBreadcrumb("home")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{labels.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AnimatedSection>

        <ServicesHero
          title={labels.title}
          subtitle={labels.subtitle}
          stats={{
            categories: categories.length,
            items: totalServices,
            itemsLabel: labels.itemsCount,
          }}
        />

        <CategoriesSection
          title={labels.categoriesTitle}
          categories={categories}
          locale={locale}
          viewMoreLabel={labels.viewMore}
          emptyMessage={labels.noCategories}
          itemsLabel={labels.services}
        />

        {featuredServices.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <FeaturedServicesSection
              title={labels.featuredTitle}
              services={featuredServices}
              locale={locale}
              viewMoreLabel={labels.viewMore}
            />
          </div>
        )}
      </div>
    </div>
  );
}
