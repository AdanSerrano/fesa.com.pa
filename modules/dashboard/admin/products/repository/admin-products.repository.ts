import { db } from "@/utils/db";
import type { Prisma } from "@/app/prisma/client";
import { generateSlug } from "@/utils/slug";
import type {
  ProductCategory,
  ProductItem,
  AdminProductsFilters,
  AdminProductsSorting,
  AdminProductsStats,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateItemParams,
  UpdateItemParams,
  CategoryForSelect,
} from "../types/admin-products.types";

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
  price: true,
  sku: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export class AdminProductsRepository {
  private buildCategoryWhereClause(
    filters?: AdminProductsFilters
  ): Prisma.ProductCategoryWhereInput {
    const where: Prisma.ProductCategoryWhereInput = {};

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
    filters?: AdminProductsFilters,
    categoryId?: string
  ): Prisma.ProductItemWhereInput {
    const where: Prisma.ProductItemWhereInput = {};

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { sku: { contains: filters.search } },
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

    if (filters.priceFilter && filters.priceFilter !== "all") {
      if (filters.priceFilter === "with-price") {
        where.price = { not: null };
      } else if (filters.priceFilter === "without-price") {
        where.price = null;
      }
    }

    if (filters.skuFilter && filters.skuFilter !== "all") {
      if (filters.skuFilter === "with-sku") {
        where.sku = { not: null };
      } else if (filters.skuFilter === "without-sku") {
        where.sku = null;
      }
    }

    return where;
  }

  private buildCategoryOrderByClause(
    sorting?: AdminProductsSorting[]
  ): Prisma.ProductCategoryOrderByWithRelationInput[] {
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
    sorting?: AdminProductsSorting[]
  ): Prisma.ProductItemOrderByWithRelationInput[] {
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
        case "price":
          return { price: direction };
        default:
          return { createdAt: "desc" };
      }
    });
  }

  public async getCategories(
    page: number,
    limit: number,
    sorting?: AdminProductsSorting[],
    filters?: AdminProductsFilters
  ): Promise<{ categories: ProductCategory[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildCategoryWhereClause(filters);
    const orderBy = this.buildCategoryOrderByClause(sorting);

    const [categories, total] = await Promise.all([
      db.productCategory.findMany({
        where,
        select: categorySelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.productCategory.count({ where }),
    ]);

    return { categories: categories as ProductCategory[], total };
  }

  public async getItems(
    page: number,
    limit: number,
    sorting?: AdminProductsSorting[],
    filters?: AdminProductsFilters,
    categoryId?: string
  ): Promise<{ items: ProductItem[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildItemWhereClause(filters, categoryId);
    const orderBy = this.buildItemOrderByClause(sorting);

    const [items, total] = await Promise.all([
      db.productItem.findMany({
        where,
        select: itemSelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.productItem.count({ where }),
    ]);

    const mappedItems = items.map((item) => ({
      ...item,
      price: item.price ? Number(item.price) : null,
    }));

    return { items: mappedItems as ProductItem[], total };
  }

  public async getStats(): Promise<AdminProductsStats> {
    const [
      totalCategories,
      totalItems,
      activeCategories,
      activeItems,
      featuredCategories,
    ] = await Promise.all([
      db.productCategory.count(),
      db.productItem.count(),
      db.productCategory.count({ where: { isActive: true } }),
      db.productItem.count({ where: { isActive: true } }),
      db.productCategory.count({ where: { isFeatured: true } }),
    ]);

    return {
      totalCategories,
      totalItems,
      activeCategories,
      activeItems,
      featuredCategories,
    };
  }

  public async getCategoryById(id: string): Promise<ProductCategory | null> {
    const category = await db.productCategory.findUnique({
      where: { id },
      select: categorySelectFields,
    });

    return category as ProductCategory | null;
  }

  public async getItemById(id: string): Promise<ProductItem | null> {
    const item = await db.productItem.findUnique({
      where: { id },
      select: itemSelectFields,
    });

    if (!item) return null;

    return {
      ...item,
      price: item.price ? Number(item.price) : null,
    } as ProductItem;
  }

  private async generateUniqueCategorySlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db.productCategory.findFirst({
        where: {
          slug,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
      });

      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  public async createCategory(data: CreateCategoryParams): Promise<ProductCategory> {
    const slug = await this.generateUniqueCategorySlug(data.name);

    const category = await db.productCategory.create({
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

    return category as ProductCategory;
  }

  public async updateCategory(data: UpdateCategoryParams): Promise<ProductCategory> {
    const updateData: Prisma.ProductCategoryUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = await this.generateUniqueCategorySlug(data.name, data.id);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const category = await db.productCategory.update({
      where: { id: data.id },
      data: updateData,
      select: categorySelectFields,
    });

    return category as ProductCategory;
  }

  public async deleteCategory(id: string): Promise<void> {
    await db.productCategory.delete({
      where: { id },
    });
  }

  private async generateUniqueItemSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db.productItem.findFirst({
        where: {
          slug,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
      });

      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  public async createItem(data: CreateItemParams): Promise<ProductItem> {
    const slug = await this.generateUniqueItemSlug(data.name);

    const item = await db.productItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        isActive: data.isActive ?? true,
        price: data.price,
        sku: data.sku,
      },
      select: itemSelectFields,
    });

    return {
      ...item,
      price: item.price ? Number(item.price) : null,
    } as ProductItem;
  }

  public async updateItem(data: UpdateItemParams): Promise<ProductItem> {
    const updateData: Prisma.ProductItemUpdateInput = {};

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
    if (data.price !== undefined) updateData.price = data.price;
    if (data.sku !== undefined) updateData.sku = data.sku;

    const item = await db.productItem.update({
      where: { id: data.id },
      data: updateData,
      select: itemSelectFields,
    });

    return {
      ...item,
      price: item.price ? Number(item.price) : null,
    } as ProductItem;
  }

  public async deleteItem(id: string): Promise<void> {
    await db.productItem.delete({
      where: { id },
    });
  }

  public async toggleCategoryStatus(id: string, isActive: boolean): Promise<ProductCategory> {
    const category = await db.productCategory.update({
      where: { id },
      data: { isActive },
      select: categorySelectFields,
    });

    return category as ProductCategory;
  }

  public async toggleItemStatus(id: string, isActive: boolean): Promise<ProductItem> {
    const item = await db.productItem.update({
      where: { id },
      data: { isActive },
      select: itemSelectFields,
    });

    return {
      ...item,
      price: item.price ? Number(item.price) : null,
    } as ProductItem;
  }

  public async toggleCategoryFeatured(id: string, isFeatured: boolean): Promise<ProductCategory> {
    const category = await db.productCategory.update({
      where: { id },
      data: { isFeatured },
      select: categorySelectFields,
    });

    return category as ProductCategory;
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    const categories = await db.productCategory.findMany({
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
