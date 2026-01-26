"use client";

import { memo, useCallback } from "react";
import {
  Folder,
  FileIcon,
  Image,
  FileText,
  Table,
  FileVideo,
  FileAudio,
  Archive,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  Edit,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { R2Object, R2Folder, GridSize } from "../types/file-manager.types";

interface GridItemLabels {
  download: string;
  delete: string;
  preview: string;
  open: string;
  deleteFolder: string;
  rename: string;
  details: string;
}

interface FolderGridItemProps {
  folder: R2Folder;
  labels: GridItemLabels;
  gridSize: GridSize;
  isPending: boolean;
  onNavigate: (prefix: string) => void;
  onDeleteFolder: (prefix: string) => void;
  onRenameFolder: (folder: R2Folder) => void;
}

interface FileGridItemProps {
  file: R2Object;
  labels: GridItemLabels;
  gridSize: GridSize;
  isPending: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (file: R2Object, selected: boolean) => void;
  onPreview: (file: R2Object) => void;
  onDownload: (url: string, name: string) => void;
  onDelete: (key: string) => void;
  onRename: (file: R2Object) => void;
  onShowDetails: (file: R2Object) => void;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const getFileInfo = (name: string) => {
  const extension = name.split(".").pop()?.toLowerCase() || "";

  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"];
  const videoExts = ["mp4", "webm", "mov", "avi", "mkv"];
  const audioExts = ["mp3", "wav", "ogg", "flac", "aac"];
  const docExts = ["pdf", "doc", "docx", "txt", "rtf"];
  const spreadsheetExts = ["xls", "xlsx", "csv"];
  const archiveExts = ["zip", "rar", "7z", "tar", "gz"];

  if (imageExts.includes(extension)) {
    return { icon: Image, color: "text-blue-500", bg: "bg-blue-500/10", type: "image" };
  }
  if (videoExts.includes(extension)) {
    return { icon: FileVideo, color: "text-purple-500", bg: "bg-purple-500/10", type: "video" };
  }
  if (audioExts.includes(extension)) {
    return { icon: FileAudio, color: "text-pink-500", bg: "bg-pink-500/10", type: "audio" };
  }
  if (docExts.includes(extension)) {
    return { icon: FileText, color: "text-red-500", bg: "bg-red-500/10", type: "document" };
  }
  if (spreadsheetExts.includes(extension)) {
    return { icon: Table, color: "text-green-500", bg: "bg-green-500/10", type: "spreadsheet" };
  }
  if (archiveExts.includes(extension)) {
    return { icon: Archive, color: "text-amber-500", bg: "bg-amber-500/10", type: "archive" };
  }

  return { icon: FileIcon, color: "text-gray-500", bg: "bg-gray-500/10", type: "other" };
};

const gridSizeClasses: Record<GridSize, { icon: string; padding: string }> = {
  small: { icon: "h-6 w-6", padding: "p-2" },
  medium: { icon: "h-8 w-8", padding: "p-3" },
  large: { icon: "h-10 w-10", padding: "p-4" },
};

const FolderGridItemComponent = ({
  folder,
  labels,
  gridSize,
  isPending,
  onNavigate,
  onDeleteFolder,
  onRenameFolder,
}: FolderGridItemProps) => {
  const sizeClasses = gridSizeClasses[gridSize];

  const handleClick = useCallback(() => {
    onNavigate(folder.prefix);
  }, [folder.prefix, onNavigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNavigate(folder.prefix);
      }
    },
    [folder.prefix, onNavigate]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDeleteFolder(folder.prefix);
    },
    [folder.prefix, onDeleteFolder]
  );

  const handleOpen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onNavigate(folder.prefix);
    },
    [folder.prefix, onNavigate]
  );

  const handleRename = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRenameFolder(folder);
    },
    [folder, onRenameFolder]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group relative flex flex-col items-center rounded-xl border-2 border-transparent",
        "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
        "hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg",
        "cursor-pointer transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
        sizeClasses.padding
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-white/80 dark:bg-background/80 backdrop-blur-sm shadow-sm"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpen} disabled={isPending}>
              <FolderOpen className="h-4 w-4 mr-2" />
              {labels.open}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRename} disabled={isPending}>
              <Edit className="h-4 w-4 mr-2" />
              {labels.rename}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isPending}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {labels.deleteFolder}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative">
        <div
          className={cn(
            "rounded-xl bg-gradient-to-br from-amber-400 to-orange-500",
            "shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow",
            sizeClasses.padding
          )}
        >
          <Folder className={cn("text-white", sizeClasses.icon)} />
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-center truncate w-full px-1">
        {folder.name}
      </span>
    </div>
  );
};

