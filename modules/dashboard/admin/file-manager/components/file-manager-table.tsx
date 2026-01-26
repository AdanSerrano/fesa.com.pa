"use client";

import { memo, useMemo } from "react";
import { FolderOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderItem, FileItem } from "./file-manager-item";
import type { R2Object, R2Folder } from "../types/file-manager.types";

interface FileManagerTableLabels {
  name: string;
  size: string;
  lastModified: string;
  actions: string;
  emptyFolder: string;
  emptyFolderDescription: string;
  download: string;
  delete: string;
}

interface FileManagerTableProps {
  folders: R2Folder[];
  files: R2Object[];
  labels: FileManagerTableLabels;
  locale: string;
  isPending: boolean;
  onNavigate: (prefix: string) => void;
  onDownload: (url: string, name: string) => void;
  onDelete: (key: string) => void;
}

const FileManagerTableComponent = ({
  folders,
  files,
  labels,
  locale,
  isPending,
  onNavigate,
  onDownload,
  onDelete,
}: FileManagerTableProps) => {
  const itemLabels = useMemo(
    () => ({
      download: labels.download,
      delete: labels.delete,
    }),
    [labels.download, labels.delete]
  );

  const isEmpty = folders.length === 0 && files.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">{labels.emptyFolder}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {labels.emptyFolderDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">{labels.name}</TableHead>
            <TableHead className="w-[15%]">{labels.size}</TableHead>
            <TableHead className="w-[20%]">{labels.lastModified}</TableHead>
            <TableHead className="w-[15%] text-right">{labels.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <FolderItem
              key={folder.prefix}
              folder={folder}
              onNavigate={onNavigate}
            />
          ))}
          {files.map((file) => (
            <FileItem
              key={file.key}
              file={file}
              locale={locale}
              labels={itemLabels}
              isPending={isPending}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const FileManagerTable = memo(FileManagerTableComponent);
FileManagerTable.displayName = "FileManagerTable";
