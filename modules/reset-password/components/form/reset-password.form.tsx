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
import { PasswordInput } from "@/components/ui/pasword-input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { cn } from "@/lib/utils";
import { Loader2, KeyRound, CheckCircle } from "lucide-react";
import { ResetPasswordViewModel } from "../../view-model/reset-password.view-model";
import { memo, useDeferredValue } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = memo(function ResetPasswordForm({
  token,
}: ResetPasswordFormProps) {
  const t = useTranslations("ResetPassword");
  const tAuth = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const { handleSubmit, form, isPending, error, success } =
    ResetPasswordViewModel(token);
  const password = form.watch("password");
  const deferredPassword = useDeferredValue(password);

  if (success) {
    return <SuccessState />;
  }

  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl font-bold sm:text-2xl">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newPasswordLabel")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={tAuth("passwordPlaceholder")}
                      autoComplete="new-password"
                      aria-label={tAuth("newPassword")}
                      {...field}
                      disabled={isPending}
                      className={cn(
                        "pr-10",
                        form.formState.errors.password && "border-destructive"
                      )}
                    />
                  </FormControl>
                  <PasswordStrengthIndicator password={deferredPassword || ""} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={tAuth("passwordPlaceholder")}
                      autoComplete="new-password"
                      aria-label={tAuth("confirmPassword")}
                      {...field}
                      disabled={isPending}
                      className={cn(
                        "pr-10",
                        form.formState.errors.confirmPassword &&
                          "border-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  {tCommon("updating")}
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("resetButton")}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

function SuccessState() {
  const t = useTranslations("ResetPassword");

  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle
              className="h-8 w-8 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t("successTitle")}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("successMessage")}
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">{t("goToLogin")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
