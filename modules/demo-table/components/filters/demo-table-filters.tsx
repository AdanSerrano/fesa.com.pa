"use client";

import { memo, useMemo } from "react";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import type { DemoProductFilters, ProductStatus, ProductCategory } from "../../types/demo-table.types";

export interface FilterLabels {
  filters: string;
  status: string;
  category: string;
  allStatuses: string;
  allCategories: string;
  clearFilters: string;
  statusActive: string;
  statusInactive: string;
  statusDiscontinued: string;
  categoryElectronics: string;
  categoryClothing: string;
  categoryFood: string;
  categoryBooks: string;
  categoryOther: string;
}

interface Props {
  filters: DemoProductFilters;
  onFiltersChange: (filters: Partial<DemoProductFilters>) => void;
  labels: FilterLabels;
}

function DemoTableFiltersComponent({ filters, onFiltersChange, labels }: Props) {
  const activeFiltersCount = [
    filters.status !== "all",
    filters.category !== "all",
  ].filter(Boolean).length;

  const statusOptions = useMemo(() => [
    { value: "all" as const, label: labels.allStatuses },
    { value: "active" as const, label: labels.statusActive },
    { value: "inactive" as const, label: labels.statusInactive },
    { value: "discontinued" as const, label: labels.statusDiscontinued },
  ], [labels]);

  const categoryOptions = useMemo(() => [
    { value: "all" as const, label: labels.allCategories },
    { value: "electronics" as const, label: labels.categoryElectronics },
    { value: "clothing" as const, label: labels.categoryClothing },
    { value: "food" as const, label: labels.categoryFood },
    { value: "books" as const, label: labels.categoryBooks },
    { value: "other" as const, label: labels.categoryOther },
  ], [labels]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">{labels.filters}</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label id="status-label" className="text-sm font-medium">{labels.status}</label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ status: value as ProductStatus | "all" })}
            >
              <SelectTrigger aria-labelledby="status-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label id="category-label" className="text-sm font-medium">{labels.category}</label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ category: value as ProductCategory | "all" })}
            >
              <SelectTrigger aria-labelledby="category-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => onFiltersChange({ status: "all", category: "all" })}
            >
              {labels.clearFilters}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const DemoTableFilters = memo(DemoTableFiltersComponent);
