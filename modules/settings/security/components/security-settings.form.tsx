"use client";

import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { SecuritySettingsViewModel } from "../view-model/security-settings.view-model";
import { ActiveSessions } from "@/modules/sessions/components/active-sessions";
import { RecentActivity } from "@/modules/sessions/components/recent-activity";
import type { SecurityInfo } from "../services/security-settings.services";
import type { SessionData, ActivityData } from "@/modules/sessions/types/sessions.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface SecuritySettingsFormProps {
  initialSecurityInfo: SecurityInfo | null;
  initialSecurityError?: string | null;
  initialSessions: SessionData[];
  initialSessionsError?: string | null;
  initialActivities: ActivityData[];
  initialActivityPagination: PaginationMeta | null;
  initialActivityError?: string | null;
}

export const SecuritySettingsForm = memo(function SecuritySettingsForm({
  initialSecurityInfo,
  initialSecurityError,
  initialSessions,
  initialSessionsError,
  initialActivities,
  initialActivityPagination,
  initialActivityError,
}: SecuritySettingsFormProps) {
  const t = useTranslations("SecuritySettings");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  const formatDate = useMemo(() => {
    return (date: Date): string => {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(date));
    };
  }, [locale]);

  const {
    securityInfo,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  } = SecuritySettingsViewModel({
    initialSecurityInfo,
    initialError: initialSecurityError,
  });

  if (error) {
    return (
      <AnimatedSection animation="fade-up">
        <Card className="border-destructive/30 bg-destructive/5 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 gap-4">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
            </div>
            <div className="text-center px-4">
              <p className="font-medium text-destructive text-sm sm:text-base">{tCommon("errorLoading")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button variant="outline" onClick={refreshSecurityInfo} size="sm" className="sm:size-default">
              <RefreshCw className="mr-2 h-4 w-4" />
              {tCommon("retry")}
            </Button>
          </CardContent>
        </Card>
      </AnimatedSection>
    );
  }

  if (!securityInfo) {
    return null;
  }

  const isTwoFactorEnabled = securityInfo.isTwoFactorEnabled;
  const maskedEmail = securityInfo.email?.replace(/(.{2})(.*)(@.*)/, "$1***$3") ?? "";

  return (
    <div className="space-y-4 sm:space-y-6">
      <AnimatedSection animation="fade-up" delay={0}>
        <Card className="overflow-hidden border-border/50 shadow-lg">
          <div className={`h-1 sm:h-1.5 ${isTwoFactorEnabled ? "bg-green-500" : "bg-muted"}`} />
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shrink-0 ${isTwoFactorEnabled ? "bg-green-500/10" : "bg-primary/10"}`}>
                <Shield className={`h-4 w-4 sm:h-5 sm:w-5 ${isTwoFactorEnabled ? "text-green-500" : "text-primary"}`} />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">{t("title")}</CardTitle>
                <CardDescription className="text-xs sm:text-sm truncate">
                  {t("description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="flex flex-col gap-4 rounded-xl bg-muted/30 p-3 sm:p-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full ${isTwoFactorEnabled ? "bg-green-500/10" : "bg-muted"}`}>
                  {isTwoFactorEnabled ? (
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  ) : (
                    <ShieldOff className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-sm sm:text-base">{t("emailVerification")}</p>
                    {isTwoFactorEnabled ? (
                      <Badge className="bg-green-500 hover:bg-green-500/90 text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {tCommon("active")}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">{tCommon("inactive")}</Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {isTwoFactorEnabled
                      ? t("codeSentTo", { email: maskedEmail })
                      : t("receiveCode")}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                {isTwoFactorEnabled ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={isPending} size="sm" className="w-full sm:w-auto">
                        {isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldOff className="mr-2 h-4 w-4" />
                        )}
                        {t("deactivate")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4 sm:mx-0 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg">{t("deactivateConfirm")}</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          {t("deactivateWarning")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">{tCommon("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDisableTwoFactor}
                          className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90"
                        >
                          {t("deactivate")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button onClick={handleEnableTwoFactor} disabled={isPending} size="sm" className="w-full sm:w-auto">
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    {t("activate2FA")}
                  </Button>
                )}
              </div>
            </div>

            {securityInfo.lockedUntil && (
              <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 px-3 sm:px-4 py-2.5 sm:py-3">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-destructive">{t("accountLocked")}</p>
                  <p className="text-xs text-destructive/80">
                    {t("lockedUntil", { date: formatDate(securityInfo.lockedUntil) })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={100}>
        <ActiveSessions
          initialSessions={initialSessions}
          initialError={initialSessionsError}
        />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <RecentActivity
          initialActivities={initialActivities}
          initialPagination={initialActivityPagination}
          initialError={initialActivityError}
        />
      </AnimatedSection>
    </div>
  );
});
