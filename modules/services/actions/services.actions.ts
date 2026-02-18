"use server";

import { PublicServicesRepository } from "../repository/services.repository";
import type { PublicServiceCategory, PublicServiceItem, ServicesPageData } from "../types/services.types";

const repository = new PublicServicesRepository();

export async function getServicesPageDataAction(): Promise<ServicesPageData> {
  try {
    const [categories, featuredServices] = await Promise.all([
      repository.getActiveCategories(),
      repository.getFeaturedServices(6),
    ]);

    return { categories, featuredServices };
  } catch {
    return { categories: [], featuredServices: [] };
  }
}

export async function getCategoryWithItemsAction(
  slug: string
): Promise<(PublicServiceCategory & { items: PublicServiceItem[] }) | null> {
  try {
    return await repository.getCategoryBySlug(slug);
  } catch {
    return null;
  }
}

export async function getServiceDetailAction(
  categorySlug: string,
  serviceSlug: string
): Promise<PublicServiceItem | null> {
  try {
    return await repository.getServiceBySlug(categorySlug, serviceSlug);
  } catch {
    return null;
  }
}
