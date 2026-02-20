"use client";

import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Ban,
  Unlock,
  UserCog,
  Trash2,
  Shield,
  ShieldCheck,
  BadgeCheck,
  BadgeX,
  RotateCcw,
  Check,
  X,
  Mail,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { CustomColumnDef } from "@/components/custom-datatable";
import type { AdminUser, AdminUsersDialogType } from "../../types/admin-users.types";
import { Role } from "@/app/prisma/enums";
import { useTranslations, useLocale } from "next-intl";

type StatusKey = "deleted" | "blocked" | "unverified" | "active";

interface ColumnTranslations {
  user: string;
  email: string;
  role: string;
  status: string;
  emailVerified: string;
  twoFactor: string;
  createdAt: string;
  updatedAt: string;
}

interface ColumnActions {
  onOpenDialog: (dialog: AdminUsersDialogType, user: AdminUser) => void;
  translations: ColumnTranslations;
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

function getUserStatusKey(user: AdminUser): {
  key: StatusKey;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (user.deletedAt) {
    return { key: "deleted", variant: "destructive" };
  }
  if (user.isBlocked) {
    return { key: "blocked", variant: "destructive" };
  }
  if (!user.emailVerified) {
    return { key: "unverified", variant: "secondary" };
  }
  return { key: "active", variant: "default" };
}


const UserCell = memo(function UserCell({ row }: { row: AdminUser }) {
  const t = useTranslations("Admin.users");
  const isBlocked = row.isBlocked && !row.deletedAt;
  const isDeleted = !!row.deletedAt;

  const avatarClass = useMemo(() => {
    if (isDeleted) return "opacity-50 grayscale";
    if (isBlocked) return "ring-2 ring-destructive ring-offset-2";
    return "";
  }, [isDeleted, isBlocked]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className={`h-10 w-10 ${avatarClass}`}>
          <AvatarImage src={row.image || undefined} alt={row.name || ""} />
          <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
        </Avatar>
        {isBlocked && (
          <div
            className="absolute -bottom-1 -right-1 rounded-full bg-destructive p-1"
            title={t("userBlocked")}
          >
            <Ban className="h-3 w-3 text-destructive-foreground" />
          </div>
        )}
        {isDeleted && (
          <div
            className="absolute -bottom-1 -right-1 rounded-full bg-muted p-1"
            title={t("userDeleted")}
          >
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-medium ${
              isDeleted ? "text-muted-foreground line-through" : ""
            }`}
          >
            {row.name || t("noName")}
          </span>
          {isBlocked && (
            <Badge variant="destructive" className="h-5 gap-1 text-xs">
              <Ban className="h-3 w-3" />
              {t("status.blocked")}
            </Badge>
          )}
        </div>
        {row.userName && (
          <span className="text-xs text-muted-foreground">@{row.userName}</span>
        )}
      </div>
    </div>
  );
});

// Email Cell
const EmailCell = memo(function EmailCell({ email }: { email: string | null }) {
  const t = useTranslations("Admin.users");
  return (
    <div className="flex items-center gap-2">
      <Mail className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{email || t("noEmail")}</span>
    </div>
  );
});

// Role Cell
const RoleCell = memo(function RoleCell({ role }: { role: Role }) {
  const t = useTranslations("Admin.users");
  const isAdmin = role === Role.ADMIN;
  return (
    <Badge variant={isAdmin ? "default" : "secondary"} className="gap-1">
      {isAdmin ? (
        <ShieldCheck className="h-3 w-3" />
      ) : (
        <Shield className="h-3 w-3" />
      )}
      {isAdmin ? t("admin") : t("user")}
    </Badge>
  );
});

// Status Cell
const StatusCell = memo(function StatusCell({ row }: { row: AdminUser }) {
  const t = useTranslations("Admin.users.status");
  const status = getUserStatusKey(row);
  return <Badge variant={status.variant}>{t(status.key)}</Badge>;
});

const EmailVerifiedCell = memo(function EmailVerifiedCell({
  emailVerified,
}: {
  emailVerified: Date | null;
}) {
  if (emailVerified) {
    return (
      <div className="flex items-center justify-center gap-1">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-xs text-muted-foreground">
          {format(new Date(emailVerified), "dd/MM/yy")}
        </span>
      </div>
    );
  }
  return <X className="h-4 w-4 text-muted-foreground mx-auto" />;
});

const TwoFactorCell = memo(function TwoFactorCell({
  enabled,
}: {
  enabled: boolean;
}) {
  const t = useTranslations("Admin.users.twoFactor");
  if (enabled) {
    return (
      <Badge variant="default" className="gap-1">
        <Check className="h-3 w-3" />
        {t("active")}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <X className="h-3 w-3" />
      {t("inactive")}
    </Badge>
  );
});

const CreatedAtCell = memo(function CreatedAtCell({
  createdAt,
}: {
  createdAt: Date;
}) {
  const locale = useLocale();
  const dateLocale = locale === "es" ? es : enUS;
  const date = new Date(createdAt);
  return (
    <div className="flex flex-col">
      <span className="text-sm">
        {format(date, "dd MMM yyyy", { locale: dateLocale })}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatDistanceToNow(date, { addSuffix: true, locale: dateLocale })}
      </span>
    </div>
  );
});

const UpdatedAtCell = memo(function UpdatedAtCell({
  updatedAt,
}: {
  updatedAt: Date;
}) {
  const locale = useLocale();
  const dateLocale = locale === "es" ? es : enUS;
  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(updatedAt), {
          addSuffix: true,
          locale: dateLocale,
        })}
      </span>
    </div>
  );
});

interface ActionsCellProps {
  row: AdminUser;
  onOpenDialog: (dialog: AdminUsersDialogType, user: AdminUser) => void;
}

const ActionsCell = memo(function ActionsCell({
  row,
  onOpenDialog,
}: ActionsCellProps) {
  const t = useTranslations("Admin.users.actions");
  const isDeleted = !!row.deletedAt;
  const isBlocked = row.isBlocked;
  const isVerified = !!row.emailVerified;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpenDialog("details", row)}>
          <Eye className="mr-2 h-4 w-4" />
          {t("viewDetails")}
        </DropdownMenuItem>

        {isDeleted ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onOpenDialog("restore", row)}
              className="text-green-600 focus:text-green-600"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("restoreAccount")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />

            {isBlocked ? (
              <DropdownMenuItem onClick={() => onOpenDialog("unblock", row)}>
                <Unlock className="mr-2 h-4 w-4" />
                {t("unblock")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onOpenDialog("block", row)}>
                <Ban className="mr-2 h-4 w-4" />
                {t("block")}
              </DropdownMenuItem>
            )}

            {isVerified ? (
              <DropdownMenuItem onClick={() => onOpenDialog("unverify", row)}>
                <BadgeX className="mr-2 h-4 w-4" />
                {t("unverify")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onOpenDialog("verify", row)}>
                <BadgeCheck className="mr-2 h-4 w-4" />
                {t("verify")}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onOpenDialog("change-role", row)}>
              <UserCog className="mr-2 h-4 w-4" />
              {t("changeRole")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onOpenDialog("delete", row)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export function createAdminUsersColumns(
  actions: ColumnActions
): CustomColumnDef<AdminUser>[] {
  const { translations: t } = actions;
  return [
    {
      id: "user",
      accessorKey: "name",
      header: t.user,
      enableSorting: true,
      minWidth: 200,
      cell: ({ row }) => <UserCell row={row} />,
    },
    {
      id: "email",
      accessorKey: "email",
      header: t.email,
      enableSorting: true,
      minWidth: 180,
      cell: ({ row }) => <EmailCell email={row.email} />,
    },
    {
      id: "role",
      accessorKey: "role",
      header: t.role,
      enableSorting: true,
      align: "center",
      cell: ({ row }) => <RoleCell role={row.role} />,
    },
    {
      id: "status",
      header: t.status,
      enableSorting: false,
      align: "center",
      cell: ({ row }) => <StatusCell row={row} />,
    },
    {
      id: "emailVerified",
      accessorKey: "emailVerified",
      header: t.emailVerified,
      enableSorting: true,
      align: "center",
      defaultHidden: true,
      cell: ({ row }) => <EmailVerifiedCell emailVerified={row.emailVerified} />,
    },
    {
      id: "twoFactor",
      accessorKey: "isTwoFactorEnabled",
      header: t.twoFactor,
      enableSorting: true,
      align: "center",
      cell: ({ row }) => <TwoFactorCell enabled={row.isTwoFactorEnabled} />,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: t.createdAt,
      enableSorting: true,
      cell: ({ row }) => <CreatedAtCell createdAt={row.createdAt} />,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: t.updatedAt,
      enableSorting: true,
      // defaultHidden: true,
      cell: ({ row }) => <UpdatedAtCell updatedAt={row.updatedAt} />,
    },
    {
      id: "actions",
      header: "",
      pinned: "right",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell row={row} onOpenDialog={actions.onOpenDialog} />
      ),
    },
  ];
}
