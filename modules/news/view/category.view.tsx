import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getCategoryWithArticlesAction } from "../actions/news.actions";
import { NewsHero } from "../components/news-hero";
import { NewsCard } from "../components/news-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Newspaper } from "lucide-react";

interface CategoryViewProps {
  slug: string;
}

export async function CategoryView({ slug }: CategoryViewProps) {
  const locale = await getLocale();
  const t = await getTranslations("PublicNews");

  const category = await getCategoryWithArticlesAction(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <AnimatedSection animation="fade-down" delay={0}>
        <Link href={`/${locale}/news`}>
          <Button variant="ghost" size="sm" className="mb-4 hover:bg-primary/5">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToNews")}
          </Button>
        </Link>
      </AnimatedSection>

      <NewsHero
        title={category.name}
        subtitle={category.description || ""}
        showIcon={false}
      />

      <AnimatedSection animation="fade-up" delay={100}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{t("articlesInCategory")}</h2>
            <Badge variant="secondary" className="gap-1.5">
              <Newspaper className="h-3 w-3" />
              {category.articles.length}
            </Badge>
          </div>
        </div>

        {category.articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.articles.map((article, index) => (
              <AnimatedSection key={article.id} animation="fade-up" delay={150 + index * 50}>
                <NewsCard
                  article={article}
                  locale={locale}
                  viewMoreLabel={t("viewMore")}
                />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {t("noArticlesInCategory")}
            </p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
