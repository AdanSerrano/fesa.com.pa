export interface ProductCategory {
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

export interface ProductItem {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  price: number | null;
  sku: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
  } | null;
}

export type AdminProductStatus = "active" | "inactive" | "featured" | "all";

export type AdminProductPriceFilter = "all" | "with-price" | "without-price";

export type AdminProductSkuFilter = "all" | "with-sku" | "without-sku";

export interface AdminProductsFilters {
  search: string;
  status: AdminProductStatus;
  categoryId: string | "all";
  priceFilter?: AdminProductPriceFilter;
  skuFilter?: AdminProductSkuFilter;
}

export interface AdminProductsStats {
  totalCategories: number;
  totalItems: number;
  activeCategories: number;
  activeItems: number;
  featuredCategories: number;
}

export type AdminProductsDialogType =
  | "category-details"
  | "category-create"
  | "category-edit"
  | "category-delete"
  | "item-details"
  | "item-create"
  | "item-edit"
  | "item-delete"
  | null;

export interface AdminProductsPagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

export interface AdminProductsSorting {
  id: string;
  desc: boolean;
}

export interface GetCategoriesParams {
  page: number;
  limit: number;
  sorting?: AdminProductsSorting[];
  filters?: AdminProductsFilters;
}

export interface GetItemsParams {
  page: number;
  limit: number;
  sorting?: AdminProductsSorting[];
  filters?: AdminProductsFilters;
  categoryId?: string;
}

export interface GetCategoriesResult {
  categories: ProductCategory[];
  stats: AdminProductsStats;
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
  items: ProductItem[];
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
  price?: number | null;
  sku?: string | null;
}

export interface UpdateItemParams {
  id: string;
  categoryId?: string | null;
  name?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  price?: number | null;
  sku?: string | null;
}

export interface CreateResult {
  id: string;
}

export interface AdminProductsActionResult {
  success?: string;
  error?: string;
  data?: GetCategoriesResult | GetItemsResult | CreateResult;
}

export interface CategoryForSelect {
  id: string;
  name: string;
}
