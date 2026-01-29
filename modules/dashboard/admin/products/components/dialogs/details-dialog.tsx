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
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { FolderOpen, Package, Star } from "lucide-react";
import type { ProductCategory, ProductItem } from "../../types/admin-products.types";

interface CategoryDetailsDialogProps {
  open: boolean;
  category: ProductCategory | null;
  onClose: () => void;
  labels: {
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
  };
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
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {category.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{labels.name}</p>
              <p className="font-medium">{category.name}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">{labels.description}</p>
              <p className={`break-words ${category.description ? "" : "text-muted-foreground italic"}`}>
                {category.description || labels.noDescription}
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{labels.status}</p>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? labels.active : labels.inactive}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{labels.featured}</p>
                <div className="flex items-center gap-1">
                  <Star
                    className={`h-4 w-4 ${category.isFeatured ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                  />
                  <span>{category.isFeatured ? labels.yes : labels.no}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{labels.items}</p>
                <Badge variant="outline">
                  <Package className="mr-1 h-3 w-3" />
                  {category._count?.items || 0}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{labels.createdAt}</p>
                <p>{format(new Date(category.createdAt), "PPpp", { locale: dateLocale })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{labels.updatedAt}</p>
                <p>{format(new Date(category.updatedAt), "PPpp", { locale: dateLocale })}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

interface ItemDetailsDialogProps {
  open: boolean;
  item: ProductItem | null;
  onClose: () => void;
  labels: {
    title: string;
    name: string;
    category: string;
    description: string;
    status: string;
    price: string;
    sku: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    noCategory: string;
    noDescription: string;
    noPrice: string;
    noSku: string;
  };
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

  const formatter = new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {item.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{labels.name}</p>
              <p className="font-medium">{item.name}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">{labels.category}</p>
              <Badge variant="outline">
                <FolderOpen className="mr-1 h-3 w-3" />
                {item.category?.name || labels.noCategory}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{labels.price}</p>
                <p className={`font-medium ${item.price === null ? "text-muted-foreground italic" : ""}`}>
                  {item.price !== null ? formatter.format(item.price) : labels.noPrice}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{labels.sku}</p>
                <p className={`font-mono ${!item.sku ? "text-muted-foreground italic" : ""}`}>
                  {item.sku || labels.noSku}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">{labels.description}</p>
              <p className={`break-words ${item.description ? "" : "text-muted-foreground italic"}`}>
                {item.description || labels.noDescription}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">{labels.status}</p>
              <Badge variant={item.isActive ? "default" : "secondary"}>
                {item.isActive ? labels.active : labels.inactive}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{labels.createdAt}</p>
                <p>{format(new Date(item.createdAt), "PPpp", { locale: dateLocale })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{labels.updatedAt}</p>
                <p>{format(new Date(item.updatedAt), "PPpp", { locale: dateLocale })}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
