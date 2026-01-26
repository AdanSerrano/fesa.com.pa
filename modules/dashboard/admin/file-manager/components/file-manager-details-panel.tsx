"use client";

import { memo, useCallback, useMemo } from "react";
import {
  X,
  Download,
  Trash2,
  ExternalLink,
  Image,
  FileText,
  FileVideo,
  FileAudio,
  Archive,
  FileIcon,
  Calendar,
  HardDrive,
  Link2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { R2Object } from "../types/file-manager.types";
import { getFileType } from "../types/file-manager.types";

interface DetailsPanelLabels {
  title: string;
  name: string;
  size: string;
  type: string;
  lastModified: string;
  path: string;
  download: string;
  delete: string;
  openInNewTab: string;
  rename: string;
  copyLink: string;
  linkCopied: string;
}

interface FileManagerDetailsPanelProps {
  file: R2Object | null;
  labels: DetailsPanelLabels;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (url: string, name: string) => void;
  onDelete: (key: string) => void;
  onRename: (file: R2Object) => void;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const getFileIcon = (fileName: string) => {
  const type = getFileType(fileName);
  switch (type) {
    case "images":
      return Image;
    case "documents":
      return FileText;
    case "videos":
      return FileVideo;
    case "audio":
      return FileAudio;
    case "archives":
      return Archive;
    default:
      return FileIcon;
  }
};

const getFileTypeColor = (fileName: string) => {
  const type = getFileType(fileName);
  switch (type) {
    case "images":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "documents":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "videos":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "audio":
      return "bg-pink-500/10 text-pink-600 dark:text-pink-400";
    case "archives":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
};

const FileManagerDetailsPanelComponent = ({
  file,
  labels,
  locale,
  isOpen,
  onClose,
  onDownload,
  onDelete,
  onRename,
}: FileManagerDetailsPanelProps) => {
  const handleDownload = useCallback(() => {
    if (file?.publicUrl) {
      onDownload(file.publicUrl, file.name);
    }
  }, [file, onDownload]);

  const handleDelete = useCallback(() => {
    if (file) {
      onDelete(file.key);
    }
  }, [file, onDelete]);

  const handleRename = useCallback(() => {
    if (file) {
      onRename(file);
    }
  }, [file, onRename]);

  const handleOpenInNewTab = useCallback(() => {
    if (file?.publicUrl) {
      window.open(file.publicUrl, "_blank");
    }
  }, [file]);

  const handleCopyLink = useCallback(async () => {
    if (file?.publicUrl) {
      await navigator.clipboard.writeText(file.publicUrl);
    }
  }, [file]);

  const formattedDate = useMemo(() => {
    if (!file) return "";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(file.lastModified));
  }, [file, locale]);

  const extension = useMemo(() => {
    if (!file) return "";
    return file.name.split(".").pop()?.toUpperCase() || "";
  }, [file]);

  const fileType = useMemo(() => {
    if (!file) return "all";
    return getFileType(file.name);
  }, [file]);

  const isImage = fileType === "images";

  if (!isOpen || !file) return null;

  const IconComponent = getFileIcon(file.name);
  const iconColorClass = getFileTypeColor(file.name);

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-40",
        "flex flex-col",
        "animate-in slide-in-from-right duration-200"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{labels.title}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {isImage && file.publicUrl ? (
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={file.publicUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center",
              iconColorClass
            )}
          >
            <IconComponent className="h-16 w-16" />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {labels.name}
            </p>
            <p className="text-sm font-medium break-all">{file.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{extension}</Badge>
            <Badge variant="outline" className="capitalize">
              {fileType}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <HardDrive className="h-3.5 w-3.5" />
                <span className="text-xs uppercase tracking-wide">{labels.size}</span>
              </div>
              <p className="text-sm font-medium">{formatFileSize(file.size)}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs uppercase tracking-wide">{labels.lastModified}</span>
              </div>
              <p className="text-sm font-medium">{formattedDate}</p>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Link2 className="h-3.5 w-3.5" />
              <span className="text-xs uppercase tracking-wide">{labels.path}</span>
            </div>
            <p className="text-xs text-muted-foreground break-all font-mono">
              {file.key}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="min-w-0" onClick={handleRename}>
            <Edit className="h-4 w-4 shrink-0" />
            <span className="truncate">{labels.rename}</span>
          </Button>
          <Button variant="outline" size="sm" className="min-w-0" onClick={handleCopyLink}>
            <Link2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{labels.copyLink}</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="min-w-0" onClick={handleOpenInNewTab} title={labels.openInNewTab}>
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">{labels.openInNewTab}</span>
          </Button>
          <Button variant="outline" size="sm" className="min-w-0" onClick={handleDownload}>
            <Download className="h-4 w-4 shrink-0" />
            <span className="truncate">{labels.download}</span>
          </Button>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          {labels.delete}
        </Button>
      </div>
    </div>
  );
};

export const FileManagerDetailsPanel = memo(FileManagerDetailsPanelComponent);
FileManagerDetailsPanel.displayName = "FileManagerDetailsPanel";
