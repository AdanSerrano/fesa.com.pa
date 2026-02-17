"use client";

import { memo, useCallback, useState, useTransition, useMemo, useRef, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "../../../_shared/components/image-upload";
import { MultiImageUpload, type ImageItem } from "../multi-image-upload";
import { uploadImage } from "../../../_shared/utils/upload-image";
import {
  getNewsImageUploadUrlAction,
  createArticleAction,
  updateArticleAction,
} from "../../actions/admin-news.actions";
import type { NewsArticle, CategoryForSelect, ImageInput } from "../../types/admin-news.types";

interface FormData {
  categoryId: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface ArticleFormDialogProps {
  open: boolean;
  article: NewsArticle | null;
  categories: CategoryForSelect[];
  onClose: () => void;
  onSuccess: () => void;
  labels: {
    createTitle: string;
    editTitle: string;
    category: string;
    selectCategory: string;
    noCategory: string;
    title: string;
    titlePlaceholder: string;
    excerpt: string;
    excerptPlaceholder: string;
    content: string;
    contentPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    publishedAt: string;
    isActive: string;
    isFeatured: string;
    cancel: string;
    save: string;
    saving: string;
    additionalImages?: string;
  };
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
}

export const ArticleFormDialog = memo(function ArticleFormDialog({
  open,
  article,
  categories,
  onClose,
  onSuccess,
  labels,
}: ArticleFormDialogProps) {
  const isEditing = !!article;
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialAdditionalImages = useMemo<ImageItem[]>(() => {
    if (!article?.images) return [];
    return article.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      order: img.order,
    }));
  }, [article?.images]);

  const [additionalImages, setAdditionalImages] = useState<ImageItem[]>(initialAdditionalImages);

  const form = useForm<FormData>({
    defaultValues: {
      categoryId: article?.categoryId || "",
      title: article?.title || "",
      excerpt: article?.excerpt || "",
      content: article?.content || "",
      image: article?.image || "",
      publishedAt: formatDateForInput(article?.publishedAt || null),
      isActive: article?.isActive ?? true,
      isFeatured: article?.isFeatured ?? false,
    },
  });

  const prevOpenRef = useRef(false);
  const prevArticleIdRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    const articleChanged = article?.id !== prevArticleIdRef.current;

    if (justOpened || articleChanged) {
      setAdditionalImages(initialAdditionalImages);
      setPendingFile(null);
      form.reset({
        categoryId: article?.categoryId || "",
        title: article?.title || "",
        excerpt: article?.excerpt || "",
        content: article?.content || "",
        image: article?.image || "",
        publishedAt: formatDateForInput(article?.publishedAt || null),
        isActive: article?.isActive ?? true,
        isFeatured: article?.isFeatured ?? false,
      });
    }

    prevOpenRef.current = open;
    prevArticleIdRef.current = article?.id ?? null;
  }, [open, article, initialAdditionalImages, form]);

  const handleSubmit = useCallback(
    (data: FormData) => {
      startTransition(async () => {
        try {
          const publishedAtValue = data.publishedAt ? new Date(data.publishedAt) : null;

          if (isEditing && article) {
            let imageUrl = data.image;

            if (pendingFile) {
              const uploadedUrl = await uploadImage(getNewsImageUploadUrlAction, "article", article.id, pendingFile);
              if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const uploadedImages: ImageInput[] = [];
            for (let i = 0; i < additionalImages.length; i++) {
              const img = additionalImages[i];
              if (img.file) {
                const uploadedUrl = await uploadImage(getNewsImageUploadUrlAction, "article", article.id, img.file, i);
                if (uploadedUrl) {
                  uploadedImages.push({
                    url: uploadedUrl,
                    alt: img.alt,
                    order: i,
                  });
                }
              } else if (img.url) {
                uploadedImages.push({
                  url: img.url,
                  alt: img.alt,
                  order: i,
                });
              }
            }

            const result = await updateArticleAction({
              id: article.id,
              categoryId: data.categoryId || null,
              title: data.title,
              excerpt: data.excerpt || null,
              content: data.content || null,
              image: imageUrl || null,
              images: uploadedImages,
              publishedAt: publishedAtValue,
              isActive: data.isActive,
              isFeatured: data.isFeatured,
            });

            if (result.error) {
              return;
            }
          } else {
            const createResult = await createArticleAction({
              categoryId: data.categoryId || null,
              title: data.title,
              excerpt: data.excerpt || null,
              content: data.content || null,
              image: null,
              publishedAt: publishedAtValue,
              isActive: data.isActive,
              isFeatured: data.isFeatured,
            });

            if (createResult.error) {
              return;
            }

            const createdId = (createResult.data as { id: string } | undefined)?.id;

            if (createdId) {
              let mainImageUrl: string | null = null;

              if (pendingFile) {
                mainImageUrl = await uploadImage(getNewsImageUploadUrlAction, "article", createdId, pendingFile);
              }

              const uploadedImages: ImageInput[] = [];
              for (let i = 0; i < additionalImages.length; i++) {
                const img = additionalImages[i];
                if (img.file) {
                  const uploadedUrl = await uploadImage(getNewsImageUploadUrlAction, "article", createdId, img.file, i);
                  if (uploadedUrl) {
                    uploadedImages.push({
                      url: uploadedUrl,
                      alt: img.alt,
                      order: i,
                    });
                  }
                }
              }

              if (mainImageUrl || uploadedImages.length > 0) {
                await updateArticleAction({
                  id: createdId,
                  image: mainImageUrl,
                  images: uploadedImages.length > 0 ? uploadedImages : undefined,
                });
              }
            }
          }

          setPendingFile(null);
          setAdditionalImages([]);
          onSuccess();
        } catch {
        }
      });
    },
    [isEditing, article, pendingFile, additionalImages, onSuccess]
  );

  const handleClose = useCallback(() => {
    if (!isPending) {
      setPendingFile(null);
      setAdditionalImages(initialAdditionalImages);
      onClose();
    }
  }, [isPending, initialAdditionalImages, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditing ? labels.editTitle : labels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label>{labels.category}</Label>
            <Select
              value={form.watch("categoryId")}
              onValueChange={(value) => form.setValue("categoryId", value === "none" ? "" : value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{labels.noCategory}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">{labels.title} *</Label>
            <Input
              id="title"
              placeholder={labels.titlePlaceholder}
              disabled={isPending}
              {...form.register("title", { required: true })}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {labels.title} es requerido
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">{labels.excerpt}</Label>
            <Textarea
              id="excerpt"
              placeholder={labels.excerptPlaceholder}
              disabled={isPending}
              {...form.register("excerpt")}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{labels.content}</Label>
            <Textarea
              id="content"
              placeholder={labels.contentPlaceholder}
              disabled={isPending}
              {...form.register("content")}
              rows={6}
            />
          </div>

          <ImageUpload
            label={labels.image}
            value={form.watch("image")}
            pendingFile={pendingFile}
            onChange={(url) => form.setValue("image", url)}
            onFileSelect={setPendingFile}
            disabled={isPending}
          />

          <MultiImageUpload
            label={labels.additionalImages || "Imágenes adicionales"}
            value={additionalImages}
            onChange={setAdditionalImages}
            disabled={isPending}
            maxImages={10}
          />

          <div className="space-y-2">
            <Label htmlFor="publishedAt">{labels.publishedAt}</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              disabled={isPending}
              {...form.register("publishedAt")}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked) => form.setValue("isActive", checked)}
                disabled={isPending}
              />
              <Label htmlFor="isActive">{labels.isActive}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isFeatured"
                checked={form.watch("isFeatured")}
                onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
                disabled={isPending}
              />
              <Label htmlFor="isFeatured">{labels.isFeatured}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {labels.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? labels.saving : labels.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
