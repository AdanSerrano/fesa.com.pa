import type {
  BaseCategory,
  BaseItem,
  BaseFilters,
  BaseStats,
  BaseDialogType,
  BasePagination,
  BaseSorting,
  CategoryForSelect,
  CreateResult,
  BaseActionResult,
} from "../../_shared/types/admin-shared.types";

export type { CategoryForSelect, CreateResult };

export type ProductCategory = BaseCategory;

export interface ProductItem extends BaseItem {
  price: number | null;
  sku: string | null;
}

export type AdminProductStatus = "active" | "inactive" | "featured" | "all";

export type AdminProductPriceFilter = "all" | "with-price" | "without-price";

export type AdminProductSkuFilter = "all" | "with-sku" | "without-sku";

export interface AdminProductsFilters extends BaseFilters {
  priceFilter?: AdminProductPriceFilter;
  skuFilter?: AdminProductSkuFilter;
}

export type AdminProductsStats = BaseStats;

export type AdminProductsDialogType = BaseDialogType;

export type AdminProductsPagination = BasePagination;

export type AdminProductsSorting = BaseSorting;

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

export interface AdminProductsActionResult extends BaseActionResult {
  data?: GetCategoriesResult | GetItemsResult | CreateResult;
}
