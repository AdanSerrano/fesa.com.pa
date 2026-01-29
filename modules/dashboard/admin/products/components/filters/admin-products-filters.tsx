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
import type {
  AdminProductsFilters,
  AdminProductStatus,
  AdminProductPriceFilter,
  AdminProductSkuFilter,
  CategoryForSelect,
} from "../../types/admin-products.types";

interface FiltersLabels {
  status: string;
  allStatuses: string;
  active: string;
  inactive: string;
  featured: string;
  category: string;
  allCategories: string;
  clearFilters: string;
  price: string;
  allPrices: string;
  withPrice: string;
  withoutPrice: string;
  sku: string;
  allSkus: string;
  withSku: string;
  withoutSku: string;
}

interface AdminProductsFiltersSectionProps {
  filters: AdminProductsFilters;
  categories: CategoryForSelect[];
  onFiltersChange: (filters: AdminProductsFilters) => void;
  onReset: () => void;
  labels: FiltersLabels;
  showProductFilters?: boolean;
}

export const AdminProductsFiltersSection = memo(function AdminProductsFiltersSection({
  filters,
  categories,
  onFiltersChange,
  onReset,
  labels,
  showProductFilters = false,
}: AdminProductsFiltersSectionProps) {
  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value as AdminProductStatus,
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
        priceFilter: value as AdminProductPriceFilter,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSkuFilterChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        skuFilter: value as AdminProductSkuFilter,
      });
    },
    [filters, onFiltersChange]
  );

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.categoryId !== "all" ||
    (showProductFilters && filters.priceFilter !== "all") ||
    (showProductFilters && filters.skuFilter !== "all");

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

      {showProductFilters && (
        <>
          <Select value={filters.priceFilter} onValueChange={handlePriceFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={labels.price} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{labels.allPrices}</SelectItem>
              <SelectItem value="with-price">{labels.withPrice}</SelectItem>
              <SelectItem value="without-price">{labels.withoutPrice}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.skuFilter} onValueChange={handleSkuFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={labels.sku} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{labels.allSkus}</SelectItem>
              <SelectItem value="with-sku">{labels.withSku}</SelectItem>
              <SelectItem value="without-sku">{labels.withoutSku}</SelectItem>
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
});
