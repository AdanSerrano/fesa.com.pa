import { db } from "@/utils/db";
import type { PublicServiceCategory, PublicServiceItem } from "../types/services.types";

export class PublicServicesRepository {
  public async getActiveCategories(): Promise<PublicServiceCategory[]> {
    const categories = await db.serviceCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return categories;
  }

  public async getFeaturedServices(limit: number = 6): Promise<PublicServiceItem[]> {
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
  }

  public async getCategoryBySlug(
    slug: string
  ): Promise<(PublicServiceCategory & { items: PublicServiceItem[] }) | null> {
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
  }

  public async getServiceBySlug(
    categorySlug: string,
    serviceSlug: string
  ): Promise<PublicServiceItem | null> {
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
  }
}
