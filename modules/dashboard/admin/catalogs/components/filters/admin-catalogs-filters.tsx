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
import type { AdminCatalogsFilters } from "../../types/admin-catalogs.types";

interface FiltersLabels {
  status: string;
  allStatuses: string;
  active: string;
  inactive: string;
  featured: string;
  year: string;
  allYears: string;
  clearFilters: string;
}

interface AdminCatalogsFiltersSectionProps {
  filters: AdminCatalogsFilters;
  years: number[];
  onFiltersChange: (filters: AdminCatalogsFilters) => void;
  onReset: () => void;
  labels: FiltersLabels;
}

type StatusValue = "all" | "active" | "inactive" | "featured";

export const AdminCatalogsFiltersSection = memo(function AdminCatalogsFiltersSection({
  filters,
  years,
  onFiltersChange,
  onReset,
  labels,
}: AdminCatalogsFiltersSectionProps) {
  const handleStatusChange = useCallback(
    (value: StatusValue) => {
      const newFilters: AdminCatalogsFilters = {
        ...filters,
        isActive: undefined,
        isFeatured: undefined,
      };

      if (value === "active") {
        newFilters.isActive = true;
      } else if (value === "inactive") {
        newFilters.isActive = false;
      } else if (value === "featured") {
        newFilters.isFeatured = true;
      }

      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const handleYearChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        year: value === "all" ? undefined : parseInt(value, 10),
      });
    },
    [filters, onFiltersChange]
  );

  const getCurrentStatusValue = useCallback((): StatusValue => {
    if (filters.isFeatured === true) return "featured";
    if (filters.isActive === true) return "active";
    if (filters.isActive === false) return "inactive";
    return "all";
  }, [filters.isActive, filters.isFeatured]);

  const hasActiveFilters =
    filters.isActive !== undefined ||
    filters.isFeatured !== undefined ||
    filters.year !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={getCurrentStatusValue()} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={labels.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{labels.allStatuses}</SelectItem>
          <SelectItem value="active">{labels.active}</SelectItem>
          <SelectItem value="inactive">{labels.inactive}</SelectItem>
          <SelectItem value="featured">{labels.featured}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.year?.toString() || "all"}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={labels.year} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{labels.allYears}</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          {labels.clearFilters}
        </Button>
      )}
    </div>
  );
});
