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
import { ResendVerificationViewModel } from "../../view-model/resend-verification.view-model";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { memo } from "react";
import { useTranslations } from "next-intl";

export const ResendVerificationForm = memo(function ResendVerificationForm() {
  const t = useTranslations("ResendVerification");
  const tAuth = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const { handleSubmit, form, isPending, sent } = ResendVerificationViewModel();

  if (sent) {
    return <SuccessState />;
  }

  return (
    <Card className="w-full max-w-md border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tAuth("email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={tAuth("emailPlaceholder")}
                      autoComplete="email"
                      aria-label={tAuth("email")}
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

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {tCommon("sending")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("sendLink")}
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("alreadyVerified")}{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {tAuth("login")}
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

function SuccessState() {
  const t = useTranslations("ResendVerification");
  const tForgot = useTranslations("ForgotPassword");

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
              {t("successTitle")}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("successMessage")}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 w-full">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div className="text-left text-sm">
                <p className="font-medium">{t("checkInbox")}</p>
                <p className="text-muted-foreground mt-1">
                  {t("linkExpiry")}
                </p>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/login">{tForgot("backToLogin")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
