"use client";

import { useState, useTransition } from "react";
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
import { Loader2, RefreshCcw, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { reactivateAccountAction } from "@/modules/user/actions/user.actions";

interface ReactivateAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  scheduledDeletionDate?: Date;
  daysRemaining?: number;
  onSuccess: () => void;
}

export function ReactivateAccountDialog({
  isOpen,
  onOpenChange,
  email,
  scheduledDeletionDate,
  daysRemaining,
  onSuccess,
}: ReactivateAccountDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const handleReactivate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await reactivateAccountAction(email);

        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        toast.success(result.success || "¡Cuenta reactivada!");
        onOpenChange(false);
        onSuccess();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error inesperado";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Tu cuenta está pendiente de eliminación
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-center">
              <p>
                Solicitaste eliminar tu cuenta. Si no haces nada, será eliminada
                permanentemente.
              </p>

              {scheduledDeletionDate && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Fecha de eliminación: {formatDate(scheduledDeletionDate)}
                  </div>
                  {daysRemaining !== undefined && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {daysRemaining === 0
                        ? "Se eliminará hoy"
                        : daysRemaining === 1
                        ? "Queda 1 día"
                        : `Quedan ${daysRemaining} días`}
                    </p>
                  )}
                </div>
              )}

              <p className="text-sm">
                ¿Deseas <strong>reactivar tu cuenta</strong> y cancelar la
                eliminación?
              </p>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
          <AlertDialogAction
            onClick={handleReactivate}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reactivando...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Sí, reactivar mi cuenta
              </>
            )}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isPending} className="w-full">
            No, continuar con la eliminación
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
