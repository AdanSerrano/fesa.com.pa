export interface AdminCatalogPage {
  id: string;
  imageUrl: string;
  alt: string | null;
  order: number;
}

export interface AdminCatalog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number;
  coverImage: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: { pages: number };
  pages?: AdminCatalogPage[];
}

export interface AdminCatalogsStats {
  total: number;
  active: number;
  featured: number;
  totalPages: number;
}

export interface CreateCatalogParams {
  title: string;
  slug?: string;
  description?: string | null;
  year: number;
  coverImage?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  pages?: PageInput[];
}

export interface UpdateCatalogParams {
  id: string;
  title?: string;
  slug?: string;
  description?: string | null;
  year?: number;
  coverImage?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  pages?: PageInput[];
}

export interface PageInput {
  id?: string;
  imageUrl: string;
  alt?: string | null;
  order: number;
}

export interface AdminCatalogsFilters {
  search?: string;
  year?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface AdminCatalogsSorting {
  field: string;
  direction: "asc" | "desc";
}

export interface GetCatalogsParams {
  page?: number;
  limit?: number;
  sorting?: AdminCatalogsSorting[];
  filters?: AdminCatalogsFilters;
}

export interface AdminCatalogsActionResult {
  success?: string;
  error?: string;
  data?: AdminCatalog;
}

export type AdminCatalogsDialogType =
  | "catalog-create"
  | "catalog-edit"
  | "catalog-delete"
  | "catalog-details"
  | null;
