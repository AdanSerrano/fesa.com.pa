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
import type { AdminServicesFilters, AdminServiceStatus, CategoryForSelect } from "../../types/admin-services.types";

interface AdminServicesFiltersSectionProps {
  filters: AdminServicesFilters;
  categories: CategoryForSelect[];
  onFiltersChange: (filters: AdminServicesFilters) => void;
  onReset: () => void;
  labels: {
    status: string;
    allStatuses: string;
    active: string;
    inactive: string;
    featured: string;
    category: string;
    allCategories: string;
    clearFilters: string;
  };
}

export const AdminServicesFiltersSection = memo(function AdminServicesFiltersSection({
  filters,
  categories,
  onFiltersChange,
  onReset,
  labels,
}: AdminServicesFiltersSectionProps) {
  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value as AdminServiceStatus,
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

  const showCategoryFilter = categories.length > 0;

  const hasActiveFilters =
    filters.status !== "all" || (showCategoryFilter && filters.categoryId !== "all");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={labels.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{labels.allStatuses}</SelectItem>
          <SelectItem value="active">{labels.active}</SelectItem>
          <SelectItem value="inactive">{labels.inactive}</SelectItem>
          <SelectItem value="featured">{labels.featured}</SelectItem>
        </SelectContent>
      </Select>

      {showCategoryFilter && (
        <Select value={filters.categoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
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

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  );
});
