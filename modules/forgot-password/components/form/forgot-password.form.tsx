"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordViewModel } from "../../view-model/forgot-password.view-model";
import { CheckCircle, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

export const ForgotPasswordForm = memo(function ForgotPasswordForm() {
  const { handleSubmit, form, isPending, sent } = ForgotPasswordViewModel();

  if (sent) {
    return <SuccessState />;
  }

  return (
    <Card className="w-full max-w-md border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl font-bold sm:text-2xl">
          ¿Olvidaste tu contraseña?
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Ingresa tu email y te enviaremos un enlace para restablecer tu
          contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      aria-label="Correo electrónico"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  Enviar enlace de recuperación
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

function SuccessState() {
  return (
    <Card className="w-full max-w-md border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center space-y-6 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              ¡Correo enviado!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Si existe una cuenta con ese email, recibirás un enlace para
              restablecer tu contraseña.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 w-full">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div className="text-left text-sm">
                <p className="font-medium">Revisa tu bandeja de entrada</p>
                <p className="text-muted-foreground mt-1">
                  El enlace expirará en 1 hora. Si no lo encuentras, revisa tu
                  carpeta de spam.
                </p>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
