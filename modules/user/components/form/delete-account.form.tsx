"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { DeleteAccountViewModel } from "../../view-model/user.view-model";

export const DeleteAccountForm = memo(function DeleteAccountForm() {
  const { handleSubmit, form, isPending, error } = DeleteAccountViewModel();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async () => {
    const values = form.getValues();
    await handleSubmit(values);
  };

  const confirmation = form.watch("confirmation");
  const password = form.watch("password");
  const canDelete = confirmation === "ELIMINAR" && password.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-destructive/10 p-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="font-medium text-destructive">Zona de peligro</p>
            <p className="text-sm text-muted-foreground mt-1">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate
              de que realmente deseas hacer esto.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirma tu contraseña</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Escribe <span className="font-mono font-bold text-destructive">ELIMINAR</span> para confirmar
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ELIMINAR"
                    disabled={isPending}
                    className="bg-background font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={isPending || !canDelete}
              onClick={() => setIsDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar mi cuenta permanentemente
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  ¿Eliminar cuenta permanentemente?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Esta acción no se puede deshacer. Se eliminarán:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Tu perfil y datos personales</li>
                    <li>Historial de actividad</li>
                    <li>Acceso a todos los servicios</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onSubmit}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Sí, eliminar mi cuenta"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
});
