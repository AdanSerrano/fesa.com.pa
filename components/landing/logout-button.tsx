"use client";

import { memo, useCallback, useReducer } from "react";
import { Button } from "@/components/ui/button";
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
import { LogOut } from "lucide-react";
import { logoutAction } from "@/modules/logout/actions/logout.actions";
import { useTranslations } from "next-intl";

interface LogoutButtonProps {
  variant?: "dropdown" | "popover" | "button";
}

function LogoutButtonComponent({ variant = "popover" }: LogoutButtonProps) {
  const t = useTranslations("Auth");
  const tNav = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const [showConfirmDialog, toggleDialog] = useReducer((s) => !s, false);

  const handleLogout = useCallback(() => {
    logoutAction();
  }, []);

  const handleOpenDialog = useCallback((e?: Event) => {
    e?.preventDefault();
    toggleDialog();
  }, []);

  return (
    <>
      {variant === "popover" ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none transition-colors hover:bg-accent"
          onClick={() => toggleDialog()}
        >
          <LogOut className="h-4 w-4 text-destructive" />
          {tNav("logout")}
        </button>
      ) : (
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={() => toggleDialog()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {tNav("logout")}
        </Button>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={toggleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("logoutConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("logoutDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("yesLogout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const LogoutButton = memo(LogoutButtonComponent);
LogoutButton.displayName = "LogoutButton";
