"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
  Mail,
  User,
  Calendar,
  Shield,
  ShieldCheck,
  Ban,
  Check,
  X,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { AdminUser } from "../../types/admin-users.types";
import { Role } from "@/app/prisma/enums";

interface UserDetailsDialogProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
}

export const UserDetailsDialog = memo(function UserDetailsDialog({
  user,
  open,
  onClose,
}: UserDetailsDialogProps) {
  const t = useTranslations("UserDetailsDialog");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const dateLocale = locale === "es" ? es : enUS;

  if (!user) return null;

  const isAdmin = user.role === Role.ADMIN;
  const isVerified = !!user.emailVerified;
  const isBlocked = user.isBlocked;
  const isDeleted = !!user.deletedAt;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name || ""} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {user.name || t("noName")}
              </h3>
              {user.userName && (
                <p className="text-sm text-muted-foreground">@{user.userName}</p>
              )}
              <div className="mt-1 flex gap-2">
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {isAdmin ? (
                    <ShieldCheck className="mr-1 h-3 w-3" />
                  ) : (
                    <Shield className="mr-1 h-3 w-3" />
                  )}
                  {isAdmin ? t("admin") : t("user")}
                </Badge>
                {isBlocked && <Badge variant="destructive">{t("blocked")}</Badge>}
                {isDeleted && <Badge variant="destructive">{t("deleted")}</Badge>}
                {!isVerified && !isDeleted && (
                  <Badge variant="secondary">{t("unverified")}</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <DetailRow
              icon={Mail}
              label={t("email")}
              value={user.email || t("noEmail")}
            />
            <DetailRow
              icon={User}
              label={t("username")}
              value={user.userName || t("notDefined")}
            />
            <DetailRow
              icon={Calendar}
              label={t("registrationDate")}
              value={format(new Date(user.createdAt), "PPP", { locale: dateLocale })}
            />
            <DetailRow
              icon={Shield}
              label={t("emailVerification")}
              value={
                isVerified ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-3 w-3" />
                    {t("verifiedOn", {
                      date: format(new Date(user.emailVerified!), "PPP", { locale: dateLocale })
                    })}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <X className="h-3 w-3" />
                    {tCommon("notVerified")}
                  </span>
                )
              }
            />
            <DetailRow
              icon={Shield}
              label={t("twoFactorAuth")}
              value={
                user.isTwoFactorEnabled ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-3 w-3" />
                    {tCommon("enabled")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <X className="h-3 w-3" />
                    {tCommon("disabled")}
                  </span>
                )
              }
            />
          </div>

          {isBlocked && user.blockedReason && (
            <>
              <Separator />
              <div className="rounded-md bg-destructive/10 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <Ban className="h-4 w-4" />
                  {t("blockReason")}
                </div>
                <p className="mt-1 text-sm">{user.blockedReason}</p>
                {user.blockedAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("blockedOn", {
                      date: format(new Date(user.blockedAt), "PPP", { locale: dateLocale })
                    })}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
