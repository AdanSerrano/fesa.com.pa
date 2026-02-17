"use client";

import { memo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FolderOpen, Layers, Star, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { ServiceCategory, ServiceItem } from "../../types/admin-services.types";

interface CategoryDetailsLabels {
  title: string;
  name: string;
  description: string;
  status: string;
  featured: string;
  items: string;
  createdAt: string;
  updatedAt: string;
  active: string;
  inactive: string;
  yes: string;
  no: string;
  noDescription: string;
}

interface CategoryDetailsDialogProps {
  open: boolean;
  category: ServiceCategory | null;
  onClose: () => void;
  labels: CategoryDetailsLabels;
  locale: string;
}

export const CategoryDetailsDialog = memo(function CategoryDetailsDialog({
  open,
  category,
  onClose,
  labels,
  locale,
}: CategoryDetailsDialogProps) {
  if (!category) return null;

  const dateLocale = locale === "es" ? es : enUS;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted flex items-center justify-center shrink-0">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? labels.active : labels.inactive}
                </Badge>
                {category.isFeatured && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {labels.featured}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{labels.description}</p>
              <p className="text-sm">
                {category.description || labels.noDescription}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {labels.items}: <strong>{category._count?.items || 0}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">{labels.createdAt}</p>
                  <p className="font-medium">
                    {format(new Date(category.createdAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">{labels.updatedAt}</p>
                  <p className="font-medium">
                    {format(new Date(category.updatedAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

interface ItemDetailsLabels {
  title: string;
  name: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  active: string;
  inactive: string;
  noCategory: string;
  noDescription: string;
}

interface ItemDetailsDialogProps {
  open: boolean;
  item: ServiceItem | null;
  onClose: () => void;
  labels: ItemDetailsLabels;
  locale: string;
}

export const ItemDetailsDialog = memo(function ItemDetailsDialog({
  open,
  item,
  onClose,
  labels,
  locale,
}: ItemDetailsDialogProps) {
  if (!item) return null;

  const dateLocale = locale === "es" ? es : enUS;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted flex items-center justify-center shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <Layers className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? labels.active : labels.inactive}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <FolderOpen className="h-3 w-3" />
                  {item.category?.name || labels.noCategory}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{labels.description}</p>
              <p className="text-sm">
                {item.description || labels.noDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">{labels.createdAt}</p>
                  <p className="font-medium">
                    {format(new Date(item.createdAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">{labels.updatedAt}</p>
                  <p className="font-medium">
                    {format(new Date(item.updatedAt), "dd MMM yyyy HH:mm", { locale: dateLocale })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
