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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type {
  ServiceItem,
  CreateItemParams,
  UpdateItemParams,
  CategoryForSelect,
} from "../../types/admin-services.types";

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
  isPending: boolean;
  onClose: () => void;
  onCreate: (data: CreateItemParams) => void;
  onUpdate: (data: UpdateItemParams) => void;
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

export const ItemFormDialog = memo(function ItemFormDialog({
  open,
  item,
  categories,
  isPending,
  onClose,
  onCreate,
  onUpdate,
  labels,
}: ItemFormDialogProps) {
  const isEditing = !!item;

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
      const params = {
        categoryId: data.categoryId || null,
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        isActive: data.isActive,
      };

      if (isEditing && item) {
        onUpdate({ id: item.id, ...params });
      } else {
        onCreate(params);
      }
    },
    [isEditing, item, onCreate, onUpdate]
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
            <Label>{labels.category}</Label>
            <Select
              value={form.watch("categoryId")}
              onValueChange={(value) => form.setValue("categoryId", value === "none" ? "" : value)}
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

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">{labels.isActive}</Label>
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
