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
import { useTranslations } from "next-intl";

interface EmailFormProps {
  currentEmail?: string | null;
  isVerified?: boolean;
}

export const EmailForm = memo(function EmailForm({
  currentEmail,
  isVerified,
}: EmailFormProps) {
  const t = useTranslations("EmailSettings");
  const tCommon = useTranslations("Common");
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
                <p className="font-medium">{currentEmail || tCommon("notConfigured")}</p>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                    <ShieldCheck className="h-3 w-3" />
                    {tCommon("verified")}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("currentEmail")}
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
                <FormLabel>{t("newEmail")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("newEmailPlaceholder")}
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {t("newEmailHint")}
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
                <FormLabel>{t("confirmPassword")}</FormLabel>
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
                  {t("confirmPasswordHint")}
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
                {tCommon("updating")}
              </>
            ) : (
              t("changeEmail")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});
