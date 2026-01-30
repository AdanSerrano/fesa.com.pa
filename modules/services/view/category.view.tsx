import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getCategoryWithItemsAction } from "../actions/services.actions";
import { ServiceCard } from "../components/service-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Home, Layers, FolderOpen } from "lucide-react";

interface CategoryViewProps {
  slug: string;
}

export async function CategoryView({ slug }: CategoryViewProps) {
  const locale = await getLocale();
  const t = await getTranslations("PublicServices");
  const tBreadcrumb = await getTranslations("Breadcrumb");

  const category = await getCategoryWithItemsAction(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 relative">
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
                <BreadcrumbLink asChild>
                  <Link href={`/${locale}/services`}>{t("title")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={50}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-primary/10">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative py-8 md:py-12 px-6 text-center space-y-3">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mx-auto max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {category.description}
                </p>
              )}
              <Badge variant="secondary" className="gap-1.5 mt-2">
                <Layers className="h-3.5 w-3.5" />
                {t("itemsCount", { count: category.items.length })}
              </Badge>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          {category.items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((service, index) => (
                <AnimatedSection key={service.id} animation="fade-up" delay={120 + index * 30}>
                  <ServiceCard
                    service={service}
                    locale={locale}
                    viewMoreLabel={t("viewMore")}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <Layers className="h-10 w-10" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>{t("noServicesInCategory")}</EmptyTitle>
                <EmptyDescription>{t("exploreCategories")}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
