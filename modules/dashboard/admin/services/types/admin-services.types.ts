export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    items: number;
  };
}

export interface ServiceItem {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
  } | null;
}

export type AdminServiceStatus = "active" | "inactive" | "featured" | "all";

export interface AdminServicesFilters {
  search: string;
  status: AdminServiceStatus;
  categoryId: string | "all";
}

export interface AdminServicesStats {
  totalCategories: number;
  totalItems: number;
  activeCategories: number;
  activeItems: number;
  featuredCategories: number;
}

export type AdminServicesDialogType =
  | "category-details"
  | "category-create"
  | "category-edit"
  | "category-delete"
  | "item-details"
  | "item-create"
  | "item-edit"
  | "item-delete"
  | null;

export interface AdminServicesPagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

export interface AdminServicesSorting {
  id: string;
  desc: boolean;
}

export interface GetCategoriesParams {
  page: number;
  limit: number;
  sorting?: AdminServicesSorting[];
  filters?: AdminServicesFilters;
}

export interface GetItemsParams {
  page: number;
  limit: number;
  sorting?: AdminServicesSorting[];
  filters?: AdminServicesFilters;
  categoryId?: string;
}

export interface GetCategoriesResult {
  categories: ServiceCategory[];
  stats: AdminServicesStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetItemsResult {
  items: ServiceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateCategoryParams {
  name: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateCategoryParams {
  id: string;
  name?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CreateItemParams {
  categoryId?: string | null;
  name: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

export interface UpdateItemParams {
  id: string;
  categoryId?: string | null;
  name?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
}

export interface AdminServicesActionResult {
  success?: string;
  error?: string;
  data?: GetCategoriesResult | GetItemsResult;
}

export interface CategoryForSelect {
  id: string;
  name: string;
}
