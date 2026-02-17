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

export type ServiceCategory = BaseCategory;

export type ServiceItem = BaseItem;

export type AdminServiceStatus = "active" | "inactive" | "featured" | "all";

export type AdminServicesFilters = BaseFilters;

export type AdminServicesStats = BaseStats;

export type AdminServicesDialogType = BaseDialogType;

export type AdminServicesPagination = BasePagination;

export type AdminServicesSorting = BaseSorting;

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

export interface AdminServicesActionResult extends BaseActionResult {
  data?: GetCategoriesResult | GetItemsResult | CreateResult;
}
