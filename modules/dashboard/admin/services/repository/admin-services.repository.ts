import { db } from "@/utils/db";
import type { Prisma } from "@/app/prisma/client";
import { generateSlug } from "@/utils/slug";
import type {
  ServiceCategory,
  ServiceItem,
  AdminServicesFilters,
  AdminServicesSorting,
  AdminServicesStats,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateItemParams,
  UpdateItemParams,
  CategoryForSelect,
} from "../types/admin-services.types";

const categorySelectFields = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  isFeatured: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      items: true,
    },
  },
} as const;

const itemSelectFields = {
  id: true,
  categoryId: true,
  name: true,
  slug: true,
  description: true,
  image: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export class AdminServicesRepository {
  private buildCategoryWhereClause(
    filters?: AdminServicesFilters
  ): Prisma.ServiceCategoryWhereInput {
    const where: Prisma.ServiceCategoryWhereInput = {};

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.status && filters.status !== "all") {
      switch (filters.status) {
        case "active":
          where.isActive = true;
          break;
        case "inactive":
          where.isActive = false;
          break;
        case "featured":
          where.isFeatured = true;
          break;
      }
    }

    return where;
  }

  private buildItemWhereClause(
    filters?: AdminServicesFilters,
    categoryId?: string
  ): Prisma.ServiceItemWhereInput {
    const where: Prisma.ServiceItemWhereInput = {};

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.status && filters.status !== "all") {
      switch (filters.status) {
        case "active":
          where.isActive = true;
          break;
        case "inactive":
          where.isActive = false;
          break;
      }
    }

    if (filters.categoryId && filters.categoryId !== "all") {
      where.categoryId = filters.categoryId;
    }

    return where;
  }

  private buildCategoryOrderByClause(
    sorting?: AdminServicesSorting[]
  ): Prisma.ServiceCategoryOrderByWithRelationInput[] {
    if (!sorting || sorting.length === 0) {
      return [{ createdAt: "desc" }];
    }

    return sorting.map((sort) => {
      const direction = sort.desc ? "desc" : "asc";

      switch (sort.id) {
        case "name":
          return { name: direction };
        case "createdAt":
          return { createdAt: direction };
        case "isActive":
          return { isActive: direction };
        case "isFeatured":
          return { isFeatured: direction };
        default:
          return { createdAt: "desc" };
      }
    });
  }

  private buildItemOrderByClause(
    sorting?: AdminServicesSorting[]
  ): Prisma.ServiceItemOrderByWithRelationInput[] {
    if (!sorting || sorting.length === 0) {
      return [{ createdAt: "desc" }];
    }

    return sorting.map((sort) => {
      const direction = sort.desc ? "desc" : "asc";

      switch (sort.id) {
        case "name":
          return { name: direction };
        case "createdAt":
          return { createdAt: direction };
        case "isActive":
          return { isActive: direction };
        default:
          return { createdAt: "desc" };
      }
    });
  }

  public async getCategories(
    page: number,
    limit: number,
    sorting?: AdminServicesSorting[],
    filters?: AdminServicesFilters
  ): Promise<{ categories: ServiceCategory[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildCategoryWhereClause(filters);
    const orderBy = this.buildCategoryOrderByClause(sorting);

    const [categories, total] = await Promise.all([
      db.serviceCategory.findMany({
        where,
        select: categorySelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.serviceCategory.count({ where }),
    ]);

    return { categories: categories as ServiceCategory[], total };
  }

  public async getItems(
    page: number,
    limit: number,
    sorting?: AdminServicesSorting[],
    filters?: AdminServicesFilters,
    categoryId?: string
  ): Promise<{ items: ServiceItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildItemWhereClause(filters, categoryId);
    const orderBy = this.buildItemOrderByClause(sorting);

    const [items, total] = await Promise.all([
      db.serviceItem.findMany({
        where,
        select: itemSelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.serviceItem.count({ where }),
    ]);

    return { items: items as ServiceItem[], total };
  }

  public async getStats(): Promise<AdminServicesStats> {
    const [
      totalCategories,
      totalItems,
      activeCategories,
      activeItems,
      featuredCategories,
    ] = await Promise.all([
      db.serviceCategory.count(),
      db.serviceItem.count(),
      db.serviceCategory.count({ where: { isActive: true } }),
      db.serviceItem.count({ where: { isActive: true } }),
      db.serviceCategory.count({ where: { isFeatured: true } }),
    ]);

    return {
      totalCategories,
      totalItems,
      activeCategories,
      activeItems,
      featuredCategories,
    };
  }

  public async getCategoryById(id: string): Promise<ServiceCategory | null> {
    const category = await db.serviceCategory.findUnique({
      where: { id },
      select: categorySelectFields,
    });

    return category as ServiceCategory | null;
  }

  public async getItemById(id: string): Promise<ServiceItem | null> {
    const item = await db.serviceItem.findUnique({
      where: { id },
      select: itemSelectFields,
    });

    return item as ServiceItem | null;
  }

  private async generateUniqueCategorySlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(name);

    const existing = await db.serviceCategory.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    if (existing.length === 0) return baseSlug;

    const slugSet = new Set(existing.map((e) => e.slug));
    if (!slugSet.has(baseSlug)) return baseSlug;

    let counter = 1;
    while (slugSet.has(`${baseSlug}-${counter}`)) {
      counter++;
    }

    return `${baseSlug}-${counter}`;
  }

  public async createCategory(data: CreateCategoryParams): Promise<ServiceCategory> {
    const slug = await this.generateUniqueCategorySlug(data.name);

    const category = await db.serviceCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
      },
      select: categorySelectFields,
    });

    return category as ServiceCategory;
  }

  public async updateCategory(data: UpdateCategoryParams): Promise<ServiceCategory> {
    const updateData: Prisma.ServiceCategoryUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = await this.generateUniqueCategorySlug(data.name, data.id);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const category = await db.serviceCategory.update({
      where: { id: data.id },
      data: updateData,
      select: categorySelectFields,
    });

    return category as ServiceCategory;
  }

  public async deleteCategory(id: string): Promise<void> {
    await db.serviceCategory.delete({
      where: { id },
    });
  }

  private async generateUniqueItemSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(name);

    const existing = await db.serviceItem.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { slug: true },
    });

    if (existing.length === 0) return baseSlug;

    const slugSet = new Set(existing.map((e) => e.slug));
    if (!slugSet.has(baseSlug)) return baseSlug;

    let counter = 1;
    while (slugSet.has(`${baseSlug}-${counter}`)) {
      counter++;
    }

    return `${baseSlug}-${counter}`;
  }

  public async createItem(data: CreateItemParams): Promise<ServiceItem> {
    const slug = await this.generateUniqueItemSlug(data.name);

    const item = await db.serviceItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        isActive: data.isActive ?? true,
      },
      select: itemSelectFields,
    });

    return item as ServiceItem;
  }

  public async updateItem(data: UpdateItemParams): Promise<ServiceItem> {
    const updateData: Prisma.ServiceItemUpdateInput = {};

    if (data.categoryId !== undefined) {
      if (data.categoryId) {
        updateData.category = { connect: { id: data.categoryId } };
      } else {
        updateData.category = { disconnect: true };
      }
    }
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = await this.generateUniqueItemSlug(data.name, data.id);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const item = await db.serviceItem.update({
      where: { id: data.id },
      data: updateData,
      select: itemSelectFields,
    });

    return item as ServiceItem;
  }

  public async deleteItem(id: string): Promise<void> {
    await db.serviceItem.delete({
      where: { id },
    });
  }

  public async toggleCategoryStatus(id: string, isActive: boolean): Promise<ServiceCategory> {
    const category = await db.serviceCategory.update({
      where: { id },
      data: { isActive },
      select: categorySelectFields,
    });

    return category as ServiceCategory;
  }

  public async toggleItemStatus(id: string, isActive: boolean): Promise<ServiceItem> {
    const item = await db.serviceItem.update({
      where: { id },
      data: { isActive },
      select: itemSelectFields,
    });

    return item as ServiceItem;
  }

  public async toggleCategoryFeatured(id: string, isFeatured: boolean): Promise<ServiceCategory> {
    const category = await db.serviceCategory.update({
      where: { id },
      data: { isFeatured },
      select: categorySelectFields,
    });

    return category as ServiceCategory;
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    const categories = await db.serviceCategory.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return categories;
  }
}
