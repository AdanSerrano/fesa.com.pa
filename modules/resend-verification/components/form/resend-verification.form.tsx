"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResendVerificationViewModel } from "../../view-model/resend-verification.view-model";
import { cn } from "@/lib/utils";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";

export const ResendVerificationForm = () => {
  const { handleSubmit, form, isPending } = ResendVerificationViewModel();

  return (
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
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.email && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Enviar enlace de verificación
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya verificaste tu cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </Form>
  );
};
