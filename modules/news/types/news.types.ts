export interface PublicNewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  articleCount: number;
}

export interface NewsImageData {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface PublicNewsArticle {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  images: NewsImageData[];
  publishedAt: Date | null;
  categoryName: string;
  categorySlug: string;
}

export interface PublicNewsTag {
  id: string;
  name: string;
  slug: string;
}

export interface NewsPageData {
  categories: PublicNewsCategory[];
  featuredNews: PublicNewsArticle[];
  recentNews: PublicNewsArticle[];
}
