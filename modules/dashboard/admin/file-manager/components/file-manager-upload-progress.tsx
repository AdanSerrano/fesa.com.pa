"use client";

import { memo } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadProgress } from "../types/file-manager.types";

interface UploadProgressLabels {
  uploading: string;
  completed: string;
  error: string;
  cancel: string;
}

interface FileManagerUploadProgressProps {
  uploads: UploadProgress[];
  labels: UploadProgressLabels;
  onCancel: (id: string) => void;
  onDismiss: (id: string) => void;
}

const UploadItemComponent = memo(
  ({
    upload,
    labels,
    onCancel,
    onDismiss,
  }: {
    upload: UploadProgress;
    labels: UploadProgressLabels;
    onCancel: (id: string) => void;
    onDismiss: (id: string) => void;
  }) => {
    const isCompleted = upload.status === "completed";
    const isError = upload.status === "error";
    const isUploading = upload.status === "uploading" || upload.status === "pending";

    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border transition-colors",
          isCompleted && "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
          isError && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
          isUploading && "bg-muted/50 border-border"
        )}
      >
        <div
          className={cn(
            "p-2 rounded-lg shrink-0",
            isCompleted && "bg-green-100 dark:bg-green-900/30",
            isError && "bg-red-100 dark:bg-red-900/30",
            isUploading && "bg-primary/10"
          )}
        >
          {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
          {isError && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
          {isUploading && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{upload.fileName}</p>
          {isUploading && (
            <div className="mt-1.5">
              <Progress value={upload.progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                {upload.progress}% - {labels.uploading}
              </p>
            </div>
          )}
          {isCompleted && (
            <p className="text-xs text-green-600 dark:text-green-400">{labels.completed}</p>
          )}
          {isError && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {upload.error || labels.error}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => (isUploading ? onCancel(upload.id) : onDismiss(upload.id))}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
UploadItemComponent.displayName = "UploadItemComponent";

const FileManagerUploadProgressComponent = ({
  uploads,
  labels,
  onCancel,
  onDismiss,
}: FileManagerUploadProgressProps) => {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-auto z-50 bg-background border rounded-xl shadow-lg p-3 space-y-2">
      {uploads.map((upload) => (
        <UploadItemComponent
          key={upload.id}
          upload={upload}
          labels={labels}
          onCancel={onCancel}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export const FileManagerUploadProgress = memo(FileManagerUploadProgressComponent);
FileManagerUploadProgress.displayName = "FileManagerUploadProgress";
