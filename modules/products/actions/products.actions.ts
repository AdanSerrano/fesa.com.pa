"use server";

import { PublicProductsRepository } from "../repository/products.repository";
import type { PublicProductCategory, PublicProductItem, ProductsPageData } from "../types/products.types";

const repository = new PublicProductsRepository();

export async function getProductsPageDataAction(): Promise<ProductsPageData> {
  try {
    const [categories, featuredProducts] = await Promise.all([
      repository.getActiveCategories(),
      repository.getFeaturedProducts(6),
    ]);

    return { categories, featuredProducts };
  } catch (error) {
    console.error("Error fetching products page data:", error);
    return { categories: [], featuredProducts: [] };
  }
}

export async function getCategoryWithItemsAction(
  slug: string
): Promise<(PublicProductCategory & { items: PublicProductItem[] }) | null> {
  try {
    return await repository.getCategoryBySlug(slug);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getProductDetailAction(
  categorySlug: string,
  productSlug: string
): Promise<PublicProductItem | null> {
  try {
    return await repository.getProductBySlug(categorySlug, productSlug);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
