import { db } from "@/utils/db";
import type { PublicNewsCategory, PublicNewsArticle } from "../types/news.types";

export class PublicNewsRepository {
  public async getActiveCategories(): Promise<PublicNewsCategory[]> {
    const categories = await db.newsCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        icon: true,
      },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return categories;
  }

  public async getFeaturedNews(limit: number = 6): Promise<PublicNewsArticle[]> {
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
        content: true,
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
      content: article.content,
      image: article.image,
      images: [],
      publishedAt: article.publishedAt,
      categoryName: article.category?.name || "",
      categorySlug: article.category?.slug || "",
    }));
  }

  public async getRecentNews(limit: number = 10): Promise<PublicNewsArticle[]> {
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
        content: true,
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
      content: article.content,
      image: article.image,
      images: [],
      publishedAt: article.publishedAt,
      categoryName: article.category?.name || "",
      categorySlug: article.category?.slug || "",
    }));
  }

  public async getCategoryBySlug(
    slug: string
  ): Promise<(PublicNewsCategory & { articles: PublicNewsArticle[] }) | null> {
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
            content: true,
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
      articles: category.news.map((article) => ({
        id: article.id,
        categoryId: article.categoryId,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        image: article.image,
        images: [],
        publishedAt: article.publishedAt,
        categoryName: category.name,
        categorySlug: category.slug,
      })),
    };
  }

  public async getArticleBySlug(
    categorySlug: string,
    articleSlug: string
  ): Promise<PublicNewsArticle | null> {
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
      publishedAt: article.publishedAt,
      categoryName: article.category?.name || "",
      categorySlug: article.category?.slug || "",
    };
  }
}
