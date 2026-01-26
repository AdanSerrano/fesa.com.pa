"use client";

import { memo, useCallback } from "react";
import {
  Folder,
  FileIcon,
  Download,
  Trash2,
  Image,
  FileText,
  Table,
  FileVideo,
  FileAudio,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { R2Object, R2Folder } from "../types/file-manager.types";

interface FileManagerItemLabels {
  download: string;
  delete: string;
}

interface FolderItemProps {
  folder: R2Folder;
  onNavigate: (prefix: string) => void;
}

interface FileItemProps {
  file: R2Object;
  locale: string;
  labels: FileManagerItemLabels;
  isPending: boolean;
  onDownload: (url: string, name: string) => void;
  onDelete: (key: string) => void;
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

  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
  const videoExts = ["mp4", "webm", "mov", "avi", "mkv"];
  const audioExts = ["mp3", "wav", "ogg", "flac", "aac"];
  const docExts = ["pdf", "doc", "docx", "txt", "rtf"];
  const spreadsheetExts = ["xls", "xlsx", "csv"];
  const archiveExts = ["zip", "rar", "7z", "tar", "gz"];

  if (imageExts.includes(extension)) {
    return { icon: Image, color: "text-blue-500", bg: "bg-blue-500/10" };
  }
  if (videoExts.includes(extension)) {
    return { icon: FileVideo, color: "text-purple-500", bg: "bg-purple-500/10" };
  }
  if (audioExts.includes(extension)) {
    return { icon: FileAudio, color: "text-pink-500", bg: "bg-pink-500/10" };
  }
  if (docExts.includes(extension)) {
    return { icon: FileText, color: "text-red-500", bg: "bg-red-500/10" };
  }
  if (spreadsheetExts.includes(extension)) {
    return { icon: Table, color: "text-green-500", bg: "bg-green-500/10" };
  }
  if (archiveExts.includes(extension)) {
    return { icon: Archive, color: "text-amber-500", bg: "bg-amber-500/10" };
  }

  return { icon: FileIcon, color: "text-gray-500", bg: "bg-gray-500/10" };
};

const FolderItemComponent = ({ folder, onNavigate }: FolderItemProps) => {
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

  return (
    <TableRow
      className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
            <Folder className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{folder.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">—</TableCell>
      <TableCell className="text-muted-foreground">—</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

export const FolderItem = memo(FolderItemComponent);
FolderItem.displayName = "FolderItem";

const FileItemComponent = ({
  file,
  locale,
  labels,
  isPending,
  onDownload,
  onDelete,
}: FileItemProps) => {
  const fileInfo = getFileInfo(file.name);
  const IconComponent = fileInfo.icon;

  const handleDownload = useCallback(() => {
    if (file.publicUrl) {
      onDownload(file.publicUrl, file.name);
    }
  }, [file.publicUrl, file.name, onDownload]);

  const handleDelete = useCallback(() => {
    onDelete(file.key);
  }, [file.key, onDelete]);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(file.lastModified));

  return (
    <TableRow className="group hover:bg-muted/50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", fileInfo.bg)}>
            <IconComponent className={cn("h-4 w-4", fileInfo.color)} />
          </div>
          <span className="truncate max-w-[200px] sm:max-w-[300px]" title={file.name}>
            {file.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatFileSize(file.size)}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs sm:text-sm">
        {formattedDate}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {file.publicUrl && (
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={handleDownload}
              title={labels.download}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={handleDelete}
            title={labels.delete}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const FileItem = memo(FileItemComponent);
FileItem.displayName = "FileItem";
