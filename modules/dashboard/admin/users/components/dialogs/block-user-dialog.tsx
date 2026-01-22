"use client";

import { memo, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Ban, Unlock } from "lucide-react";
import type { AdminUser } from "../../types/admin-users.types";

interface BlockUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  mode: "block" | "unblock";
  onClose: () => void;
  onBlock: (userId: string, reason?: string) => void;
  onUnblock: (userId: string) => void;
}

export const BlockUserDialog = memo(function BlockUserDialog({
  user,
  open,
  isPending,
  mode,
  onClose,
  onBlock,
  onUnblock,
}: BlockUserDialogProps) {
  const [reason, setReason] = useState("");

  const handleClose = useCallback(() => {
    setReason("");
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (!user) return;

    if (mode === "block") {
      onBlock(user.id, reason || undefined);
    } else {
      onUnblock(user.id);
    }
  }, [user, mode, reason, onBlock, onUnblock]);

  if (!user) return null;

  const isBlocking = mode === "block";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBlocking ? (
              <>
                <Ban className="h-5 w-5 text-destructive" />
                Bloquear Usuario
              </>
            ) : (
              <>
                <Unlock className="h-5 w-5 text-green-600" />
                Desbloquear Usuario
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isBlocking
              ? `¿Estás seguro de que deseas bloquear a ${user.name || user.email}? El usuario no podrá acceder al sistema.`
              : `¿Deseas desbloquear a ${user.name || user.email}? El usuario podrá acceder nuevamente al sistema.`}
          </DialogDescription>
        </DialogHeader>

        {isBlocking && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                El usuario será desconectado inmediatamente y no podrá iniciar
                sesión hasta que sea desbloqueado.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Razón del bloqueo (opcional)</Label>
              <Textarea
                id="reason"
                placeholder="Ej: Violación de términos de servicio..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant={isBlocking ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending
              ? "Procesando..."
              : isBlocking
                ? "Bloquear"
                : "Desbloquear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
