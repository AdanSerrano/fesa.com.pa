"use server";

import { PublicAboutRepository } from "../repository/about.repository";
import type { AboutPageData } from "../types/about.types";

const repository = new PublicAboutRepository();

export async function getAboutPageDataAction(): Promise<AboutPageData> {
  try {
    return await repository.getAboutPageData();
  } catch {
    return { history: null, mission: null, vision: null };
  }
}
