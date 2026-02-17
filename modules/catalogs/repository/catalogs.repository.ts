import { unstable_cache } from "next/cache";
import { db } from "@/utils/db";
import type { Catalog, CatalogListItem, CatalogsByYear } from "../types/catalogs.types";

const _getActiveCatalogs = unstable_cache(
  async (): Promise<CatalogListItem[]> => {
    const catalogs = await db.catalog.findMany({
      where: { isActive: true },
      orderBy: [{ year: "desc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        year: true,
        coverImage: true,
        _count: { select: { pages: true } },
      },
    });

    return catalogs.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      year: c.year,
      coverImage: c.coverImage,
      pageCount: c._count.pages,
    }));
  },
  ["catalogs-active"],
  { tags: ["catalogs"], revalidate: 3600 }
);

const _getFeaturedCatalogs = unstable_cache(
  async (limit: number): Promise<CatalogListItem[]> => {
    const catalogs = await db.catalog.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        year: true,
        coverImage: true,
        _count: { select: { pages: true } },
      },
    });

    return catalogs.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      year: c.year,
      coverImage: c.coverImage,
      pageCount: c._count.pages,
    }));
  },
  ["catalogs-featured"],
  { tags: ["catalogs"], revalidate: 3600 }
);

const _getCatalogBySlug = unstable_cache(
  async (slug: string): Promise<Catalog | null> => {
    const catalog = await db.catalog.findUnique({
      where: { slug, isActive: true },
      include: {
        pages: { orderBy: { order: "asc" } },
      },
    });

    if (!catalog) return null;

    return {
      id: catalog.id,
      title: catalog.title,
      slug: catalog.slug,
      description: catalog.description,
      year: catalog.year,
      coverImage: catalog.coverImage,
      pages: catalog.pages.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        alt: p.alt,
        order: p.order,
      })),
    };
  },
  ["catalogs-by-slug"],
  { tags: ["catalogs"], revalidate: 3600 }
);

const _getYears = unstable_cache(
  async (): Promise<number[]> => {
    const years = await db.catalog.findMany({
      where: { isActive: true },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    return years.map((y) => y.year);
  },
  ["catalogs-years"],
  { tags: ["catalogs"], revalidate: 3600 }
);

export class CatalogsRepository {
  public async getActiveCatalogs(): Promise<CatalogListItem[]> {
    return _getActiveCatalogs();
  }

  public async getCatalogsByYear(): Promise<CatalogsByYear[]> {
    const catalogs = await _getActiveCatalogs();

    const byYear = new Map<number, CatalogListItem[]>();

    for (const catalog of catalogs) {
      const existing = byYear.get(catalog.year) || [];
      existing.push(catalog);
      byYear.set(catalog.year, existing);
    }

    const result: CatalogsByYear[] = [];
    for (const [year, yearCatalogs] of byYear.entries()) {
      result.push({ year, catalogs: yearCatalogs });
    }

    return result.sort((a, b) => b.year - a.year);
  }

  public async getFeaturedCatalogs(limit: number = 4): Promise<CatalogListItem[]> {
    return _getFeaturedCatalogs(limit);
  }

  public async getCatalogBySlug(slug: string): Promise<Catalog | null> {
    return _getCatalogBySlug(slug);
  }

  public async getYears(): Promise<number[]> {
    return _getYears();
  }
}
