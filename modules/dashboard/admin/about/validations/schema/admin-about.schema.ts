import { z } from "zod";

export const updateAboutSectionSchema = z.object({
  section: z.enum(["history", "mission", "vision"]),
  title: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  mediaType: z.enum(["image", "video"]).nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAboutSectionInput = z.infer<typeof updateAboutSectionSchema>;
