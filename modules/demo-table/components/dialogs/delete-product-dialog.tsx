"use client";

import { memo, useCallback, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { DemoProduct } from "../../types/demo-table.types";

export interface DeleteDialogLabels {
  title: string;
  description: string;
  warning: string;
  cancel: string;
  delete: string;
  deleting: string;
}

interface Props {
  product: DemoProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
  labels: DeleteDialogLabels;
}

function DeleteProductDialogComponent({ product, open, onOpenChange, onConfirm, labels }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = useCallback(() => {
    if (!product) return;

    startTransition(async () => {
      try {
        await onConfirm(product.id);
      } catch {
        // Error handled by hook
      }
    });
  }, [product, onConfirm]);

  if (!product) return null;

  const warningText = labels.warning
    .replace("{name}", product.name)
    .replace("{sku}", product.sku);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {labels.title}
          </DialogTitle>
          <DialogDescription>
            {labels.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{warningText}</AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {labels.cancel}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? labels.deleting : labels.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const DeleteProductDialog = memo(DeleteProductDialogComponent);
