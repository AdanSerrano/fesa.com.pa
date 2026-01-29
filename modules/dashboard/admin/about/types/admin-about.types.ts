export interface AboutSection {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
  mediaType: string | null;
  mediaUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateAboutSectionParams {
  section: string;
  title?: string | null;
  content?: string | null;
  mediaType?: string | null;
  mediaUrl?: string | null;
  isActive?: boolean;
}

export interface AdminAboutActionResult {
  success?: string;
  error?: string;
  data?: AboutSection;
}
