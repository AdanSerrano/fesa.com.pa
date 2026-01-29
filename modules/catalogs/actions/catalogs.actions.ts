"use server";

import { CatalogsRepository } from "../repository/catalogs.repository";
import type { Catalog, CatalogListItem, CatalogsByYear } from "../types/catalogs.types";

const repository = new CatalogsRepository();

export async function getCatalogsAction(): Promise<CatalogListItem[]> {
  return repository.getActiveCatalogs();
}

export async function getCatalogsByYearAction(): Promise<CatalogsByYear[]> {
  return repository.getCatalogsByYear();
}

export async function getFeaturedCatalogsAction(limit?: number): Promise<CatalogListItem[]> {
  return repository.getFeaturedCatalogs(limit);
}

export async function getCatalogBySlugAction(slug: string): Promise<Catalog | null> {
  return repository.getCatalogBySlug(slug);
}

export async function getCatalogYearsAction(): Promise<number[]> {
  return repository.getYears();
}
