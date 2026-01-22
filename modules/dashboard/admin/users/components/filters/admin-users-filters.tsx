"use client";

import { memo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Role } from "@/app/prisma/enums";
import type {
  AdminUsersFilters,
  AdminUserStatus,
} from "../../types/admin-users.types";

interface AdminUsersFiltersProps {
  filters: AdminUsersFilters;
  onFiltersChange: (filters: AdminUsersFilters) => void;
  onReset: () => void;
}

export const AdminUsersFiltersSection = memo(function AdminUsersFiltersSection({
  filters,
  onFiltersChange,
  onReset,
}: AdminUsersFiltersProps) {
  const handleRoleChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        role: value as Role | "all",
      });
    },
    [filters, onFiltersChange]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value as AdminUserStatus,
      });
    },
    [filters, onFiltersChange]
  );

  const hasActiveFilters =
    filters.role !== "all" || filters.status !== "all" || filters.search !== "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los roles</SelectItem>
          <SelectItem value="USER">Usuario</SelectItem>
          <SelectItem value="ADMIN">Administrador</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="blocked">Bloqueados</SelectItem>
          <SelectItem value="unverified">Sin verificar</SelectItem>
          <SelectItem value="deleted">Eliminados</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-10">
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
});
