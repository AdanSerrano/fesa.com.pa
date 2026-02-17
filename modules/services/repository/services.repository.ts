import { unstable_cache } from "next/cache";
import { db } from "@/utils/db";
import type { PublicServiceCategory, PublicServiceItem } from "../types/services.types";

const _getActiveCategories = unstable_cache(
  async (): Promise<PublicServiceCategory[]> => {
    const categories = await db.serviceCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        _count: {
          select: {
            items: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      itemCount: cat._count.items,
    }));
  },
  ["services-active-categories"],
  { tags: ["services"], revalidate: 3600 }
);

const _getFeaturedServices = unstable_cache(
  async (limit: number): Promise<PublicServiceItem[]> => {
    const items = await db.serviceItem.findMany({
      where: {
        isActive: true,
        category: {
          isFeatured: true,
          isActive: true,
        },
      },
      select: {
        id: true,
        categoryId: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return items.map((item) => ({
      id: item.id,
      categoryId: item.categoryId,
      image: item.image,
      name: item.name,
      slug: item.slug,
      description: item.description,
      categoryName: item.category?.name || "",
      categorySlug: item.category?.slug || "",
    }));
  },
  ["services-featured"],
  { tags: ["services"], revalidate: 3600 }
);

const _getCategoryBySlug = unstable_cache(
  async (
    slug: string
  ): Promise<(PublicServiceCategory & { items: PublicServiceItem[] }) | null> => {
    const category = await db.serviceCategory.findFirst({
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
        items: {
          where: { isActive: true },
          select: {
            id: true,
            categoryId: true,
            name: true,
            slug: true,
            description: true,
            image: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      image: category.image,
      name: category.name,
      slug: category.slug,
      description: category.description,
      itemCount: category.items.length,
      items: category.items.map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        image: item.image,
        name: item.name,
        slug: item.slug,
        description: item.description,
        categoryName: category.name,
        categorySlug: category.slug,
      })),
    };
  },
  ["services-category-by-slug"],
  { tags: ["services"], revalidate: 3600 }
);

const _getServiceBySlug = unstable_cache(
  async (
    categorySlug: string,
    serviceSlug: string
  ): Promise<PublicServiceItem | null> => {
    const item = await db.serviceItem.findFirst({
      where: {
        isActive: true,
        slug: serviceSlug,
        category: {
          isActive: true,
          slug: categorySlug,
        },
      },
      select: {
        id: true,
        categoryId: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!item) return null;

    return {
      id: item.id,
      categoryId: item.categoryId,
      image: item.image,
      name: item.name,
      slug: item.slug,
      description: item.description,
      categoryName: item.category?.name || "",
      categorySlug: item.category?.slug || "",
    };
  },
  ["services-service-by-slug"],
  { tags: ["services"], revalidate: 3600 }
);

export class PublicServicesRepository {
  public async getActiveCategories(): Promise<PublicServiceCategory[]> {
    return _getActiveCategories();
  }

  public async getFeaturedServices(limit: number = 6): Promise<PublicServiceItem[]> {
    return _getFeaturedServices(limit);
  }

  public async getCategoryBySlug(
    slug: string
  ): Promise<(PublicServiceCategory & { items: PublicServiceItem[] }) | null> {
    return _getCategoryBySlug(slug);
  }

  public async getServiceBySlug(
    categorySlug: string,
    serviceSlug: string
  ): Promise<PublicServiceItem | null> {
    return _getServiceBySlug(categorySlug, serviceSlug);
  }
}
