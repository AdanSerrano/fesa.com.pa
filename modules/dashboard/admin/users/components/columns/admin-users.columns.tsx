"use client";

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
  ShieldX,
  Check,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { CustomColumnDef } from "@/components/custom-datatable";
import type { AdminUser, AdminUsersDialogType } from "../../types/admin-users.types";
import { Role } from "@/app/prisma/enums";

interface ColumnActions {
  onOpenDialog: (dialog: AdminUsersDialogType, user: AdminUser) => void;
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

function getUserStatus(user: AdminUser): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (user.deletedAt) {
    return { label: "Eliminado", variant: "destructive" };
  }
  if (user.isBlocked) {
    return { label: "Bloqueado", variant: "destructive" };
  }
  if (!user.emailVerified) {
    return { label: "Sin verificar", variant: "secondary" };
  }
  return { label: "Activo", variant: "default" };
}

export function createAdminUsersColumns(
  actions: ColumnActions
): CustomColumnDef<AdminUser>[] {
  return [
    {
      id: "user",
      accessorKey: "name",
      header: "Usuario",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.image || undefined} alt={row.name || ""} />
            <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.name || "Sin nombre"}</span>
            <span className="text-sm text-muted-foreground">
              {row.email || "Sin email"}
            </span>
            {row.userName && (
              <span className="text-xs text-muted-foreground">
                @{row.userName}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Rol",
      enableSorting: true,
      cell: ({ row }) => {
        const isAdmin = row.role === Role.ADMIN;
        return (
          <Badge
            variant={isAdmin ? "default" : "secondary"}
            className="gap-1"
          >
            {isAdmin ? (
              <ShieldCheck className="h-3 w-3" />
            ) : (
              <Shield className="h-3 w-3" />
            )}
            {isAdmin ? "Admin" : "Usuario"}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Estado",
      enableSorting: false,
      cell: ({ row }) => {
        const status = getUserStatus(row);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      id: "twoFactor",
      accessorKey: "isTwoFactorEnabled",
      header: "2FA",
      enableSorting: true,
      align: "center",
      cell: ({ row }) =>
        row.isTwoFactorEnabled ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Registrado",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.createdAt), "dd MMM yyyy", { locale: es })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const isDeleted = !!row.deletedAt;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => actions.onOpenDialog("details", row)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>

              {!isDeleted && (
                <>
                  <DropdownMenuSeparator />

                  {row.isBlocked ? (
                    <DropdownMenuItem
                      onClick={() => actions.onOpenDialog("unblock", row)}
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Desbloquear
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => actions.onOpenDialog("block", row)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Bloquear
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => actions.onOpenDialog("change-role", row)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Cambiar rol
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => actions.onOpenDialog("delete", row)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