export const FolderGridItem = memo(FolderGridItemComponent);
FolderGridItem.displayName = "FolderGridItem";

const FileGridItemComponent = ({
  file,
  labels,
  gridSize,
  isPending,
  isSelected,
  isSelectionMode,
  onSelect,
  onPreview,
  onDownload,
  onDelete,
  onRename,
  onShowDetails,
}: FileGridItemProps) => {
  const fileInfo = getFileInfo(file.name);
  const IconComponent = fileInfo.icon;
  const isImage = fileInfo.type === "image";
  const sizeClasses = gridSizeClasses[gridSize];

  const handlePreview = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onPreview(file);
  }, [file, onPreview]);

  const handleDownload = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (file.publicUrl) {
      onDownload(file.publicUrl, file.name);
    }
  }, [file.publicUrl, file.name, onDownload]);

  const handleDelete = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDelete(file.key);
  }, [file.key, onDelete]);

  const handleRename = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onRename(file);
  }, [file, onRename]);

  const handleShowDetails = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onShowDetails(file);
  }, [file, onShowDetails]);

  const handleSelect = useCallback(() => {
    onSelect(file, !isSelected);
  }, [file, isSelected, onSelect]);

  const handleCardClick = useCallback(() => {
    if (isSelectionMode) {
      onSelect(file, !isSelected);
    } else if (isImage) {
      handlePreview();
    }
  }, [isSelectionMode, isSelected, isImage, file, onSelect, handlePreview]);

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center rounded-xl border-2",
        "bg-card hover:shadow-lg transition-all duration-200 ease-out",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:border-primary/30",
        sizeClasses.padding
      )}
      onClick={handleCardClick}
    >
      <div
        className={cn(
          "absolute top-2 left-2 z-10 transition-opacity",
          isSelectionMode || isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <div
          className={cn(
            "h-6 w-6 rounded-md flex items-center justify-center cursor-pointer transition-colors",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-muted"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
        >
          {isSelected && <Check className="h-4 w-4" />}
        </div>
      </div>

      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-background/80 backdrop-blur-sm shadow-sm"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isImage && (
              <DropdownMenuItem onClick={handlePreview} disabled={isPending}>
                <Eye className="h-4 w-4 mr-2" />
                {labels.preview}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleShowDetails} disabled={isPending}>
              <Info className="h-4 w-4 mr-2" />
              {labels.details}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRename} disabled={isPending}>
              <Edit className="h-4 w-4 mr-2" />
              {labels.rename}
            </DropdownMenuItem>
            {file.publicUrl && (
              <DropdownMenuItem onClick={handleDownload} disabled={isPending}>
                <Download className="h-4 w-4 mr-2" />
                {labels.download}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isPending}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {labels.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={cn(
          "relative w-full aspect-square rounded-lg overflow-hidden mb-3",
          "flex items-center justify-center",
          fileInfo.bg
        )}
      >
        {isImage && file.publicUrl ? (
          <img
            src={file.publicUrl}
            alt={file.name}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <IconComponent className={cn(fileInfo.color, gridSize === "small" ? "h-8 w-8" : gridSize === "medium" ? "h-12 w-12" : "h-16 w-16")} />
        )}
      </div>

      <div className="w-full text-center space-y-1">
        <p className="text-sm font-medium truncate px-1" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
};

export const FileGridItem = memo(FileGridItemComponent);
FileGridItem.displayName = "FileGridItem";
