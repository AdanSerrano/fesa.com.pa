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
  Newspaper,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { CustomColumnDef } from "@/components/custom-datatable";
import type {
  NewsCategory,
  NewsArticle,
  AdminNewsDialogType,
} from "../../types/admin-news.types";

interface ColumnTranslations {
  name: string;
  title: string;
  category: string;
  status: string;
  featured: string;
  articles: string;
  publishedAt: string;
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
  draft: string;
  published: string;
}

interface CategoryColumnActions {
  onOpenDialog: (dialog: AdminNewsDialogType, category: NewsCategory) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  translations: ColumnTranslations;
  locale: string;
}

interface ArticleColumnActions {
  onOpenDialog: (dialog: AdminNewsDialogType, article: NewsArticle) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
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

const ArticleImageCell = memo(function ArticleImageCell({
  image,
  title,
  categoryName,
}: {
  image: string | null;
  title: string;
  categoryName: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <Newspaper className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-medium line-clamp-1">{title}</span>
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

const ArticlesCountCell = memo(function ArticlesCountCell({ count }: { count: number }) {
  return (
    <Badge variant="outline" className="gap-1">
      <Newspaper className="h-3 w-3" />
      {count}
    </Badge>
  );
});

const DateCell = memo(function DateCell({
  date,
  locale,
}: {
  date: Date | null;
  locale: string;
}) {
  if (!date) return <span className="text-muted-foreground">-</span>;
  const dateLocale = locale === "es" ? es : enUS;
  return (
    <span className="text-sm text-muted-foreground">
      {format(new Date(date), "dd MMM yyyy", { locale: dateLocale })}
    </span>
  );
});

const PublishedStatusCell = memo(function PublishedStatusCell({
  publishedAt,
  labels,
}: {
  publishedAt: Date | null;
  labels: ColumnTranslations;
}) {
  const isPublished = publishedAt && new Date(publishedAt) <= new Date();
  return (
    <Badge variant={isPublished ? "default" : "outline"} className="gap-1">
      <Calendar className="h-3 w-3" />
      {isPublished ? labels.published : labels.draft}
    </Badge>
  );
});

interface CategoryActionsCellProps {
  category: NewsCategory;
  onOpenDialog: (dialog: AdminNewsDialogType, category: NewsCategory) => void;
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

interface ArticleActionsCellProps {
  article: NewsArticle;
  onOpenDialog: (dialog: AdminNewsDialogType, article: NewsArticle) => void;
  labels: ColumnTranslations;
}

const ArticleActionsCell = memo(function ArticleActionsCell({
  article,
  onOpenDialog,
  labels,
}: ArticleActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{labels.actions}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpenDialog("article-details", article)}>
          <Eye className="mr-2 h-4 w-4" />
          {labels.viewDetails}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenDialog("article-edit", article)}>
          <Pencil className="mr-2 h-4 w-4" />
          {labels.edit}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onOpenDialog("article-delete", article)}
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
): CustomColumnDef<NewsCategory>[] {
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
      id: "articles",
      header: t.articles,
      enableSorting: false,
      align: "center",
      cell: ({ row }) => <ArticlesCountCell count={row._count?.news || 0} />,
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

export function createArticleColumns(
  actions: ArticleColumnActions
): CustomColumnDef<NewsArticle>[] {
  const { translations: t, locale, onOpenDialog, onToggleStatus, onToggleFeatured } = actions;

  return [
    {
      id: "title",
      accessorKey: "title",
      header: t.title,
      enableSorting: true,
      minWidth: 280,
      cell: ({ row }) => (
        <ArticleImageCell
          image={row.image}
          title={row.title}
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
      id: "publishedAt",
      accessorKey: "publishedAt",
      header: t.publishedAt,
      enableSorting: true,
      cell: ({ row }) => (
        <PublishedStatusCell publishedAt={row.publishedAt} labels={t} />
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
      id: "actions",
      header: "",
      pinned: "right",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <ArticleActionsCell article={row} onOpenDialog={onOpenDialog} labels={t} />
      ),
    },
  ];
}
