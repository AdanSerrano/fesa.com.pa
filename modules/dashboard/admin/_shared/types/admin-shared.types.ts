export interface BaseCategory {
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

export interface BaseItem {
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

export type BaseStatus = "active" | "inactive" | "featured" | "all";

export interface BaseFilters {
  search: string;
  status: BaseStatus;
  categoryId: string | "all";
}

export interface BaseStats {
  totalCategories: number;
  totalItems: number;
  activeCategories: number;
  activeItems: number;
  featuredCategories: number;
}

export type BaseDialogType =
  | "category-details"
  | "category-create"
  | "category-edit"
  | "category-delete"
  | "item-details"
  | "item-create"
  | "item-edit"
  | "item-delete"
  | null;

export interface BasePagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

export interface BaseSorting {
  id: string;
  desc: boolean;
}

export interface CategoryForSelect {
  id: string;
  name: string;
}

export interface CreateResult {
  id: string;
}

export interface BaseActionResult {
  success?: string;
  error?: string;
}

export interface BaseCreateCategoryParams {
  name: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface BaseUpdateCategoryParams {
  id: string;
  name?: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export type CreateCategoryAction = (
  params: BaseCreateCategoryParams
) => Promise<BaseActionResult & { data?: unknown }>;

export type UpdateCategoryAction = (
  params: BaseUpdateCategoryParams
) => Promise<BaseActionResult>;
