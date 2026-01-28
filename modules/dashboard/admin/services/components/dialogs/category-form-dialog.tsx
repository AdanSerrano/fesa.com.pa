"use client";

import { memo, useCallback } from "react";
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
import type { ServiceCategory, CreateCategoryParams, UpdateCategoryParams } from "../../types/admin-services.types";

interface FormData {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface CategoryFormDialogProps {
  open: boolean;
  category: ServiceCategory | null;
  isPending: boolean;
  onClose: () => void;
  onCreate: (data: CreateCategoryParams) => void;
  onUpdate: (data: UpdateCategoryParams) => void;
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

export const CategoryFormDialog = memo(function CategoryFormDialog({
  open,
  category,
  isPending,
  onClose,
  onCreate,
  onUpdate,
  labels,
}: CategoryFormDialogProps) {
  const isEditing = !!category;

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
      const params = {
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      };

      if (isEditing && category) {
        onUpdate({ id: category.id, ...params });
      } else {
        onCreate(params);
      }
    },
    [isEditing, category, onCreate, onUpdate]
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? labels.editTitle : labels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{labels.name} *</Label>
            <Input
              id="name"
              placeholder={labels.namePlaceholder}
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
              {...form.register("description")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{labels.image}</Label>
            <Input
              id="image"
              placeholder={labels.imagePlaceholder}
              {...form.register("image")}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked) => form.setValue("isActive", checked)}
              />
              <Label htmlFor="isActive">{labels.isActive}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isFeatured"
                checked={form.watch("isFeatured")}
                onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">{labels.isFeatured}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
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
