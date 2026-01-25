"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { RegisterViewModel } from "@/modules/register/view-model/register.view-model";
import { cn } from "@/lib/utils";
import { Loader2, UserPlus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PasswordInput } from "@/components/ui/pasword-input";
import { memo, useDeferredValue } from "react";
import { useTranslations } from "next-intl";

export const RegisterForm = memo(function RegisterForm() {
  const t = useTranslations("Auth");
  const { handleRegister, isPending, error, form } = RegisterViewModel();
  const password = form.watch("password");
  const deferredPassword = useDeferredValue(password);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")} *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  aria-label={t("email")}
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.email && "border-destructive"
                  )}
                />
              </FormControl>
              <FormDescription>
                {t("emailHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("usernamePlaceholder")}
                  autoComplete="username"
                  aria-label={t("username")}
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.userName && "border-destructive"
                  )}
                />
              </FormControl>
              <FormDescription>
                {t("usernameHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName")}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  autoComplete="name"
                  aria-label={t("fullName")}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                {t("nameHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")} *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="new-password"
                  aria-label={t("password")}
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
              <FormLabel>{t("confirmPassword")} *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="new-password"
                  aria-label={t("confirmPassword")}
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              {t("registering")}
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              {t("createAccount")}
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("login")}
          </Link>
        </p>
      </form>
    </Form>
  );
});
