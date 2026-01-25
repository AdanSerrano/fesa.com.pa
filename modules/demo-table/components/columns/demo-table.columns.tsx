"use client";

import { memo } from "react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Power,
  PowerOff,
  Archive,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { CustomColumnDef } from "@/components/custom-datatable";
import type { DemoProduct, ProductStatus, ProductCategory } from "../../types/demo-table.types";

export interface ColumnLabels {
  columns: {
    product: string;
    category: string;
    price: string;
    stock: string;
    status: string;
    updatedAt: string;
    actions: string;
  };
  status: {
    active: string;
    inactive: string;
    discontinued: string;
  };
  categories: {
    electronics: string;
    clothing: string;
    food: string;
    books: string;
    other: string;
  };
  actions: {
    actions: string;
    viewDetails: string;
    activate: string;
    deactivate: string;
    discontinue: string;
    delete: string;
  };
  lowStock: string;
  locale: string;
}

interface ColumnActions {
  onView: (product: DemoProduct) => void;
  onDelete: (product: DemoProduct) => void;
  onChangeStatus: (product: DemoProduct, status: ProductStatus) => void;
}

// ============================================
// CONSTANTS
// ============================================

const categoryColors: Record<ProductCategory, string> = {
  electronics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  clothing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  food: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  books: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

// ============================================
// MEMOIZED CELL COMPONENTS
// ============================================

// Product Name Cell with image
const ProductCell = memo(function ProductCell({
  name,
  sku,
  imageUrl,
}: {
  name: string;
  sku: string;
  imageUrl: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <p className="font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{sku}</p>
      </div>
    </div>
  );
});

// Category Badge Cell
const CategoryCell = memo(function CategoryCell({
  category,
  label,
}: {
  category: ProductCategory;
  label: string;
}) {
  return (
    <Badge variant="outline" className={cn("font-normal", categoryColors[category])}>
      {label}
    </Badge>
  );
});

// Price Cell
const PriceCell = memo(function PriceCell({ price }: { price: number }) {
  return (
    <span className="font-mono font-medium">
      ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
    </span>
  );
});

// Stock Cell with low stock warning
const StockCell = memo(function StockCell({ stock, lowStockLabel }: { stock: number; lowStockLabel: string }) {
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

  return (
    <div className="flex items-center justify-center gap-1">
      {isLowStock && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>{lowStockLabel}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <span
        className={cn(
          "font-mono",
          isOutOfStock && "text-destructive",
          isLowStock && "text-amber-600 font-medium"
        )}
      >
        {stock}
      </span>
    </div>
  );
});

// Status Badge Cell
interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive";
  icon: React.ElementType;
}

const StatusCell = memo(function StatusCell({
  status,
  statusLabels
}: {
  status: ProductStatus;
  statusLabels: Record<ProductStatus, StatusConfig>;
}) {
  const config = statusLabels[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
});

// Updated At Cell with tooltip
const UpdatedAtCell = memo(function UpdatedAtCell({
  updatedAt,
  locale,
}: {
  updatedAt: Date;
  locale: string;
}) {
  const date = new Date(updatedAt);
  const dateLocale = locale === "es" ? es : enUS;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm text-muted-foreground">
            {format(date, "dd MMM yyyy", { locale: dateLocale })}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {format(date, "dd/MM/yyyy HH:mm", { locale: dateLocale })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Actions Dropdown Cell
interface ActionLabels {
  actions: string;
  viewDetails: string;
  activate: string;
  deactivate: string;
  discontinue: string;
  delete: string;
}

interface ActionsCellProps {
  product: DemoProduct;
  onView: (product: DemoProduct) => void;
  onDelete: (product: DemoProduct) => void;
  onChangeStatus: (product: DemoProduct, status: ProductStatus) => void;
  labels: ActionLabels;
}

const ActionsCell = memo(function ActionsCell({
  product,
  onView,
  onDelete,
  onChangeStatus,
  labels,
}: ActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{labels.actions}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{labels.actions}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onView(product)} className="gap-2">
          <Eye className="h-4 w-4" />
          {labels.viewDetails}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {product.status !== "active" && (
          <DropdownMenuItem
            onClick={() => onChangeStatus(product, "active")}
            className="gap-2 text-green-600"
          >
            <Power className="h-4 w-4" />
            {labels.activate}
          </DropdownMenuItem>
        )}

        {product.status !== "inactive" && (
          <DropdownMenuItem
            onClick={() => onChangeStatus(product, "inactive")}
            className="gap-2 text-amber-600"
          >
            <PowerOff className="h-4 w-4" />
            {labels.deactivate}
          </DropdownMenuItem>
        )}

        {product.status !== "discontinued" && (
          <DropdownMenuItem
            onClick={() => onChangeStatus(product, "discontinued")}
            className="gap-2 text-gray-600"
          >
            <Archive className="h-4 w-4" />
            {labels.discontinue}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(product)}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {labels.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// ============================================
// COLUMNS FACTORY
// ============================================

interface CreateColumnsOptions {
  actions: ColumnActions;
  labels: ColumnLabels;
}

export function createDemoTableColumns({ actions, labels }: CreateColumnsOptions): CustomColumnDef<DemoProduct>[] {
  const statusLabels: Record<ProductStatus, StatusConfig> = {
    active: { label: labels.status.active, variant: "default", icon: Power },
    inactive: { label: labels.status.inactive, variant: "secondary", icon: PowerOff },
    discontinued: { label: labels.status.discontinued, variant: "destructive", icon: Archive },
  };

  const categoryLabelsMap: Record<ProductCategory, string> = {
    electronics: labels.categories.electronics,
    clothing: labels.categories.clothing,
    food: labels.categories.food,
    books: labels.categories.books,
    other: labels.categories.other,
  };

  return [
    {
      id: "name",
      accessorKey: "name",
      header: labels.columns.product,
      enableSorting: true,
      enableHiding: false,
      minWidth: 250,
      cell: ({ row }) => (
        <ProductCell name={row.name} sku={row.sku} imageUrl={row.imageUrl} />
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: labels.columns.category,
      enableSorting: true,
      minWidth: 120,
      cell: ({ row }) => <CategoryCell category={row.category} label={categoryLabelsMap[row.category]} />,
    },
    {
      id: "price",
      accessorKey: "price",
      header: labels.columns.price,
      align: "right",
      enableSorting: true,
      minWidth: 100,
      cell: ({ row }) => <PriceCell price={row.price} />,
    },
    {
      id: "stock",
      accessorKey: "stock",
      header: labels.columns.stock,
      align: "center",
      enableSorting: true,
      minWidth: 100,
      cell: ({ row }) => <StockCell stock={row.stock} lowStockLabel={labels.lowStock} />,
    },
    {
      id: "status",
      accessorKey: "status",
      header: labels.columns.status,
      align: "center",
      enableSorting: true,
      minWidth: 130,
      cell: ({ row }) => <StatusCell status={row.status} statusLabels={statusLabels} />,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: labels.columns.updatedAt,
      enableSorting: true,
      minWidth: 140,
      cell: ({ row }) => <UpdatedAtCell updatedAt={row.updatedAt} locale={labels.locale} />,
    },
    {
      id: "actions",
      header: labels.columns.actions,
      align: "center",
      pinned: "right",
      enableSorting: false,
      enableHiding: false,
      minWidth: 80,
      cell: ({ row }) => (
        <ActionsCell
          product={row}
          onView={actions.onView}
          onDelete={actions.onDelete}
          onChangeStatus={actions.onChangeStatus}
          labels={labels.actions}
        />
      ),
    },
  ];
}
