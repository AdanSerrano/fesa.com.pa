"use client";

import { memo, useCallback } from "react";
import type { CustomColumnDef } from "@/components/custom-datatable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, BookOpen, Star } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { AdminCatalog } from "../../types/admin-catalogs.types";

type DialogType = "catalog-details" | "catalog-edit" | "catalog-delete";

interface ColumnTranslations {
  title: string;
  year: string;
  pages: string;
  status: string;
  featured: string;
  createdAt: string;
  active: string;
  inactive: string;
  yes: string;
  no: string;
  actions: string;
  viewDetails: string;
  edit: string;
  delete: string;
}

interface ColumnActions {
  onOpenDialog: (type: DialogType, catalog: AdminCatalog) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  translations: ColumnTranslations;
  locale: string;
}

const CatalogImageCell = memo(function CatalogImageCell({
  coverImage,
  title,
}: {
  coverImage: string | null;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted flex items-center justify-center">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <span className="font-medium">{title}</span>
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

const PagesCountCell = memo(function PagesCountCell({ count }: { count: number }) {
  return (
    <Badge variant="outline" className="gap-1">
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

interface ActionsCellProps {
  catalog: AdminCatalog;
  onOpenDialog: (type: DialogType, catalog: AdminCatalog) => void;
  labels: ColumnTranslations;
}

const ActionsCell = memo(function ActionsCell({
  catalog,
  onOpenDialog,
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpenDialog("catalog-details", catalog)}>
          <Eye className="mr-2 h-4 w-4" />
          {labels.viewDetails}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenDialog("catalog-edit", catalog)}>
          <Pencil className="mr-2 h-4 w-4" />
          {labels.edit}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onOpenDialog("catalog-delete", catalog)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {labels.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export function createCatalogColumns(actions: ColumnActions): CustomColumnDef<AdminCatalog>[] {
  const { onOpenDialog, onToggleStatus, onToggleFeatured, translations: t, locale } = actions;

  return [
    {
      id: "title",
      accessorKey: "title",
      header: t.title,
      enableSorting: true,
      minWidth: 250,
      cell: ({ row }) => (
        <CatalogImageCell coverImage={row.coverImage} title={row.title} />
      ),
    },
    {
      id: "year",
      accessorKey: "year",
      header: t.year,
      enableSorting: true,
      align: "center",
      cell: ({ row }) => <Badge variant="outline">{row.year}</Badge>,
    },
    {
      id: "pages",
      header: t.pages,
      enableSorting: false,
      align: "center",
      cell: ({ row }) => <PagesCountCell count={row._count?.pages || 0} />,
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
        <ActionsCell
          catalog={row}
          onOpenDialog={onOpenDialog}
          labels={t}
        />
      ),
    },
  ];
}
