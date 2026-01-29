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
import { FolderOpen, Newspaper, Star, Calendar } from "lucide-react";
import type { NewsCategory, NewsArticle } from "../../types/admin-news.types";

interface CategoryDetailsDialogProps {
  open: boolean;
  category: NewsCategory | null;
  onClose: () => void;
  labels: {
    title: string;
    name: string;
    description: string;
    status: string;
    featured: string;
    articles: string;
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {category.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {category.icon && <span className="text-2xl">{category.icon}</span>}
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{labels.status}</p>
              <Badge variant={category.isActive ? "default" : "outline"}>
                {category.isActive ? labels.active : labels.inactive}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">{labels.featured}</p>
              <div className="flex items-center gap-1">
                {category.isFeatured ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{category.isFeatured ? labels.yes : labels.no}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">{labels.articles}</p>
              <p className="font-medium">{category._count?.news || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{labels.createdAt}</p>
              <p>{format(new Date(category.createdAt), "PPP", { locale: dateLocale })}</p>
            </div>
          </div>

          {category.description && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">{labels.description}</p>
                <p className="text-sm">{category.description}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

interface ArticleDetailsDialogProps {
  open: boolean;
  article: NewsArticle | null;
  onClose: () => void;
  labels: {
    title: string;
    articleTitle: string;
    category: string;
    excerpt: string;
    content: string;
    status: string;
    featured: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    noCategory: string;
    noExcerpt: string;
    noContent: string;
    draft: string;
    published: string;
  };
  locale: string;
}

export const ArticleDetailsDialog = memo(function ArticleDetailsDialog({
  open,
  article,
  onClose,
  labels,
  locale,
}: ArticleDetailsDialogProps) {
  if (!article) return null;

  const dateLocale = locale === "es" ? es : enUS;
  const isPublished = article.publishedAt && new Date(article.publishedAt) <= new Date();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {article.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <h3 className="text-lg font-semibold">{article.title}</h3>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{labels.category}</p>
              <Badge variant="outline">
                <FolderOpen className="mr-1 h-3 w-3" />
                {article.category?.name || labels.noCategory}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">{labels.status}</p>
              <Badge variant={article.isActive ? "default" : "outline"}>
                {article.isActive ? labels.active : labels.inactive}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">{labels.featured}</p>
              <div className="flex items-center gap-1">
                {article.isFeatured ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{article.isFeatured ? labels.yes : labels.no}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">{labels.publishedAt}</p>
              <Badge variant={isPublished ? "default" : "secondary"} className="gap-1">
                <Calendar className="h-3 w-3" />
                {isPublished ? labels.published : labels.draft}
              </Badge>
              {article.publishedAt && (
                <p className="text-xs mt-1">
                  {format(new Date(article.publishedAt), "PPP p", { locale: dateLocale })}
                </p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground">{labels.createdAt}</p>
              <p>{format(new Date(article.createdAt), "PPP", { locale: dateLocale })}</p>
            </div>
          </div>

          {article.excerpt && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">{labels.excerpt}</p>
                <p className="text-sm">{article.excerpt}</p>
              </div>
            </>
          )}

          {article.content && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">{labels.content}</p>
                <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
