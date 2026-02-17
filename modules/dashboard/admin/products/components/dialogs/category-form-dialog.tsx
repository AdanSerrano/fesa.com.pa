"use client";

import { memo, useCallback, useState, useTransition } from "react";
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
import { Loader2 } from "lucide-react";
import { ImageUpload } from "../image-upload";
import {
  getProductImageUploadUrlAction,
  createCategoryAction,
  updateCategoryAction,
} from "../../actions/admin-products.actions";
import type { ProductCategory } from "../../types/admin-products.types";

interface FormData {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface CategoryFormDialogProps {
  open: boolean;
  category: ProductCategory | null;
  onClose: () => void;
  onSuccess: () => void;
  labels: {
    createTitle: string;
    editTitle: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    isActive: string;
    isFeatured: string;
    cancel: string;
    save: string;
    saving: string;
  };
}

async function uploadImage(
  type: "category" | "item",
  id: string,
  file: File
): Promise<string | null> {
  const result = await getProductImageUploadUrlAction(type, id, file.name, file.type);
  if ("error" in result) return null;

  const response = await fetch(result.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return response.ok ? result.publicUrl : null;
}

export const CategoryFormDialog = memo(function CategoryFormDialog({
  open,
  category,
  onClose,
  onSuccess,
  labels,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
      isActive: category?.isActive ?? true,
      isFeatured: category?.isFeatured ?? false,
    },
  });

  const handleSubmit = useCallback(
    (data: FormData) => {
      startTransition(async () => {
        try {
          if (isEditing && category) {
            let imageUrl = data.image;

            if (pendingFile) {
              const uploadedUrl = await uploadImage("category", category.id, pendingFile);
              if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const result = await updateCategoryAction({
              id: category.id,
              name: data.name,
              description: data.description || null,
              image: imageUrl || null,
              isActive: data.isActive,
              isFeatured: data.isFeatured,
            });

            if (result.error) {
              return;
            }
          } else {
            const createResult = await createCategoryAction({
              name: data.name,
              description: data.description || null,
              image: null,
              isActive: data.isActive,
              isFeatured: data.isFeatured,
            });

            if (createResult.error) {
              return;
            }

            const createdId = (createResult.data as { id: string } | undefined)?.id;

            if (createdId && pendingFile) {
              const uploadedUrl = await uploadImage("category", createdId, pendingFile);

              if (uploadedUrl) {
                await updateCategoryAction({
                  id: createdId,
                  image: uploadedUrl,
                });
              }
            }
          }

          setPendingFile(null);
          onSuccess();
        } catch {
        }
      });
    },
    [isEditing, category, pendingFile, onSuccess]
  );

  const handleClose = useCallback(() => {
    if (!isPending) {
      setPendingFile(null);
      onClose();
    }
  }, [isPending, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditing ? labels.editTitle : labels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label htmlFor="name">{labels.name} *</Label>
            <Input
              id="name"
              placeholder={labels.namePlaceholder}
              disabled={isPending}
              {...form.register("name", { required: true })}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {labels.name} es requerido
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{labels.description}</Label>
            <Textarea
              id="description"
              placeholder={labels.descriptionPlaceholder}
              disabled={isPending}
              {...form.register("description")}
              rows={3}
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
