import { db } from "@/utils/db";
import { generateSlug } from "@/utils/slug";
import type {
  AdminCatalog,
  AdminCatalogsStats,
  AdminCatalogsFilters,
  AdminCatalogsSorting,
  CreateCatalogParams,
  UpdateCatalogParams,
} from "../types/admin-catalogs.types";

export class AdminCatalogsRepository {
  public async getCatalogs(
    page: number = 1,
    limit: number = 10,
    sorting?: AdminCatalogsSorting[],
    filters?: AdminCatalogsFilters
  ): Promise<{ catalogs: AdminCatalog[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters?.year !== undefined) {
      where.year = filters.year;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    const orderBy: Record<string, "asc" | "desc">[] = sorting?.length
      ? sorting.map((s) => ({ [s.field]: s.direction }))
      : [{ year: "desc" }, { createdAt: "desc" }];

    const [catalogs, total] = await Promise.all([
      db.catalog.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: { select: { pages: true } },
        },
      }),
      db.catalog.count({ where }),
    ]);

    return { catalogs: catalogs as AdminCatalog[], total };
  }

  public async getCatalogById(id: string): Promise<AdminCatalog | null> {
    const catalog = await db.catalog.findUnique({
      where: { id },
      include: {
        _count: { select: { pages: true } },
        pages: { orderBy: { order: "asc" } },
      },
    });

    return catalog as AdminCatalog | null;
  }

  public async getCatalogBySlug(slug: string): Promise<AdminCatalog | null> {
    const catalog = await db.catalog.findUnique({
      where: { slug },
      include: {
        _count: { select: { pages: true } },
        pages: { orderBy: { order: "asc" } },
      },
    });

    return catalog as AdminCatalog | null;
  }

  public async createCatalog(params: CreateCatalogParams): Promise<AdminCatalog> {
    const slug = params.slug || generateSlug(params.title);

    const catalog = await db.catalog.create({
      data: {
        title: params.title,
        slug,
        description: params.description ?? null,
        year: params.year,
        coverImage: params.coverImage ?? null,
        isActive: params.isActive ?? false,
        isFeatured: params.isFeatured ?? false,
        pages: params.pages?.length
          ? {
              create: params.pages.map((p) => ({
                imageUrl: p.imageUrl,
                alt: p.alt ?? null,
                order: p.order,
              })),
            }
          : undefined,
      },
      include: {
        _count: { select: { pages: true } },
        pages: { orderBy: { order: "asc" } },
      },
    });

    return catalog as AdminCatalog;
  }

  public async updateCatalog(params: UpdateCatalogParams): Promise<AdminCatalog> {
    const updateData: Record<string, unknown> = {};

    if (params.title !== undefined) updateData.title = params.title;
    if (params.slug !== undefined) updateData.slug = params.slug;
    if (params.description !== undefined) updateData.description = params.description;
    if (params.year !== undefined) updateData.year = params.year;
    if (params.coverImage !== undefined) updateData.coverImage = params.coverImage;
    if (params.isActive !== undefined) updateData.isActive = params.isActive;
    if (params.isFeatured !== undefined) updateData.isFeatured = params.isFeatured;

    if (params.pages !== undefined) {
      updateData.pages = {
        deleteMany: {},
        ...(params.pages.length > 0
          ? {
              create: params.pages.map((p) => ({
                imageUrl: p.imageUrl,
                alt: p.alt ?? null,
                order: p.order,
              })),
            }
          : {}),
      };
    }

    const catalog = await db.catalog.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: { select: { pages: true } },
        pages: { orderBy: { order: "asc" } },
      },
    });

    return catalog as AdminCatalog;
  }

  public async deleteCatalog(id: string): Promise<void> {
    await db.catalog.delete({ where: { id } });
  }

  public async getStats(): Promise<AdminCatalogsStats> {
    const [total, active, featured, totalPages] = await Promise.all([
      db.catalog.count(),
      db.catalog.count({ where: { isActive: true } }),
      db.catalog.count({ where: { isFeatured: true } }),
      db.catalogPage.count(),
    ]);

    return { total, active, featured, totalPages };
  }

  public async getYears(): Promise<number[]> {
    const years = await db.catalog.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    return years.map((y) => y.year);
  }

  public async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const catalog = await db.catalog.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    return !!catalog;
  }
}
