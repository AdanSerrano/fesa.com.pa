"use client";

import { memo, useMemo } from "react";
import { FolderOpen, FileQuestion } from "lucide-react";
import { FolderGridItem, FileGridItem } from "./file-manager-grid-item";
import { cn } from "@/lib/utils";
import type { R2Object, R2Folder, GridSize } from "../types/file-manager.types";

interface GridLabels {
  download: string;
  delete: string;
  preview: string;
  open: string;
  deleteFolder: string;
  rename: string;
  details: string;
  emptyFolder: string;
  emptyFolderDescription: string;
  noResults: string;
  noResultsDescription: string;
}

interface FileManagerGridProps {
  folders: R2Folder[];
  files: R2Object[];
  labels: GridLabels;
  gridSize: GridSize;
  isPending: boolean;
  isFiltered: boolean;
  selectedFiles: Set<string>;
  isSelectionMode: boolean;
  onNavigate: (prefix: string) => void;
  onPreview: (file: R2Object) => void;
  onDownload: (url: string, name: string) => void;
  onDelete: (key: string) => void;
  onDeleteFolder: (prefix: string) => void;
  onRename: (file: R2Object) => void;
  onRenameFolder: (folder: R2Folder) => void;
  onShowDetails: (file: R2Object) => void;
  onSelectFile: (file: R2Object, selected: boolean) => void;
}

const gridSizeColumns: Record<GridSize, string> = {
  small: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8",
  medium: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  large: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

const FileManagerGridComponent = ({
  folders,
  files,
  labels,
  gridSize,
  isPending,
  isFiltered,
  selectedFiles,
  isSelectionMode,
  onNavigate,
  onPreview,
  onDownload,
  onDelete,
  onDeleteFolder,
  onRename,
  onRenameFolder,
  onShowDetails,
  onSelectFile,
}: FileManagerGridProps) => {
  const isEmpty = folders.length === 0 && files.length === 0;
  const gridClasses = useMemo(() => gridSizeColumns[gridSize], [gridSize]);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          {isFiltered ? (
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          ) : (
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-medium mb-2">
          {isFiltered ? labels.noResults : labels.emptyFolder}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {isFiltered ? labels.noResultsDescription : labels.emptyFolderDescription}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridClasses)}>
      {folders.map((folder) => (
        <FolderGridItem
          key={folder.prefix}
          folder={folder}
          labels={labels}
          gridSize={gridSize}
          isPending={isPending}
          onNavigate={onNavigate}
          onDeleteFolder={onDeleteFolder}
          onRenameFolder={onRenameFolder}
        />
      ))}
      {files.map((file) => (
        <FileGridItem
          key={file.key}
          file={file}
          labels={labels}
          gridSize={gridSize}
          isPending={isPending}
          isSelected={selectedFiles.has(file.key)}
          isSelectionMode={isSelectionMode}
          onSelect={onSelectFile}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
          onRename={onRename}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
};

export const FileManagerGrid = memo(FileManagerGridComponent);
FileManagerGrid.displayName = "FileManagerGrid";
