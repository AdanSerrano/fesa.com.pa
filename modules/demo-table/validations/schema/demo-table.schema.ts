import { z } from "zod";

export const productStatusSchema = z.enum(["active", "inactive", "discontinued"]);
export const productCategorySchema = z.enum(["electronics", "clothing", "food", "books", "other"]);

export const demoProductFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.union([productStatusSchema, z.literal("all")]).default("all"),
  category: z.union([productCategorySchema, z.literal("all")]).default("all"),
});

export const sortingSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getProductsParamsSchema = z.object({
  page: z.number().min(0),
  pageSize: z.number().min(1).max(100),
  filters: demoProductFiltersSchema,
  sorting: z.array(sortingSchema),
});

export type DemoProductFiltersInput = z.infer<typeof demoProductFiltersSchema>;
export type GetProductsParamsInput = z.infer<typeof getProductsParamsSchema>;
