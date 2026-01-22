export type ProductStatus = "active" | "inactive" | "discontinued";
export type ProductCategory = "electronics" | "clothing" | "food" | "books" | "other";

export interface DemoProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  status: ProductStatus;
  sku: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoProductFilters {
  search: string;
  status: ProductStatus | "all";
  category: ProductCategory | "all";
}

export interface DemoProductStats {
  total: number;
  active: number;
  inactive: number;
  discontinued: number;
  lowStock: number;
  totalValue: number;
}

export interface DemoTablePagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

export interface DemoTableSorting {
  id: string;
  desc: boolean;
}

export interface GetProductsParams {
  page: number;
  pageSize: number;
  filters: DemoProductFilters;
  sorting: DemoTableSorting[];
}

export interface GetProductsResult {
  data: DemoProduct[];
  pagination: DemoTablePagination;
}

export type DialogType = "details" | "delete" | null;
