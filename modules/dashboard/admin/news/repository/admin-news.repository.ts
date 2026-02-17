import { db } from "@/utils/db";
import type { Prisma } from "@/app/prisma/client";
import { generateSlug } from "@/utils/slug";
import type {
  NewsCategory,
  NewsArticle,
  AdminNewsFilters,
  AdminNewsSorting,
  AdminNewsStats,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateArticleParams,
  UpdateArticleParams,
  CategoryForSelect,
} from "../types/admin-news.types";

const categorySelectFields = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  icon: true,
  order: true,
  isActive: true,
  isFeatured: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      news: true,
    },
  },
} as const;

const articleSelectFields = {
  id: true,
  categoryId: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  image: true,
  publishedAt: true,
  isActive: true,
  isFeatured: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      alt: true,
      order: true,
    },
    orderBy: { order: "asc" as const },
  },
} as const;

export class AdminNewsRepository {
  private buildCategoryWhereClause(
    filters?: AdminNewsFilters
  ): Prisma.NewsCategoryWhereInput {
    const where: Prisma.NewsCategoryWhereInput = {};

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.status && filters.status !== "all") {
      switch (filters.status) {
        case "active":
          where.isActive = true;
          break;
        case "inactive":
          where.isActive = false;
          break;
        case "featured":
          where.isFeatured = true;
          break;
      }
    }

