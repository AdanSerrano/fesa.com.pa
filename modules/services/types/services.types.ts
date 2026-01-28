export interface PublicServiceCategory {
  id: string;
  image: string | null;
  name: string;
  slug: string;
  description: string | null;
}

export interface PublicServiceItem {
  id: string;
  categoryId: string | null;
  image: string | null;
  name: string;
  slug: string;
  description: string | null;
  categoryName: string;
  categorySlug: string;
}

export interface ServicesPageData {
  categories: PublicServiceCategory[];
  featuredServices: PublicServiceItem[];
}
