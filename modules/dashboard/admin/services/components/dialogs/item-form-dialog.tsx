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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "../image-upload";
import {
  getServiceImageUploadUrlAction,
  createItemAction,
  updateItemAction,
} from "../../actions/admin-services.actions";
import type { ServiceItem, CategoryForSelect } from "../../types/admin-services.types";

interface FormData {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

interface ItemFormDialogProps {
  open: boolean;
  item: ServiceItem | null;
  categories: CategoryForSelect[];
  onClose: () => void;
  onSuccess: () => void;
  labels: {
    createTitle: string;
    editTitle: string;
    category: string;
    selectCategory: string;
    noCategory: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    isActive: string;
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
  const result = await getServiceImageUploadUrlAction(type, id, file.name, file.type);
  if ("error" in result) return null;

  const response = await fetch(result.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return response.ok ? result.publicUrl : null;
}

export const ItemFormDialog = memo(function ItemFormDialog({
  open,
  item,
  categories,
  onClose,
  onSuccess,
  labels,
}: ItemFormDialogProps) {
  const isEditing = !!item;
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    defaultValues: {
      categoryId: item?.categoryId || "",
      name: item?.name || "",
      description: item?.description || "",
      image: item?.image || "",
      isActive: item?.isActive ?? true,
    },
  });

  const handleSubmit = useCallback(
    (data: FormData) => {
      startTransition(async () => {
        try {
          if (isEditing && item) {
            let imageUrl = data.image;

            if (pendingFile) {
              const uploadedUrl = await uploadImage("item", item.id, pendingFile);
              if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const result = await updateItemAction({
              id: item.id,
              categoryId: data.categoryId || null,
              name: data.name,
              description: data.description || null,
              image: imageUrl || null,
              isActive: data.isActive,
            });

            if (result.error) {
              return;
            }
          } else {
            const createResult = await createItemAction({
              categoryId: data.categoryId || null,
              name: data.name,
              description: data.description || null,
              image: null,
              isActive: data.isActive,
            });

            if (createResult.error) {
              return;
            }

            const createdId = (createResult.data as { id: string } | undefined)?.id;

            if (createdId && pendingFile) {
              const uploadedUrl = await uploadImage("item", createdId, pendingFile);

              if (uploadedUrl) {
                await updateItemAction({
                  id: createdId,
                  image: uploadedUrl,
                });
              }
            }
          }

          setPendingFile(null);
          onSuccess();
        } catch {
          // Error handling
        }
      });
    },
    [isEditing, item, pendingFile, onSuccess]
  );

  const handleClose = useCallback(() => {
    if (!isPending) {
      setPendingFile(null);
      onClose();
    }
  }, [isPending, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? labels.editTitle : labels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
              disabled={isPending}
            />
            <Label htmlFor="isActive">{labels.isActive}</Label>
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
