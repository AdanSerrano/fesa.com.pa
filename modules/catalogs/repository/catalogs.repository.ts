import { db } from "@/utils/db";
import type { Catalog, CatalogListItem, CatalogsByYear } from "../types/catalogs.types";

export class CatalogsRepository {
  public async getActiveCatalogs(): Promise<CatalogListItem[]> {
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
  }

  public async getCatalogsByYear(): Promise<CatalogsByYear[]> {
    const catalogs = await this.getActiveCatalogs();

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
  }

  public async getCatalogBySlug(slug: string): Promise<Catalog | null> {
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
  }

  public async getYears(): Promise<number[]> {
    const years = await db.catalog.findMany({
      where: { isActive: true },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    return years.map((y) => y.year);
  }
}
