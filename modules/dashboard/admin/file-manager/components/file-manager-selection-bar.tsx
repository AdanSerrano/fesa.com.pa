"use client";

import { memo, useCallback } from "react";
import { X, Trash2, Download, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectionBarLabels {
  selected: string;
  selectAll: string;
  clearSelection: string;
  deleteSelected: string;
  downloadSelected: string;
}

interface FileManagerSelectionBarProps {
  labels: SelectionBarLabels;
  selectedCount: number;
  totalCount: number;
  isPending: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onDownloadSelected: () => void;
}

const FileManagerSelectionBarComponent = ({
  labels,
  selectedCount,
  totalCount,
  isPending,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onDownloadSelected,
}: FileManagerSelectionBarProps) => {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const handleToggleSelectAll = useCallback(() => {
    if (allSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  }, [allSelected, onSelectAll, onClearSelection]);

  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-3 px-4 py-3",
        "bg-primary text-primary-foreground rounded-full shadow-lg",
        "animate-in slide-in-from-bottom-4 duration-200"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-primary-foreground hover:bg-primary-foreground/20"
        onClick={handleToggleSelectAll}
      >
        {allSelected ? (
          <CheckSquare className="h-4 w-4" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </Button>

      <span className="text-sm font-medium">
        {labels.selected.replace("{count}", String(selectedCount))}
      </span>

      <div className="h-4 w-px bg-primary-foreground/30" />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-primary-foreground hover:bg-primary-foreground/20"
        onClick={onDownloadSelected}
        disabled={isPending}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">{labels.downloadSelected}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-primary-foreground hover:bg-red-500/80"
        onClick={onDeleteSelected}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">{labels.deleteSelected}</span>
      </Button>

      <div className="h-4 w-px bg-primary-foreground/30" />

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        onClick={onClearSelection}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const FileManagerSelectionBar = memo(FileManagerSelectionBarComponent);
FileManagerSelectionBar.displayName = "FileManagerSelectionBar";
