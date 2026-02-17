import { unstable_cache } from "next/cache";
import { db } from "@/utils/db";
import type { PublicProductCategory, PublicProductItem } from "../types/products.types";

const _getActiveCategories = unstable_cache(
  async (): Promise<PublicProductCategory[]> => {
    const categories = await db.productCategory.findMany({
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
  ["products-active-categories"],
  { tags: ["products"], revalidate: 3600 }
);

const _getFeaturedProducts = unstable_cache(
  async (limit: number): Promise<PublicProductItem[]> => {
    const items = await db.productItem.findMany({
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
        price: true,
        sku: true,
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
      price: item.price ? Number(item.price) : null,
      sku: item.sku,
      categoryName: item.category?.name || "",
      categorySlug: item.category?.slug || "",
    }));
  },
  ["products-featured"],
  { tags: ["products"], revalidate: 3600 }
);

const _getCategoryBySlug = unstable_cache(
  async (
    slug: string
  ): Promise<(PublicProductCategory & { items: PublicProductItem[] }) | null> => {
    const category = await db.productCategory.findFirst({
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
            price: true,
            sku: true,
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
        price: item.price ? Number(item.price) : null,
        sku: item.sku,
        categoryName: category.name,
        categorySlug: category.slug,
      })),
    };
  },
  ["products-category-by-slug"],
  { tags: ["products"], revalidate: 3600 }
);

const _getProductBySlug = unstable_cache(
  async (
    categorySlug: string,
    productSlug: string
  ): Promise<PublicProductItem | null> => {
    const item = await db.productItem.findFirst({
      where: {
        isActive: true,
        slug: productSlug,
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
        price: true,
        sku: true,
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
      price: item.price ? Number(item.price) : null,
      sku: item.sku,
      categoryName: item.category?.name || "",
      categorySlug: item.category?.slug || "",
    };
  },
  ["products-product-by-slug"],
  { tags: ["products"], revalidate: 3600 }
);

export class PublicProductsRepository {
  public async getActiveCategories(): Promise<PublicProductCategory[]> {
    return _getActiveCategories();
  }

  public async getFeaturedProducts(limit: number = 6): Promise<PublicProductItem[]> {
    return _getFeaturedProducts(limit);
  }

  public async getCategoryBySlug(
    slug: string
  ): Promise<(PublicProductCategory & { items: PublicProductItem[] }) | null> {
    return _getCategoryBySlug(slug);
  }

  public async getProductBySlug(
    categorySlug: string,
    productSlug: string
  ): Promise<PublicProductItem | null> {
    return _getProductBySlug(categorySlug, productSlug);
  }
}
