"use client";

import { memo } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  itemName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  labels: {
    cancel: string;
    delete: string;
    deleting: string;
    warning: string;
  };
}

export const DeleteDialog = memo(function DeleteDialog({
  open,
  title,
  description,
  itemName,
  isPending,
  onClose,
  onConfirm,
  labels,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                {description.replace("{name}", itemName)}
              </p>
              <p className="text-destructive font-medium">
                {labels.warning}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {labels.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? labels.deleting : labels.delete}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
