"use client";

import { memo, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminUser } from "../../types/admin-users.types";

interface DeleteUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onDelete: (userId: string, reason: string) => void;
}

export const DeleteUserDialog = memo(function DeleteUserDialog({
  user,
  open,
  isPending,
  onClose,
  onDelete,
}: DeleteUserDialogProps) {
  const t = useTranslations("DeleteUserDialog");
  const tCommon = useTranslations("Common");
  const [reason, setReason] = useState("");

  const handleConfirm = useCallback(() => {
    if (!user) return;
    onDelete(user.id, reason.trim());
  }, [user, onDelete, reason]);

  const handleClose = useCallback(() => {
    setReason("");
    onClose();
  }, [onClose]);

  if (!user) return null;

  const isReasonValid = reason.trim().length >= 5;
  const userName = user.name || user.email || "";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("confirmMessage", { user: userName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                {t("warning1")}
              </p>
              <ul className="mt-2 list-inside list-disc text-muted-foreground space-y-1">
                <li>{t("warning2")}</li>
                <li>
                  <strong>{t("warning3")}</strong>
                </li>
                <li>{t("warning4")}</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-reason" className="text-sm font-medium">
              {t("reasonLabel")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="delete-reason"
              placeholder={t("reasonPlaceholder")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isPending}
            />
            {reason.length > 0 && !isReasonValid && (
              <p className="text-xs text-destructive">
                {t("reasonError")}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || !isReasonValid}
          >
            {isPending ? tCommon("deleting") : t("deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
