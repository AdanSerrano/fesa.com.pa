"use client";

import { memo, useMemo, useCallback } from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "../types/file-manager.types";

interface FileManagerBreadcrumbProps {
  currentPath: string;
  rootLabel: string;
  onNavigate: (path: string) => void;
}

const FileManagerBreadcrumbComponent = ({
  currentPath,
  rootLabel,
  onNavigate,
}: FileManagerBreadcrumbProps) => {
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    if (!currentPath) return [];

    const parts = currentPath.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join("/") + "/";
      items.push({ name: part, path });
    });

    return items;
  }, [currentPath]);

  const handleRootClick = useCallback(() => {
    onNavigate("");
  }, [onNavigate]);

  const handleItemClick = useCallback(
    (path: string) => () => {
      onNavigate(path);
    },
    [onNavigate]
  );

  return (
    <nav
      className={cn(
        "flex items-center gap-1.5 text-sm py-2 px-3",
        "bg-muted/30 rounded-lg border border-border/50",
        "overflow-x-auto scrollbar-thin scrollbar-thumb-muted"
      )}
    >
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md shrink-0",
          "hover:bg-muted transition-colors",
          "text-muted-foreground hover:text-foreground",
          !currentPath && "bg-muted text-foreground font-medium"
        )}
        onClick={handleRootClick}
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">{rootLabel}</span>
      </button>

      {breadcrumbs.map((item, index) => (
        <div key={item.path} className="flex items-center gap-1.5 shrink-0">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          {index === breadcrumbs.length - 1 ? (
            <span
              className={cn(
                "px-2 py-1 rounded-md truncate max-w-[180px]",
                "bg-primary/10 text-primary font-medium"
              )}
            >
              {item.name}
            </span>
          ) : (
            <button
              type="button"
              className={cn(
                "px-2 py-1 rounded-md truncate max-w-[150px]",
                "hover:bg-muted transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleItemClick(item.path)}
            >
              {item.name}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};

export const FileManagerBreadcrumb = memo(FileManagerBreadcrumbComponent);
FileManagerBreadcrumb.displayName = "FileManagerBreadcrumb";
