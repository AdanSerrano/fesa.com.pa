"use client";

import { memo, useCallback } from "react";
import { Download, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { R2Object } from "../types/file-manager.types";

interface FilePreviewLabels {
  download: string;
  delete: string;
  openInNewTab: string;
  fileName: string;
  fileSize: string;
  lastModified: string;
}

interface FilePreviewProps {
  file: R2Object | null;
  isOpen: boolean;
  labels: FilePreviewLabels;
  locale: string;
  onClose: () => void;
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

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const FilePreviewComponent = ({
  file,
  isOpen,
  labels,
  locale,
  onClose,
  onDownload,
  onDelete,
}: FilePreviewProps) => {
  const handleDownload = useCallback(() => {
    if (file?.publicUrl) {
      onDownload(file.publicUrl, file.name);
    }
  }, [file, onDownload]);

  const handleDelete = useCallback(() => {
    if (file) {
      onDelete(file.key);
      onClose();
    }
  }, [file, onDelete, onClose]);

  const handleOpenInNewTab = useCallback(() => {
    if (file?.publicUrl) {
      window.open(file.publicUrl, "_blank");
    }
  }, [file]);

  if (!file) return null;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(file.lastModified));

  const extension = file.name.split(".").pop()?.toUpperCase() || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-3 border-b">
          <div className="flex items-center gap-3 min-w-0 pr-8">
            <Badge variant="secondary" className="shrink-0">
              {extension}
            </Badge>
            <DialogTitle className="truncate text-base">{file.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 bg-muted/30">
          <div className="flex items-center justify-center min-h-[200px] max-h-[50vh]">
            {file.publicUrl && (
              <img
                src={file.publicUrl}
                alt={file.name}
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-background space-y-4">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{labels.fileSize}:</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{labels.lastModified}:</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex-1 sm:flex-none"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {labels.openInNewTab}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              {labels.download}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {labels.delete}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FilePreview = memo(FilePreviewComponent);
FilePreview.displayName = "FilePreview";
