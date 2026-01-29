import { z } from "zod";

export const adminNewsFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.enum(["active", "inactive", "featured", "published", "draft", "all"]).default("all"),
  categoryId: z.string().default("all"),
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
  filters: adminNewsFiltersSchema.optional(),
});

export const getArticlesParamsSchema = z.object({
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
  filters: adminNewsFiltersSchema.optional(),
  categoryId: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1, "ID de categoría requerido"),
  name: z.string().min(1, "El nombre es requerido").optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.string().min(1, "ID de categoría requerido"),
});

const imageInputSchema = z.object({
  url: z.string(),
  alt: z.string().nullable().optional(),
  order: z.number(),
});

export const createArticleSchema = z.object({
  categoryId: z.string().nullable().optional(),
  title: z.string().min(1, "El título es requerido"),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  images: z.array(imageInputSchema).optional(),
  publishedAt: z.date().nullable().optional(),
  isActive: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const updateArticleSchema = z.object({
  id: z.string().min(1, "ID de artículo requerido"),
  categoryId: z.string().nullable().optional(),
  title: z.string().min(1, "El título es requerido").optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  images: z.array(imageInputSchema).optional(),
  publishedAt: z.date().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const deleteArticleSchema = z.object({
  id: z.string().min(1, "ID de artículo requerido"),
});

export const toggleStatusSchema = z.object({
  id: z.string().min(1, "ID requerido"),
  isActive: z.boolean(),
});

export const toggleFeaturedSchema = z.object({
  id: z.string().min(1, "ID requerido"),
  isFeatured: z.boolean(),
});

export type AdminNewsFiltersInput = z.infer<typeof adminNewsFiltersSchema>;
export type GetCategoriesParamsInput = z.infer<typeof getCategoriesParamsSchema>;
export type GetArticlesParamsInput = z.infer<typeof getArticlesParamsSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type DeleteArticleInput = z.infer<typeof deleteArticleSchema>;
export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;
export type ToggleFeaturedInput = z.infer<typeof toggleFeaturedSchema>;
