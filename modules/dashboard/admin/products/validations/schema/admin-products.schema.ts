import { z } from "zod";

export const adminProductsFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.enum(["active", "inactive", "featured", "all"]).default("all"),
  categoryId: z.string().default("all"),
  priceFilter: z.enum(["all", "with-price", "without-price"]).default("all").optional(),
  skuFilter: z.enum(["all", "with-sku", "without-sku"]).default("all").optional(),
});

export const getCategoriesParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .optional(),
  filters: adminProductsFiltersSchema.optional(),
});

export const getItemsParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .optional(),
  filters: adminProductsFiltersSchema.optional(),
  categoryId: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1, "ID de categoría requerido"),
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.string().min(1, "ID de categoría requerido"),
});

export const createItemSchema = z.object({
  categoryId: z.string().nullable().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  price: z.number().nullable().optional(),
  sku: z.string().nullable().optional(),
});

export const updateItemSchema = z.object({
  id: z.string().min(1, "ID de producto requerido"),
  categoryId: z.string().nullable().optional(),
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  price: z.number().nullable().optional(),
  sku: z.string().nullable().optional(),
});

export const deleteItemSchema = z.object({
  id: z.string().min(1, "ID de producto requerido"),
});

export const toggleStatusSchema = z.object({
  id: z.string().min(1, "ID requerido"),
  isActive: z.boolean(),
});

export const toggleFeaturedSchema = z.object({
  id: z.string().min(1, "ID requerido"),
  isFeatured: z.boolean(),
});

export type AdminProductsFiltersInput = z.infer<typeof adminProductsFiltersSchema>;
export type GetCategoriesParamsInput = z.infer<typeof getCategoriesParamsSchema>;
export type GetItemsParamsInput = z.infer<typeof getItemsParamsSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type DeleteItemInput = z.infer<typeof deleteItemSchema>;
export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;
export type ToggleFeaturedInput = z.infer<typeof toggleFeaturedSchema>;
