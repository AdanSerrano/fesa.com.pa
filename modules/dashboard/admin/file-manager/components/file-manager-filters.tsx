"use client";

import { memo, useCallback } from "react";
import {
  Files,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FileTypeFilter, SortField, SortOrder, GridSize, SortConfig } from "../types/file-manager.types";

interface FilterLabels {
  all: string;
  images: string;
  documents: string;
  videos: string;
  audio: string;
  archives: string;
  sortBy: string;
  sortName: string;
  sortSize: string;
  sortDate: string;
  ascending: string;
  descending: string;
  gridSize: string;
  gridSmall: string;
  gridMedium: string;
  gridLarge: string;
}

interface FileManagerFiltersProps {
  labels: FilterLabels;
  currentFilter: FileTypeFilter;
  currentSort: SortConfig;
  currentGridSize: GridSize;
  onFilterChange: (filter: FileTypeFilter) => void;
  onSortChange: (sort: SortConfig) => void;
  onGridSizeChange: (size: GridSize) => void;
}

const filterIcons: Record<FileTypeFilter, typeof Files> = {
  all: Files,
  images: Image,
  documents: FileText,
  videos: Video,
  audio: Music,
  archives: Archive,
};

const FileManagerFiltersComponent = ({
  labels,
  currentFilter,
  currentSort,
  currentGridSize,
  onFilterChange,
  onSortChange,
  onGridSizeChange,
}: FileManagerFiltersProps) => {
  const handleSortFieldChange = useCallback(
    (field: SortField) => {
      onSortChange({
        field,
        order: currentSort.field === field && currentSort.order === "asc" ? "desc" : "asc",
      });
    },
    [currentSort, onSortChange]
  );

  const handleSortOrderToggle = useCallback(() => {
    onSortChange({
      ...currentSort,
      order: currentSort.order === "asc" ? "desc" : "asc",
    });
  }, [currentSort, onSortChange]);

  const filters: { key: FileTypeFilter; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "images", label: labels.images },
    { key: "documents", label: labels.documents },
    { key: "videos", label: labels.videos },
    { key: "audio", label: labels.audio },
    { key: "archives", label: labels.archives },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
        {filters.map((filter) => {
          const Icon = filterIcons[filter.key];
          const isActive = currentFilter === filter.key;

          return (
            <Button
              key={filter.key}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 gap-1.5 text-xs",
                isActive && "bg-background shadow-sm"
              )}
              onClick={() => onFilterChange(filter.key)}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{filter.label}</span>
            </Button>
          );
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{labels.sortBy}</span>
            {currentSort.order === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{labels.sortBy}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSortFieldChange("name")}
            className={cn(currentSort.field === "name" && "bg-accent")}
          >
            {labels.sortName}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortFieldChange("size")}
            className={cn(currentSort.field === "size" && "bg-accent")}
          >
            {labels.sortSize}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortFieldChange("lastModified")}
            className={cn(currentSort.field === "lastModified" && "bg-accent")}
          >
            {labels.sortDate}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSortOrderToggle}>
            {currentSort.order === "asc" ? labels.ascending : labels.descending}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Grid3X3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{labels.gridSize}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{labels.gridSize}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onGridSizeChange("small")}
            className={cn(currentGridSize === "small" && "bg-accent")}
          >
            {labels.gridSmall}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onGridSizeChange("medium")}
            className={cn(currentGridSize === "medium" && "bg-accent")}
          >
            {labels.gridMedium}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onGridSizeChange("large")}
            className={cn(currentGridSize === "large" && "bg-accent")}
          >
            {labels.gridLarge}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const FileManagerFilters = memo(FileManagerFiltersComponent);
FileManagerFilters.displayName = "FileManagerFilters";
