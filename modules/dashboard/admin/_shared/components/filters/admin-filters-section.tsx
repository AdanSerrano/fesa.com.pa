"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { CategoryForSelect } from "../../types/admin-shared.types";

interface BaseFiltersLabels {
  status: string;
  allStatuses: string;
  active: string;
  inactive: string;
  featured: string;
  category: string;
  allCategories: string;
  clearFilters: string;
}

interface ProductFiltersLabels extends BaseFiltersLabels {
  price: string;
  allPrices: string;
  withPrice: string;
  withoutPrice: string;
  sku: string;
  allSkus: string;
  withSku: string;
  withoutSku: string;
}

interface BaseFiltersState {
  search: string;
  status: string;
  categoryId: string;
  priceFilter?: string;
  skuFilter?: string;
}

interface AdminFiltersSectionProps<T extends BaseFiltersState = BaseFiltersState> {
  filters: T;
  categories: CategoryForSelect[];
  onFiltersChange: (filters: T) => void;
  onReset: () => void;
  labels: BaseFiltersLabels | ProductFiltersLabels;
  showProductFilters?: boolean;
}

function isProductLabels(labels: BaseFiltersLabels | ProductFiltersLabels): labels is ProductFiltersLabels {
  return "price" in labels;
}

function AdminFiltersSectionInner<T extends BaseFiltersState>({
  filters,
  categories,
  onFiltersChange,
  onReset,
  labels,
  showProductFilters = false,
}: AdminFiltersSectionProps<T>) {
  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        categoryId: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handlePriceFilterChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        priceFilter: value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSkuFilterChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        skuFilter: value,
      });
    },
    [filters, onFiltersChange]
  );

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.categoryId !== "all" ||
    (showProductFilters && filters.priceFilter !== "all") ||
    (showProductFilters && filters.skuFilter !== "all");

  const productLabels = showProductFilters && isProductLabels(labels) ? labels : null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={labels.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{labels.allStatuses}</SelectItem>
          <SelectItem value="active">{labels.active}</SelectItem>
          <SelectItem value="inactive">{labels.inactive}</SelectItem>
          <SelectItem value="featured">{labels.featured}</SelectItem>
        </SelectContent>
      </Select>

      {categories.length > 0 && (
        <Select value={filters.categoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={labels.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{labels.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showProductFilters && productLabels && (
        <>
          <Select value={filters.priceFilter} onValueChange={handlePriceFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={productLabels.price} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{productLabels.allPrices}</SelectItem>
              <SelectItem value="with-price">{productLabels.withPrice}</SelectItem>
              <SelectItem value="without-price">{productLabels.withoutPrice}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.skuFilter} onValueChange={handleSkuFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={productLabels.sku} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{productLabels.allSkus}</SelectItem>
              <SelectItem value="with-sku">{productLabels.withSku}</SelectItem>
              <SelectItem value="without-sku">{productLabels.withoutSku}</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
          <X className="mr-2 h-4 w-4" />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  );
}

export const AdminFiltersSection = memo(AdminFiltersSectionInner) as typeof AdminFiltersSectionInner;
