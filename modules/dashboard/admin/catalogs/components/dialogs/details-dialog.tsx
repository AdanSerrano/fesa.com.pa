"use client";

import { memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import type { AdminCatalog } from "../../types/admin-catalogs.types";

interface Labels {
  title: string;
  catalogTitle: string;
  year: string;
  description: string;
  status: string;
  featured: string;
  pages: string;
  createdAt: string;
  updatedAt: string;
  active: string;
  inactive: string;
  yes: string;
  no: string;
  noDescription: string;
  noPages: string;
}

interface CatalogDetailsDialogProps {
  open: boolean;
  catalog: AdminCatalog | null;
  onClose: () => void;
  labels: Labels;
  locale: string;
}

const DetailRow = memo(function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div>{value}</div>
    </div>
  );
});

const PageThumbnail = memo(function PageThumbnail({
  imageUrl,
  alt,
  index,
}: {
  imageUrl: string;
  alt: string | null;
  index: number;
}) {
  return (
    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-muted">
      <Image
        src={imageUrl}
        alt={alt || `Page ${index + 1}`}
        fill
        className="object-cover"
        sizes="120px"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
        {index + 1}
      </div>
    </div>
  );
});

function CatalogDetailsDialogComponent({
  open,
  catalog,
  onClose,
  labels,
  locale,
}: CatalogDetailsDialogProps) {
  const formattedCreatedAt = useMemo(() => {
    if (!catalog) return "";
    return new Date(catalog.createdAt).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [catalog, locale]);

  const formattedUpdatedAt = useMemo(() => {
    if (!catalog) return "";
    return new Date(catalog.updatedAt).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [catalog, locale]);

  if (!catalog) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {catalog.coverImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={catalog.coverImage}
                  alt={catalog.title}
                  fill
                  className="object-cover"
                  sizes="600px"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <DetailRow label={labels.catalogTitle} value={catalog.title} />
              <DetailRow
                label={labels.year}
                value={<Badge variant="outline">{catalog.year}</Badge>}
              />
            </div>

            <DetailRow
              label={labels.description}
              value={catalog.description || labels.noDescription}
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label={labels.status}
                value={
                  <Badge variant={catalog.isActive ? "default" : "secondary"}>
                    {catalog.isActive ? labels.active : labels.inactive}
                  </Badge>
                }
              />
              <DetailRow
                label={labels.featured}
                value={catalog.isFeatured ? labels.yes : labels.no}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailRow label={labels.createdAt} value={formattedCreatedAt} />
              <DetailRow label={labels.updatedAt} value={formattedUpdatedAt} />
            </div>

            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">
                {labels.pages} ({catalog.pages?.length || 0})
              </span>

              {catalog.pages && catalog.pages.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {catalog.pages.map((page, index) => (
                    <PageThumbnail
                      key={page.id}
                      imageUrl={page.imageUrl}
                      alt={page.alt}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{labels.noPages}</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export const CatalogDetailsDialog = memo(CatalogDetailsDialogComponent);
CatalogDetailsDialog.displayName = "CatalogDetailsDialog";
