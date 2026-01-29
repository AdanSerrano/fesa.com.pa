import { db } from "@/utils/db";
import type { AboutSection, AboutPageData } from "../types/about.types";

export class PublicAboutRepository {
  public async getAboutPageData(): Promise<AboutPageData> {
    const sections = await db.aboutContent.findMany({
      where: { isActive: true },
      select: {
        id: true,
        section: true,
        title: true,
        content: true,
        mediaType: true,
        mediaUrl: true,
        isActive: true,
        order: true,
      },
      orderBy: { order: "asc" },
    });

    const history = sections.find((s) => s.section === "history") as AboutSection | undefined;
    const mission = sections.find((s) => s.section === "mission") as AboutSection | undefined;
    const vision = sections.find((s) => s.section === "vision") as AboutSection | undefined;

    return {
      history: history || null,
      mission: mission || null,
      vision: vision || null,
    };
  }

  public async getSectionByKey(section: string): Promise<AboutSection | null> {
    const data = await db.aboutContent.findFirst({
      where: { section, isActive: true },
      select: {
        id: true,
        section: true,
        title: true,
        content: true,
        mediaType: true,
        mediaUrl: true,
        isActive: true,
        order: true,
      },
    });

    return data as AboutSection | null;
  }
}
