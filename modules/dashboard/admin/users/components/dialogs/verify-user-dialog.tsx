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
import { FormAlert } from "@/components/ui/form-fields";
import { BadgeCheck, BadgeX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminUser } from "../../types/admin-users.types";

interface VerifyUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  mode: "verify" | "unverify";
  onClose: () => void;
  onVerify: (userId: string) => void;
  onUnverify: (userId: string) => void;
}

export const VerifyUserDialog = memo(function VerifyUserDialog({
  user,
  open,
  isPending,
  mode,
  onClose,
  onVerify,
  onUnverify,
}: VerifyUserDialogProps) {
  const t = useTranslations("VerifyUserDialog");
  const tCommon = useTranslations("Common");

  const handleConfirm = useCallback(() => {
    if (!user) return;

    if (mode === "verify") {
      onVerify(user.id);
    } else {
      onUnverify(user.id);
    }
  }, [user, mode, onVerify, onUnverify]);

  if (!user) return null;

  const isVerifying = mode === "verify";
  const userName = user.name || user.email || "";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isVerifying ? (
              <>
                <BadgeCheck className="h-5 w-5 text-green-600" />
                {t("verifyTitle")}
              </>
            ) : (
              <>
                <BadgeX className="h-5 w-5 text-destructive" />
                {t("unverifyTitle")}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isVerifying
              ? t("verifyMessage", { user: userName })
              : t("unverifyMessage", { user: userName })}
          </DialogDescription>
        </DialogHeader>

        {isVerifying && (
          <FormAlert variant="warning" message={t("verifyWarning")} />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button
            variant={isVerifying ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon("processing")}
              </>
            ) : isVerifying ? (
              t("verifyButton")
            ) : (
              t("unverifyButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