    return where;
  }

  private buildArticleWhereClause(
    filters?: AdminNewsFilters,
    categoryId?: string
  ): Prisma.NewsWhereInput {
    const where: Prisma.NewsWhereInput = {};

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { excerpt: { contains: filters.search } },
        { content: { contains: filters.search } },
      ];
    }

    if (filters.status && filters.status !== "all") {
      switch (filters.status) {
        case "active":
          where.isActive = true;
          break;
        case "inactive":
          where.isActive = false;
          break;
        case "featured":
          where.isFeatured = true;
          break;
        case "published":
          where.isActive = true;
          where.publishedAt = { not: null, lte: new Date() };
          break;
        case "draft":
          where.OR = [
            { isActive: false },
            { publishedAt: null },
          ];
          break;
      }
    }

    if (filters.categoryId && filters.categoryId !== "all") {
      where.categoryId = filters.categoryId;
    }

    return where;
  }

  private buildCategoryOrderByClause(
    sorting?: AdminNewsSorting[]
  ): Prisma.NewsCategoryOrderByWithRelationInput[] {
    if (!sorting || sorting.length === 0) {
      return [{ order: "asc" }, { createdAt: "desc" }];
    }

    return sorting.map((sort) => {
      const direction = sort.desc ? "desc" : "asc";

      switch (sort.id) {
        case "name":
          return { name: direction };
        case "order":
          return { order: direction };
        case "createdAt":
          return { createdAt: direction };
        case "isActive":
          return { isActive: direction };
        case "isFeatured":
          return { isFeatured: direction };
        default:
          return { createdAt: "desc" };
      }
    });
  }

  private buildArticleOrderByClause(
    sorting?: AdminNewsSorting[]
  ): Prisma.NewsOrderByWithRelationInput[] {
    if (!sorting || sorting.length === 0) {
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
    }

    return sorting.map((sort) => {
      const direction = sort.desc ? "desc" : "asc";

      switch (sort.id) {
        case "title":
          return { title: direction };
        case "publishedAt":
          return { publishedAt: direction };
        case "createdAt":
          return { createdAt: direction };
        case "isActive":
          return { isActive: direction };
        case "isFeatured":
          return { isFeatured: direction };
        default:
          return { createdAt: "desc" };
      }
    });
  }

  public async getCategories(
    page: number,
    limit: number,
    sorting?: AdminNewsSorting[],
    filters?: AdminNewsFilters
  ): Promise<{ categories: NewsCategory[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildCategoryWhereClause(filters);
    const orderBy = this.buildCategoryOrderByClause(sorting);

    const [categories, total] = await Promise.all([
      db.newsCategory.findMany({
        where,
        select: categorySelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.newsCategory.count({ where }),
    ]);

    return { categories: categories as NewsCategory[], total };
  }

  public async getArticles(
    page: number,
    limit: number,
    sorting?: AdminNewsSorting[],
    filters?: AdminNewsFilters,
    categoryId?: string
  ): Promise<{ articles: NewsArticle[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildArticleWhereClause(filters, categoryId);
    const orderBy = this.buildArticleOrderByClause(sorting);

    const [articles, total] = await Promise.all([
      db.news.findMany({
        where,
        select: articleSelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.news.count({ where }),
    ]);

    return { articles: articles as NewsArticle[], total };
  }

  public async getStats(): Promise<AdminNewsStats> {
    const [
      totalCategories,
      totalArticles,
      activeCategories,
      activeArticles,
      featuredCategories,
      featuredArticles,
      publishedArticles,
    ] = await Promise.all([
      db.newsCategory.count(),
      db.news.count(),
      db.newsCategory.count({ where: { isActive: true } }),
      db.news.count({ where: { isActive: true } }),
      db.newsCategory.count({ where: { isFeatured: true } }),
      db.news.count({ where: { isFeatured: true } }),
      db.news.count({ where: { isActive: true, publishedAt: { not: null, lte: new Date() } } }),
    ]);

    return {
      totalCategories,
      totalArticles,
      activeCategories,
      activeArticles,
      featuredCategories,
      featuredArticles,
      publishedArticles,
    };
  }

  public async getCategoryById(id: string): Promise<NewsCategory | null> {
    const category = await db.newsCategory.findUnique({
      where: { id },
      select: categorySelectFields,
    });

    return category as NewsCategory | null;
  }

  public async getArticleById(id: string): Promise<NewsArticle | null> {
    const article = await db.news.findUnique({
      where: { id },
      select: articleSelectFields,
    });

    return article as NewsArticle | null;
  }

  private async generateUniqueCategorySlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(name);

    const existing = await db.newsCategory.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    if (existing.length === 0) return baseSlug;

    const slugSet = new Set(existing.map((e) => e.slug));
    if (!slugSet.has(baseSlug)) return baseSlug;

    let counter = 1;
    while (slugSet.has(`${baseSlug}-${counter}`)) {
      counter++;
    }

    return `${baseSlug}-${counter}`;
  }

  public async createCategory(data: CreateCategoryParams): Promise<NewsCategory> {
    const slug = await this.generateUniqueCategorySlug(data.name);

    const category = await db.newsCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        icon: data.icon,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
      },
      select: categorySelectFields,
    });

    return category as NewsCategory;
  }

  public async updateCategory(data: UpdateCategoryParams): Promise<NewsCategory> {
    const updateData: Prisma.NewsCategoryUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = await this.generateUniqueCategorySlug(data.name, data.id);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const category = await db.newsCategory.update({
      where: { id: data.id },
      data: updateData,
      select: categorySelectFields,
    });

    return category as NewsCategory;
  }

  public async deleteCategory(id: string): Promise<void> {
    await db.newsCategory.delete({
      where: { id },
    });
  }

  private async generateUniqueArticleSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(title);

    const existing = await db.news.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    if (existing.length === 0) return baseSlug;

    const slugSet = new Set(existing.map((e) => e.slug));
    if (!slugSet.has(baseSlug)) return baseSlug;

    let counter = 1;
    while (slugSet.has(`${baseSlug}-${counter}`)) {
      counter++;
    }

    return `${baseSlug}-${counter}`;
  }

  public async createArticle(data: CreateArticleParams): Promise<NewsArticle> {
    const slug = await this.generateUniqueArticleSlug(data.title);

    const article = await db.news.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        publishedAt: data.publishedAt,
        isActive: data.isActive ?? false,
        isFeatured: data.isFeatured ?? false,
        ...(data.images && data.images.length > 0
          ? {
              images: {
                create: data.images.map((img) => ({
                  url: img.url,
                  alt: img.alt,
                  order: img.order,
                })),
              },
            }
          : {}),
      },
      select: articleSelectFields,
    });

    return article as NewsArticle;
  }

  public async updateArticle(data: UpdateArticleParams): Promise<NewsArticle> {
    const updateData: Prisma.NewsUpdateInput = {};

    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        updateData.category = { connect: { id: data.categoryId } };
      } else {
        updateData.category = { disconnect: true };
      }
    }
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = await this.generateUniqueArticleSlug(data.title, data.id);
    }
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    if (data.images !== undefined) {
      updateData.images = {
        deleteMany: {},
        ...(data.images.length > 0
          ? {
              create: data.images.map((img) => ({
                url: img.url,
                alt: img.alt,
                order: img.order,
              })),
            }
          : {}),
      };
    }

    const article = await db.news.update({
      where: { id: data.id },
      data: updateData,
      select: articleSelectFields,
    });

    return article as NewsArticle;
  }

  public async deleteArticle(id: string): Promise<void> {
    await db.news.delete({
      where: { id },
    });
  }

  public async toggleCategoryStatus(id: string, isActive: boolean): Promise<NewsCategory> {
    const category = await db.newsCategory.update({
      where: { id },
      data: { isActive },
      select: categorySelectFields,
    });

    return category as NewsCategory;
  }

  public async toggleArticleStatus(id: string, isActive: boolean): Promise<NewsArticle> {
    const article = await db.news.update({
      where: { id },
      data: { isActive },
      select: articleSelectFields,
    });

    return article as NewsArticle;
  }

  public async toggleCategoryFeatured(id: string, isFeatured: boolean): Promise<NewsCategory> {
    const category = await db.newsCategory.update({
      where: { id },
      data: { isFeatured },
      select: categorySelectFields,
    });

    return category as NewsCategory;
  }

  public async toggleArticleFeatured(id: string, isFeatured: boolean): Promise<NewsArticle> {
    const article = await db.news.update({
      where: { id },
      data: { isFeatured },
      select: articleSelectFields,
    });

    return article as NewsArticle;
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    const categories = await db.newsCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return categories;
  }
}
