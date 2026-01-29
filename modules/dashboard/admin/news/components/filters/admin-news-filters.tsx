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
  AdminNewsFilters,
  AdminNewsStatus,
  CategoryForSelect,
} from "../../types/admin-news.types";

interface FiltersLabels {
  status: string;
  allStatuses: string;
  active: string;
  inactive: string;
  featured: string;
  published: string;
  draft: string;
  category: string;
  allCategories: string;
  clearFilters: string;
}

interface AdminNewsFiltersSectionProps {
  filters: AdminNewsFilters;
  categories: CategoryForSelect[];
  onFiltersChange: (filters: AdminNewsFilters) => void;
  onReset: () => void;
  labels: FiltersLabels;
  showArticleFilters?: boolean;
}

export const AdminNewsFiltersSection = memo(function AdminNewsFiltersSection({
  filters,
  categories,
  onFiltersChange,
  onReset,
  labels,
  showArticleFilters = false,
}: AdminNewsFiltersSectionProps) {
  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value as AdminNewsStatus,
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

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.categoryId !== "all";

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
          {showArticleFilters && (
            <>
              <SelectItem value="published">{labels.published}</SelectItem>
              <SelectItem value="draft">{labels.draft}</SelectItem>
            </>
          )}
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

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
          <X className="mr-2 h-4 w-4" />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  );
});
