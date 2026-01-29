import { z } from "zod";

const pageInputSchema = z.object({
  id: z.string().optional(),
  tempId: z.string().optional(),
  imageUrl: z.string().min(1, "La URL de la imagen es requerida"),
  alt: z.string().nullable().optional(),
  order: z.number().int().min(0),
  isNew: z.boolean().optional(),
});

export const createCatalogSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200, "Máximo 200 caracteres"),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  year: z.number().int().min(1900, "Año inválido").max(2100, "Año inválido"),
  coverImage: z.string().nullable().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  pages: z.array(pageInputSchema).optional(),
});

export const updateCatalogSchema = z.object({
  id: z.string().min(1, "El ID es requerido"),
  title: z.string().min(1, "El título es requerido").max(200, "Máximo 200 caracteres").optional(),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  year: z.number().int().min(1900, "Año inválido").max(2100, "Año inválido").optional(),
  coverImage: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  pages: z.array(pageInputSchema).optional(),
});

export const getCatalogsParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sorting: z.array(z.object({
    field: z.string(),
    direction: z.enum(["asc", "desc"]),
  })).optional(),
  filters: z.object({
    search: z.string().optional(),
    year: z.number().int().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }).optional(),
});

export type CreateCatalogInput = z.infer<typeof createCatalogSchema>;
export type UpdateCatalogInput = z.infer<typeof updateCatalogSchema>;
export type GetCatalogsParamsInput = z.infer<typeof getCatalogsParamsSchema>;
