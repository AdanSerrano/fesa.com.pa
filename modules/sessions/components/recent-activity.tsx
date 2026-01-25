"use client";

import { memo, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Clock,
  Globe,
  RefreshCw,
  AlertTriangle,
  Loader2,
  LogIn,
  LogOut,
  XCircle,
  KeyRound,
  Mail,
  ShieldCheck,
  ShieldOff,
  Shield,
  Lock,
  Unlock,
  UserPlus,
  Wand2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRecentActivity } from "../hooks/use-activity";
import { formatRelativeTime } from "@/lib/date-utils";
import { DeviceIcon } from "@/components/device-icon";
import type { ActivityData } from "../types/sessions.types";
import type { PaginationMeta } from "@/types/pagination.types";

export interface RecentActivityProps {
  initialActivities: ActivityData[];
  initialPagination: PaginationMeta | null;
  initialError?: string | null;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  LOGIN_SUCCESS: <LogIn className="h-4 w-4" />,
  LOGIN_FAILED: <XCircle className="h-4 w-4" />,
  LOGOUT: <LogOut className="h-4 w-4" />,
  PASSWORD_RESET_REQUESTED: <KeyRound className="h-4 w-4" />,
  PASSWORD_RESET_COMPLETED: <KeyRound className="h-4 w-4" />,
  EMAIL_VERIFIED: <Mail className="h-4 w-4" />,
  TWO_FACTOR_ENABLED: <ShieldCheck className="h-4 w-4" />,
  TWO_FACTOR_DISABLED: <ShieldOff className="h-4 w-4" />,
  TWO_FACTOR_VERIFIED: <Shield className="h-4 w-4" />,
  ACCOUNT_LOCKED: <Lock className="h-4 w-4" />,
  ACCOUNT_UNLOCKED: <Unlock className="h-4 w-4" />,
  REGISTRATION: <UserPlus className="h-4 w-4" />,
  MAGIC_LINK_REQUESTED: <Wand2 className="h-4 w-4" />,
  MAGIC_LINK_LOGIN: <Wand2 className="h-4 w-4" />,
};

interface ActivityItemLabels {
  actionLabels: Record<string, string>;
  agoMoment: string;
}

const ActivityItem = memo(function ActivityItem({
  activity,
  labels,
}: {
  activity: ActivityData;
  labels: ActivityItemLabels;
}) {
  const isNegative =
    activity.action.includes("FAILED") ||
    activity.action.includes("LOCKED") ||
    activity.action.includes("BLOCKED");

  const isPositive =
    activity.action.includes("SUCCESS") ||
    activity.action.includes("VERIFIED") ||
    activity.action.includes("ENABLED") ||
    activity.action.includes("UNLOCKED") ||
    activity.action === "REGISTRATION" ||
    activity.action === "MAGIC_LINK_LOGIN";

  return (
    <div className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isNegative
            ? "bg-destructive/10 text-destructive"
            : isPositive
            ? "bg-green-500/10 text-green-500"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {ACTION_ICONS[activity.action] || <Activity className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {labels.actionLabels[activity.action] || activity.action}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {activity.deviceType && (
            <span className="flex items-center gap-1">
              <DeviceIcon deviceType={activity.deviceType} className="h-3 w-3" />
              {activity.browser}
            </span>
          )}
          {activity.ipAddress && (
            <>
              {activity.deviceType && <span>•</span>}
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {activity.ipAddress}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Clock className="h-3 w-3" />
        <span>{formatRelativeTime(activity.createdAt, labels.agoMoment)}</span>
      </div>
    </div>
  );
});

export const RecentActivity = memo(function RecentActivity({
  initialActivities,
  initialPagination,
  initialError,
}: RecentActivityProps) {
  const t = useTranslations("Activity");
  const tCommon = useTranslations("Common");

  const {
    activities,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    total,
  } = useRecentActivity({ initialActivities, initialPagination, initialError });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  // useEffect para IntersectionObserver es aceptable (API del navegador)
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  const activityLabels = useMemo((): ActivityItemLabels => ({
    actionLabels: {
      LOGIN_SUCCESS: t("events.login"),
      LOGIN_FAILED: t("events.loginFailed"),
      LOGOUT: t("events.logout"),
      PASSWORD_RESET_REQUESTED: t("events.resetRequested"),
      PASSWORD_RESET_COMPLETED: t("events.passwordChanged"),
      EMAIL_VERIFIED: t("events.emailVerified"),
      TWO_FACTOR_ENABLED: t("events.twoFactorEnabled"),
      TWO_FACTOR_DISABLED: t("events.twoFactorDisabled"),
      TWO_FACTOR_VERIFIED: t("events.twoFactorVerified"),
      ACCOUNT_LOCKED: t("events.accountBlocked"),
      ACCOUNT_UNLOCKED: t("events.accountUnblocked"),
      REGISTRATION: t("events.register"),
      MAGIC_LINK_REQUESTED: t("events.magicLinkRequested"),
      MAGIC_LINK_LOGIN: t("events.magicLinkLogin"),
      USER_BLOCKED: t("events.userBlocked"),
      USER_UNBLOCKED: t("events.userUnblocked"),
      ACCOUNT_DELETION_REQUESTED: t("events.deletionRequested"),
      ACCOUNT_DELETION_CANCELLED: t("events.deletionCanceled"),
    },
    agoMoment: tCommon("agoMoment"),
  }), [t, tCommon]);

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-medium text-destructive">{tCommon("errorLoading")}</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {tCommon("retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("title")}</CardTitle>
              <CardDescription>
                {total > 0
                  ? t("totalEvents", { total })
                  : t("description")}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={isLoadingMore}
            className="shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingMore ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noActivity")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} labels={activityLabels} />
            ))}

            <div ref={loadMoreRef} className="h-1" />

            {isLoadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {hasMore && !isLoadingMore && (
              <Button
                variant="ghost"
                onClick={loadMore}
                className="w-full text-muted-foreground"
              >
                {tCommon("loadMore")}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
