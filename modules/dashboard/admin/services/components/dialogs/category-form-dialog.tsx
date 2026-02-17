"use client";

import { memo } from "react";
import { CategoryFormDialog as BaseCategoryFormDialog } from "../../../_shared/components/dialogs/category-form-dialog";
import {
  getServiceImageUploadUrlAction,
  createCategoryAction,
  updateCategoryAction,
} from "../../actions/admin-services.actions";
import type { ServiceCategory } from "../../types/admin-services.types";

interface CategoryFormDialogProps {
  open: boolean;
  category: ServiceCategory | null;
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
      getUploadUrlAction={getServiceImageUploadUrlAction}
      createCategoryAction={createCategoryAction}
      updateCategoryAction={updateCategoryAction}
      labels={labels}
    />
  );
});
