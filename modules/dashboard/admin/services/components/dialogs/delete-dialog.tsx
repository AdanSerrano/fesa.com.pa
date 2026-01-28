"use client";

import { memo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";

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
          <AlertDialogDescription className="space-y-2">
            <p>{description.replace("{name}", itemName)}</p>
            <p className="text-destructive font-medium">{labels.warning}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{labels.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? labels.deleting : labels.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
