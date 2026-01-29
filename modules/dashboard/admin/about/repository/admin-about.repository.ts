import { db } from "@/utils/db";
import type { AboutSection, UpdateAboutSectionParams } from "../types/admin-about.types";

const selectFields = {
  id: true,
  section: true,
  title: true,
  content: true,
  mediaType: true,
  mediaUrl: true,
  isActive: true,
  order: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AdminAboutRepository {
  public async getAllSections(): Promise<AboutSection[]> {
    const sections = await db.aboutContent.findMany({
      select: selectFields,
      orderBy: { order: "asc" },
    });

    return sections as AboutSection[];
  }

  public async getSectionByKey(section: string): Promise<AboutSection | null> {
    const data = await db.aboutContent.findFirst({
      where: { section },
      select: selectFields,
    });

    return data as AboutSection | null;
  }

  public async upsertSection(data: UpdateAboutSectionParams): Promise<AboutSection> {
    const orderMap: Record<string, number> = {
      history: 1,
      mission: 2,
      vision: 3,
    };

    const section = await db.aboutContent.upsert({
      where: { section: data.section },
      create: {
        section: data.section,
        title: data.title,
        content: data.content,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        isActive: data.isActive ?? true,
        order: orderMap[data.section] || 0,
      },
      update: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.mediaType !== undefined && { mediaType: data.mediaType }),
        ...(data.mediaUrl !== undefined && { mediaUrl: data.mediaUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: selectFields,
    });

    return section as AboutSection;
  }

  public async toggleSectionStatus(section: string, isActive: boolean): Promise<AboutSection> {
    const data = await db.aboutContent.update({
      where: { section },
      data: { isActive },
      select: selectFields,
    });

    return data as AboutSection;
  }
}
