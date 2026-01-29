import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { getArticleDetailAction } from "../actions/news.actions";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ShareButton } from "../components/share-buttons";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Newspaper,
  MessageSquare,
  ChevronRight,
  Calendar,
  Clock,
  Images,
} from "lucide-react";

interface ArticleDetailViewProps {
  categorySlug: string;
  articleSlug: string;
}

export async function ArticleDetailView({
  categorySlug,
  articleSlug,
}: ArticleDetailViewProps) {
  const locale = await getLocale();
  const t = await getTranslations("PublicNews");

  const article = await getArticleDetailAction(categorySlug, articleSlug);

  if (!article) {
    notFound();
  }

  const formattedDate = article.publishedAt
    ? new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(article.publishedAt))
    : null;

  const readingTime = article.content
    ? Math.ceil(article.content.split(/\s+/).length / 200)
    : 1;

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const articleUrl = `${protocol}://${host}/${locale}/news/${categorySlug}/${articleSlug}`;

  const shareLabels = {
    share: t("shareArticle"),
    linkCopied: t("linkCopied"),
    shareError: t("shareError"),
  };

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 h-[40vh] sm:h-[50vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl opacity-50" />

        <div className="container mx-auto px-4 py-6 sm:py-8 relative">
          <AnimatedSection animation="fade-down" delay={0}>
            <Link href={`/${locale}/news/${categorySlug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 hover:bg-background/80 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToCategory")}
              </Button>
            </Link>
          </AnimatedSection>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <AnimatedSection animation="fade-right" delay={100}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/10 ring-1 ring-border/50 mb-8">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                      <div className="h-24 w-24 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20">
                        <Newspaper className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{article.categoryName}</Badge>
                    {formattedDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        {formattedDate}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1.5 h-4 w-4" />
                      {readingTime} min {t("readTime")}
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {article.title}
                  </h1>

                  {article.excerpt && (
                    <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4 italic">
                      {article.excerpt}
                    </p>
                  )}

                  {article.content && (
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  )}

                  {article.images.length > 0 && (
                    <div className="mt-12 pt-8 border-t">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Images className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">{t("imageGallery")}</h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {article.images.map((img, index) => (
                          <div
                            key={img.id}
                            className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
                          >
                            <Image
                              src={img.url}
                              alt={img.alt || `${article.title} - ${t("image")} ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:sticky lg:top-24">
              <AnimatedSection animation="fade-left" delay={300}>
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <ShareButton
                      url={articleUrl}
                      title={article.title}
                      text={article.excerpt || undefined}
                      labels={shareLabels}
                    />
                    <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                      <Link href={`/${locale}/contact`}>
                        <MessageSquare className="h-5 w-5" />
                        {t("contactUs")}
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2" asChild>
                      <Link href={`/${locale}/news`}>
                        {t("viewAllNews")}
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
