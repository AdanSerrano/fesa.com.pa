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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Admin.users.filters");
  const tUsers = useTranslations("Admin.users");
  const tCommon = useTranslations("Common");

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
        <SelectTrigger className="w-[140px]" aria-label={t("byRole")}>
          <SelectValue placeholder={t("role")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allRoles")}</SelectItem>
          <SelectItem value="USER">{tUsers("user")}</SelectItem>
          <SelectItem value="ADMIN">{tUsers("admin")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[160px]" aria-label={t("byStatus")}>
          <SelectValue placeholder={t("status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          <SelectItem value="active">{t("active")}</SelectItem>
          <SelectItem value="blocked">{t("blocked")}</SelectItem>
          <SelectItem value="unverified">{t("unverified")}</SelectItem>
          <SelectItem value="deleted">{t("deleted")}</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-10">
          <X className="mr-2 h-4 w-4" />
          {tCommon("clearFilters")}
        </Button>
      )}
    </div>
  );
});
