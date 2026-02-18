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
  } catch {
    return { categories: [], featuredProducts: [] };
  }
}

export async function getCategoryWithItemsAction(
  slug: string
): Promise<(PublicProductCategory & { items: PublicProductItem[] }) | null> {
  try {
    return await repository.getCategoryBySlug(slug);
  } catch {
    return null;
  }
}

export async function getProductDetailAction(
  categorySlug: string,
  productSlug: string
): Promise<PublicProductItem | null> {
  try {
    return await repository.getProductBySlug(categorySlug, productSlug);
  } catch {
    return null;
  }
}
