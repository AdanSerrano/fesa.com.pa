"use client";

import { memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { AdminUser } from "../../types/admin-users.types";

interface DeleteUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onDelete: (userId: string) => void;
}

export const DeleteUserDialog = memo(function DeleteUserDialog({
  user,
  open,
  isPending,
  onClose,
  onDelete,
}: DeleteUserDialogProps) {
  const handleConfirm = useCallback(() => {
    if (!user) return;
    onDelete(user.id);
  }, [user, onDelete]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Eliminar Usuario
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>{user.name || user.email}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">
                Esta acción es irreversible
              </p>
              <ul className="mt-2 list-inside list-disc text-muted-foreground">
                <li>El usuario no podrá acceder al sistema</li>
                <li>Sus datos serán marcados como eliminados</li>
                <li>No podrá recuperar su cuenta</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
