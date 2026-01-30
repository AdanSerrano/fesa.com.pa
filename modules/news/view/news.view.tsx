import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getNewsPageDataAction } from "../actions/news.actions";
import { NewsHero } from "../components/news-hero";
import { CategoriesSection } from "../components/categories-section";
import { FeaturedNewsSection } from "../components/featured-news-section";
import { RecentNewsSection } from "../components/recent-news-section";
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

export async function NewsView() {
  const locale = await getLocale();
  const t = await getTranslations("PublicNews");
  const tBreadcrumb = await getTranslations("Breadcrumb");

  const { categories, featuredNews, recentNews } = await getNewsPageDataAction();

  const totalArticles = categories.reduce((acc, cat) => acc + cat.articleCount, 0);

  const labels = {
    title: t("title"),
    subtitle: t("subtitle"),
    categoriesTitle: t("categoriesTitle"),
    featuredTitle: t("featuredTitle"),
    recentTitle: t("recentTitle"),
    viewMore: t("viewMore"),
    noCategories: t("noCategories"),
    itemsCount: t("itemsCount", { count: totalArticles }),
    articles: t("articlesInCategory"),
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

        <NewsHero
          title={labels.title}
          subtitle={labels.subtitle}
          stats={{
            categories: categories.length,
            items: totalArticles,
            itemsLabel: labels.itemsCount,
          }}
        />

        <CategoriesSection
          title={labels.categoriesTitle}
          categories={categories}
          locale={locale}
          viewMoreLabel={labels.viewMore}
          emptyMessage={labels.noCategories}
          itemsLabel={labels.articles}
        />

        {featuredNews.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <FeaturedNewsSection
              title={labels.featuredTitle}
              articles={featuredNews}
              locale={locale}
              viewMoreLabel={labels.viewMore}
            />
          </div>
        )}

        {recentNews.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <RecentNewsSection
              title={labels.recentTitle}
              articles={recentNews}
              locale={locale}
              viewMoreLabel={labels.viewMore}
            />
          </div>
        )}
      </div>
    </div>
  );
}
