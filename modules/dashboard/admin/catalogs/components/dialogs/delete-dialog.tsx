"use client";

import { memo, useCallback, useTransition } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCatalogAction } from "../../actions/admin-catalogs.actions";
import type { AdminCatalog } from "../../types/admin-catalogs.types";

interface Labels {
  title: string;
  description: string;
  cancel: string;
  delete: string;
  deleting: string;
  warning: string;
}

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: AdminCatalog | null;
  labels: Labels;
  onSuccess: () => void;
}

function DeleteDialogComponent({
  open,
  onOpenChange,
  catalog,
  labels,
  onSuccess,
}: DeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = useCallback(() => {
    if (!catalog) return;

    startTransition(async () => {
      const result = await deleteCatalogAction(catalog.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        onOpenChange(false);
        onSuccess();
      }
    });
  }, [catalog, onOpenChange, onSuccess]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {labels.description.replace("{name}", catalog?.title || "")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-destructive">{labels.warning}</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{labels.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {labels.deleting}
              </>
            ) : (
              labels.delete
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const DeleteDialog = memo(DeleteDialogComponent);
DeleteDialog.displayName = "DeleteDialog";
