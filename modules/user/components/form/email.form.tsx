"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { EmailViewModel } from "../../view-model/user.view-model";

interface EmailFormProps {
  currentEmail?: string | null;
  isVerified?: boolean;
}

export const EmailForm = memo(function EmailForm({
  currentEmail,
  isVerified,
}: EmailFormProps) {
  const { handleSubmit, form, isPending, error } = EmailViewModel();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{currentEmail || "No configurado"}</p>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Este es tu correo electrónico actual
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nuevo correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="nuevo@email.com"
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Te enviaremos un enlace de verificación al nuevo correo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentPassword"
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
                <FormDescription className="text-xs">
                  Por seguridad, ingresa tu contraseña actual
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Cambiar email"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});
