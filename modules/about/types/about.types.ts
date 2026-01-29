export interface AboutSection {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  mediaType: "image" | "video" | null;
  mediaUrl: string | null;
  isActive: boolean;
  order: number;
}

export interface AboutPageData {
  history: AboutSection | null;
  mission: AboutSection | null;
  vision: AboutSection | null;
}
