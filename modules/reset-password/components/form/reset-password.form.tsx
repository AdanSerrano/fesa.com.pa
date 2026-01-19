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
import { PasswordInput } from "@/components/ui/pasword-input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { cn } from "@/lib/utils";
import { Loader2, KeyRound } from "lucide-react";
import { ResetPasswordViewModel } from "../../view-model/reset-password.view-model";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { handleSubmit, form, isPending, error } = ResetPasswordViewModel(token);
  const password = form.watch("password");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    "pr-10",
                    form.formState.errors.password && "border-destructive"
                  )}
                />
              </FormControl>
              <PasswordStrengthIndicator password={password || ""} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    "pr-10",
                    form.formState.errors.confirmPassword && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <KeyRound className="mr-2 h-4 w-4" />
              Restablecer contraseña
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
