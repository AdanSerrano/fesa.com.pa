"use client";

import { memo } from "react";
import { CategoryFormDialog as BaseCategoryFormDialog } from "../../../_shared/components/dialogs/category-form-dialog";
import {
  getProductImageUploadUrlAction,
  createCategoryAction,
  updateCategoryAction,
} from "../../actions/admin-products.actions";
import type { ProductCategory } from "../../types/admin-products.types";

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

export const CategoryFormDialog = memo(function CategoryFormDialog({
  open,
  category,
  onClose,
  onSuccess,
  labels,
}: CategoryFormDialogProps) {
  return (
    <BaseCategoryFormDialog
      open={open}
      category={category}
      onClose={onClose}
      onSuccess={onSuccess}
      getUploadUrlAction={getProductImageUploadUrlAction}
      createCategoryAction={createCategoryAction}
      updateCategoryAction={updateCategoryAction}
      labels={labels}
    />
  );
});
