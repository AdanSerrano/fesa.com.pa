"use server";

import { PublicNewsRepository } from "../repository/news.repository";
import type { PublicNewsCategory, PublicNewsArticle, NewsPageData } from "../types/news.types";

const repository = new PublicNewsRepository();

export async function getNewsPageDataAction(): Promise<NewsPageData> {
  try {
    const [categories, featuredNews, recentNews] = await Promise.all([
      repository.getActiveCategories(),
      repository.getFeaturedNews(6),
      repository.getRecentNews(10),
    ]);

    return { categories, featuredNews, recentNews };
  } catch {
    return { categories: [], featuredNews: [], recentNews: [] };
  }
}

export async function getCategoryWithArticlesAction(
  slug: string
): Promise<(PublicNewsCategory & { articles: PublicNewsArticle[] }) | null> {
  try {
    return await repository.getCategoryBySlug(slug);
  } catch {
    return null;
  }
}

export async function getArticleDetailAction(
  categorySlug: string,
  articleSlug: string
): Promise<PublicNewsArticle | null> {
  try {
    return await repository.getArticleBySlug(categorySlug, articleSlug);
  } catch {
    return null;
  }
}

export async function getHomeNewsDataAction(): Promise<{
  categories: PublicNewsCategory[];
  featuredNews: PublicNewsArticle[];
}> {
  try {
    const [categories, recentNews] = await Promise.all([
      repository.getActiveCategories(),
      repository.getRecentNews(3),
    ]);

    return { categories, featuredNews: recentNews };
  } catch {
    return { categories: [], featuredNews: [] };
  }
}
