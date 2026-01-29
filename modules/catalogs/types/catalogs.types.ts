export interface CatalogPage {
  id: string;
  imageUrl: string;
  alt: string | null;
  order: number;
}

export interface Catalog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number;
  coverImage: string | null;
  pages: CatalogPage[];
}

export interface CatalogListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number;
  coverImage: string | null;
  pageCount: number;
}

export interface CatalogsByYear {
  year: number;
  catalogs: CatalogListItem[];
}
