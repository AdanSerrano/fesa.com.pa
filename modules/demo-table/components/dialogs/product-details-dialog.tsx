"use client";

import { memo, useMemo } from "react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Package, Calendar, Tag, DollarSign, Layers, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { DemoProduct, ProductStatus, ProductCategory } from "../../types/demo-table.types";

export interface DetailsDialogLabels {
  title: string;
  description: string;
  sku: string;
  status: string;
  price: string;
  stock: string;
  units: string;
  category: string;
  stockValue: string;
  created: string;
  updated: string;
  statusActive: string;
  statusInactive: string;
  statusDiscontinued: string;
  categoryElectronics: string;
  categoryClothing: string;
  categoryFood: string;
  categoryBooks: string;
  categoryOther: string;
}

interface Props {
  product: DemoProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: DetailsDialogLabels;
  locale: string;
}

function ProductDetailsDialogComponent({ product, open, onOpenChange, labels, locale }: Props) {
  const dateLocale = locale === "es" ? es : enUS;

  const statusLabels = useMemo(() => ({
    active: { label: labels.statusActive, variant: "default" as const },
    inactive: { label: labels.statusInactive, variant: "secondary" as const },
    discontinued: { label: labels.statusDiscontinued, variant: "destructive" as const },
  }), [labels]);

  const categoryLabels = useMemo((): Record<ProductCategory, string> => ({
    electronics: labels.categoryElectronics,
    clothing: labels.categoryClothing,
    food: labels.categoryFood,
    books: labels.categoryBooks,
    other: labels.categoryOther,
  }), [labels]);

  if (!product) return null;

  const statusConfig = statusLabels[product.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {labels.title}
          </DialogTitle>
          <DialogDescription>
            {labels.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                {labels.sku}
              </div>
              <p className="font-mono font-medium">{product.sku}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                {labels.status}
              </div>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {labels.price}
              </div>
              <p className="font-mono font-medium text-lg">
                ${product.price.toLocaleString(locale, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                {labels.stock}
              </div>
              <p className="font-mono font-medium">{product.stock} {labels.units}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                {labels.category}
              </div>
              <p className="font-medium">{categoryLabels[product.category]}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {labels.stockValue}
              </div>
              <p className="font-mono font-medium">
                ${(product.price * product.stock).toLocaleString(locale, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {labels.created}
              </div>
              <p>{format(new Date(product.createdAt), "dd/MM/yyyy HH:mm", { locale: dateLocale })}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {labels.updated}
              </div>
              <p>{format(new Date(product.updatedAt), "dd/MM/yyyy HH:mm", { locale: dateLocale })}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ProductDetailsDialog = memo(ProductDetailsDialogComponent);
