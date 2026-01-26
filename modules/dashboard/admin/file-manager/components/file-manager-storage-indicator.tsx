"use client";

import { memo, useMemo } from "react";
import { HardDrive } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StorageIndicatorLabels {
  storage: string;
  used: string;
  free: string;
}

interface FileManagerStorageIndicatorProps {
  labels: StorageIndicatorLabels;
  usedBytes: number;
  totalBytes: number;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const FileManagerStorageIndicatorComponent = ({
  labels,
  usedBytes,
  totalBytes,
}: FileManagerStorageIndicatorProps) => {
  const percentage = useMemo(() => {
    if (totalBytes === 0) return 0;
    return Math.min((usedBytes / totalBytes) * 100, 100);
  }, [usedBytes, totalBytes]);

  const usedFormatted = useMemo(() => formatFileSize(usedBytes), [usedBytes]);
  const totalFormatted = useMemo(() => formatFileSize(totalBytes), [totalBytes]);
  const freeBytes = totalBytes - usedBytes;
  const freeFormatted = useMemo(() => formatFileSize(freeBytes), [freeBytes]);

  const colorClass = useMemo(() => {
    if (percentage > 90) return "text-red-500";
    if (percentage > 70) return "text-amber-500";
    return "text-primary";
  }, [percentage]);

  const progressColorClass = useMemo(() => {
    if (percentage > 90) return "[&>div]:bg-red-500";
    if (percentage > 70) return "[&>div]:bg-amber-500";
    return "";
  }, [percentage]);

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border">
      <div className={cn("p-1.5 rounded-md bg-background", colorClass)}>
        <HardDrive className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium">{labels.storage}</span>
          <span className="text-muted-foreground">
            {usedFormatted} / {totalFormatted}
          </span>
        </div>
        <Progress value={percentage} className={cn("h-1.5", progressColorClass)} />
        <div className="flex items-center justify-between text-xs mt-1 text-muted-foreground">
          <span>
            {labels.used}: {usedFormatted}
          </span>
          <span>
            {labels.free}: {freeFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};

export const FileManagerStorageIndicator = memo(FileManagerStorageIndicatorComponent);
FileManagerStorageIndicator.displayName = "FileManagerStorageIndicator";
