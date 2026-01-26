"use client";

import { memo, useCallback } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface ViewToggleLabels {
  gridView: string;
  listView: string;
}

interface FileManagerViewToggleProps {
  viewMode: ViewMode;
  labels: ViewToggleLabels;
  onViewModeChange: (mode: ViewMode) => void;
}

const FileManagerViewToggleComponent = ({
  viewMode,
  labels,
  onViewModeChange,
}: FileManagerViewToggleProps) => {
  const handleGridClick = useCallback(() => {
    onViewModeChange("grid");
  }, [onViewModeChange]);

  const handleListClick = useCallback(() => {
    onViewModeChange("list");
  }, [onViewModeChange]);

  return (
    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 rounded-md transition-all",
          viewMode === "grid" && "bg-background shadow-sm"
        )}
        onClick={handleGridClick}
        title={labels.gridView}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 rounded-md transition-all",
          viewMode === "list" && "bg-background shadow-sm"
        )}
        onClick={handleListClick}
        title={labels.listView}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const FileManagerViewToggle = memo(FileManagerViewToggleComponent);
FileManagerViewToggle.displayName = "FileManagerViewToggle";
