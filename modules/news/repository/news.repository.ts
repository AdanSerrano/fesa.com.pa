import { unstable_cache } from "next/cache";
import { db } from "@/utils/db";
import type { PublicNewsCategory, PublicNewsArticle } from "../types/news.types";

type SerializedArticle = Omit<PublicNewsArticle, "publishedAt"> & {
  publishedAt: string | null;
};

const deserializeArticle = (article: SerializedArticle): PublicNewsArticle => ({
  ...article,
  publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
});

const _getActiveCategories = unstable_cache(
  async (): Promise<PublicNewsCategory[]> => {
    const categories = await db.newsCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        icon: true,
        _count: {
          select: {
            news: {
              where: {
                isActive: true,
                publishedAt: { not: null, lte: new Date() },
              },
            },
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      icon: cat.icon,
      articleCount: cat._count.news,
    }));
  },
  ["news-active-categories"],
  { tags: ["news"], revalidate: 1800 }
);

const _getFeaturedNews = unstable_cache(
  async (limit: number): Promise<SerializedArticle[]> => {
    const articles = await db.news.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        publishedAt: { not: null, lte: new Date() },
      },
      select: {
        id: true,
        categoryId: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return articles.map((article) => ({
      id: article.id,
      categoryId: article.categoryId,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: null,
      image: article.image,
      images: [],
      publishedAt: article.publishedAt?.toISOString() ?? null,
      categoryName: article.category?.name || "",
      categorySlug: article.category?.slug || "",
    }));
  },
  ["news-featured"],
  { tags: ["news"], revalidate: 1800 }
);

const _getRecentNews = unstable_cache(
  async (limit: number): Promise<SerializedArticle[]> => {
    const articles = await db.news.findMany({
      where: {
        isActive: true,
        publishedAt: { not: null, lte: new Date() },
      },
      select: {
        id: true,
        categoryId: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return articles.map((article) => ({
      id: article.id,
      categoryId: article.categoryId,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: null,
      image: article.image,
      images: [],
      publishedAt: article.publishedAt?.toISOString() ?? null,
      categoryName: article.category?.name || "",
      categorySlug: article.category?.slug || "",
    }));
  },
  ["news-recent"],
  { tags: ["news"], revalidate: 1800 }
);

type SerializedCategoryWithArticles = PublicNewsCategory & {
  articles: SerializedArticle[];
};

const _getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<SerializedCategoryWithArticles | null> => {
    const category = await db.newsCategory.findFirst({
      where: {
        isActive: true,
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        icon: true,
        news: {
          where: {
            isActive: true,
            publishedAt: { not: null, lte: new Date() },
          },
          select: {
            id: true,
            categoryId: true,
            title: true,
            slug: true,
            excerpt: true,
            image: true,
            publishedAt: true,
          },
          orderBy: { publishedAt: "desc" },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      icon: category.icon,
      articleCount: category.news.length,
      articles: category.news.map((article) => ({
        id: article.id,
        categoryId: article.categoryId,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: null,
        image: article.image,
        images: [],
        publishedAt: article.publishedAt?.toISOString() ?? null,
        categoryName: category.name,
        categorySlug: category.slug,
      })),
    };
  },
  ["news-category-by-slug"],
  { tags: ["news"], revalidate: 1800 }
);

type SerializedArticleDetail = Omit<PublicNewsArticle, "publishedAt"> & {
  publishedAt: string | null;
};

const _getArticleBySlug = unstable_cache(
  async (
    categorySlug: string,
    articleSlug: string
  ): Promise<SerializedArticleDetail | null> => {
    const article = await db.news.findFirst({
      where: {
        isActive: true,
        slug: articleSlug,
        publishedAt: { not: null, lte: new Date() },
        category: {
          isActive: true,
          slug: categorySlug,
        },
      },
      select: {
        id: true,
        categoryId: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!article) return null;

    return {
      id: article.id,
      categoryId: article.categoryId,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      images: article.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        order: img.order,
      })),
      publishedAt: article.publishedAt?.toISOString() ?? null,
      categoryName: article.category?.name || "",
      categorySlug: article.category?.slug || "",
    };
  },
  ["news-article-by-slug"],
  { tags: ["news"], revalidate: 1800 }
);

export class PublicNewsRepository {
  public async getActiveCategories(): Promise<PublicNewsCategory[]> {
    return _getActiveCategories();
  }

  public async getFeaturedNews(limit: number = 6): Promise<PublicNewsArticle[]> {
    const cached = await _getFeaturedNews(limit);
    return cached.map(deserializeArticle);
  }

  public async getRecentNews(limit: number = 10): Promise<PublicNewsArticle[]> {
    const cached = await _getRecentNews(limit);
    return cached.map(deserializeArticle);
  }

  public async getCategoryBySlug(
    slug: string
  ): Promise<(PublicNewsCategory & { articles: PublicNewsArticle[] }) | null> {
    const cached = await _getCategoryBySlug(slug);
    if (!cached) return null;

    return {
      ...cached,
      articles: cached.articles.map(deserializeArticle),
    };
  }

  public async getArticleBySlug(
    categorySlug: string,
    articleSlug: string
  ): Promise<PublicNewsArticle | null> {
    const cached = await _getArticleBySlug(categorySlug, articleSlug);
    if (!cached) return null;

    return deserializeArticle(cached);
  }
}
