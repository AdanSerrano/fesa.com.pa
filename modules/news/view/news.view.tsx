import { getTranslations, getLocale } from "next-intl/server";
import { getNewsPageDataAction } from "../actions/news.actions";
import { NewsHero } from "../components/news-hero";
import { CategoriesSection } from "../components/categories-section";
import { FeaturedNewsSection } from "../components/featured-news-section";
import { RecentNewsSection } from "../components/recent-news-section";

export async function NewsView() {
  const locale = await getLocale();
  const t = await getTranslations("PublicNews");

  const { categories, featuredNews, recentNews } = await getNewsPageDataAction();

  const labels = {
    title: t("title"),
    subtitle: t("subtitle"),
    categoriesTitle: t("categoriesTitle"),
    featuredTitle: t("featuredTitle"),
    recentTitle: t("recentTitle"),
    viewMore: t("viewMore"),
    noCategories: t("noCategories"),
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16 relative">
        <NewsHero title={labels.title} subtitle={labels.subtitle} />

        <CategoriesSection
          title={labels.categoriesTitle}
          categories={categories}
          locale={locale}
          viewMoreLabel={labels.viewMore}
          emptyMessage={labels.noCategories}
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
