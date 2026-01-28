"use client";

import { memo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Star,
  FolderOpen,
  Layers,
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { CustomColumnDef } from "@/components/custom-datatable";
import type {
  ServiceCategory,
  ServiceItem,
  AdminServicesDialogType,
} from "../../types/admin-services.types";

interface ColumnTranslations {
  name: string;
  category: string;
  status: string;
  featured: string;
  items: string;
  createdAt: string;
  active: string;
  inactive: string;
  yes: string;
  no: string;
  actions: string;
  viewDetails: string;
  edit: string;
  delete: string;
  noCategory: string;
}

interface CategoryColumnActions {
  onOpenDialog: (dialog: AdminServicesDialogType, category: ServiceCategory) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  translations: ColumnTranslations;
  locale: string;
}

interface ItemColumnActions {
  onOpenDialog: (dialog: AdminServicesDialogType, item: ServiceItem) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  translations: ColumnTranslations;
  locale: string;
}

const CategoryImageCell = memo(function CategoryImageCell({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  );
});

const ItemImageCell = memo(function ItemImageCell({
  image,
  name,
  categoryName,
}: {
  image: string | null;
  name: string;
  categoryName: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <Layers className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        {categoryName && (
          <span className="text-xs text-muted-foreground">{categoryName}</span>
        )}
      </div>
    </div>
  );
});

const FeaturedCell = memo(function FeaturedCell({
  isFeatured,
}: {
  isFeatured: boolean;
}) {
  return isFeatured ? (
    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
  ) : (
    <Star className="h-4 w-4 text-muted-foreground" />
  );
});

const ItemsCountCell = memo(function ItemsCountCell({ count }: { count: number }) {
  return (
    <Badge variant="outline" className="gap-1">
      <Layers className="h-3 w-3" />
      {count}
    </Badge>
  );
});

const DateCell = memo(function DateCell({
  date,
  locale,
}: {
  date: Date;
  locale: string;
}) {
  const dateLocale = locale === "es" ? es : enUS;
  return (
    <span className="text-sm text-muted-foreground">
      {format(new Date(date), "dd MMM yyyy", { locale: dateLocale })}
    </span>
  );
});

interface CategoryActionsCellProps {
  category: ServiceCategory;
  onOpenDialog: (dialog: AdminServicesDialogType, category: ServiceCategory) => void;
  labels: ColumnTranslations;
}

const CategoryActionsCell = memo(function CategoryActionsCell({
  category,
  onOpenDialog,
  labels,
}: CategoryActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{labels.actions}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpenDialog("category-details", category)}>
          <Eye className="mr-2 h-4 w-4" />
          {labels.viewDetails}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenDialog("category-edit", category)}>
          <Pencil className="mr-2 h-4 w-4" />
          {labels.edit}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onOpenDialog("category-delete", category)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {labels.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

interface ItemActionsCellProps {
  item: ServiceItem;
  onOpenDialog: (dialog: AdminServicesDialogType, item: ServiceItem) => void;
  labels: ColumnTranslations;
}

const ItemActionsCell = memo(function ItemActionsCell({
  item,
  onOpenDialog,
  labels,
}: ItemActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{labels.actions}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpenDialog("item-details", item)}>
          <Eye className="mr-2 h-4 w-4" />
          {labels.viewDetails}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenDialog("item-edit", item)}>
          <Pencil className="mr-2 h-4 w-4" />
          {labels.edit}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onOpenDialog("item-delete", item)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {labels.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export function createCategoryColumns(
  actions: CategoryColumnActions
): CustomColumnDef<ServiceCategory>[] {
  const { translations: t, locale, onOpenDialog, onToggleStatus, onToggleFeatured } = actions;

  return [
    {
      id: "name",
      accessorKey: "name",
      header: t.name,
      enableSorting: true,
      minWidth: 250,
      cell: ({ row }) => (
        <CategoryImageCell
          image={row.image}
          name={row.name}
        />
      ),
    },
    {
      id: "items",
      header: t.items,
      enableSorting: false,
      align: "center",
      cell: ({ row }) => <ItemsCountCell count={row._count?.items || 0} />,
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: t.status,
      enableSorting: true,
      align: "center",
      cell: ({ row }) => (
        <Switch
          checked={row.isActive}
          onCheckedChange={(checked) => onToggleStatus(row.id, checked)}
        />
      ),
    },
    {
      id: "isFeatured",
      accessorKey: "isFeatured",
      header: t.featured,
      enableSorting: true,
      align: "center",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleFeatured(row.id, !row.isFeatured)}
        >
          <FeaturedCell isFeatured={row.isFeatured} />
        </Button>
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: t.createdAt,
      enableSorting: true,
      cell: ({ row }) => <DateCell date={row.createdAt} locale={locale} />,
    },
    {
      id: "actions",
      header: "",
      pinned: "right",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <CategoryActionsCell
          category={row}
          onOpenDialog={onOpenDialog}
          labels={t}
        />
      ),
    },
  ];
}

export function createItemColumns(
  actions: ItemColumnActions
): CustomColumnDef<ServiceItem>[] {
  const { translations: t, locale, onOpenDialog, onToggleStatus } = actions;

  return [
    {
      id: "name",
      accessorKey: "name",
      header: t.name,
      enableSorting: true,
      minWidth: 280,
      cell: ({ row }) => (
        <ItemImageCell
          image={row.image}
          name={row.name}
          categoryName={row.category?.name || ""}
        />
      ),
    },
    {
      id: "category",
      header: t.category,
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant="outline">
          <FolderOpen className="mr-1 h-3 w-3" />
          {row.category?.name || t.noCategory}
        </Badge>
      ),
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: t.status,
      enableSorting: true,
      align: "center",
      cell: ({ row }) => (
        <Switch
          checked={row.isActive}
          onCheckedChange={(checked) => onToggleStatus(row.id, checked)}
        />
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: t.createdAt,
      enableSorting: true,
      cell: ({ row }) => <DateCell date={row.createdAt} locale={locale} />,
    },
    {
      id: "actions",
      header: "",
      pinned: "right",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <ItemActionsCell item={row} onOpenDialog={onOpenDialog} labels={t} />
      ),
    },
  ];
}
