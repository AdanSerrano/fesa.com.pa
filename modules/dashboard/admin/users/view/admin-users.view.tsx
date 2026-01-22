"use client";

import { memo } from "react";
import { CustomDataTable } from "@/components/custom-datatable";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Ban, Trash2 } from "lucide-react";
import { AdminUsersViewModel } from "../view-model/admin-users.view-model";
import { AdminUsersStatsSection } from "../components/stats/admin-users-stats";
import { AdminUsersFiltersSection } from "../components/filters/admin-users-filters";
import {
  UserDetailsDialog,
  BlockUserDialog,
  ChangeRoleDialog,
  DeleteUserDialog,
} from "../components/dialogs";
import type { AdminUser } from "../types/admin-users.types";

const AdminUsersHeader = memo(function AdminUsersHeader() {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground">
          Administra los usuarios de la plataforma, sus roles y permisos.
        </p>
      </div>
    </AnimatedSection>
  );
});

interface BulkActionsProps {
  selectedCount: number;
  isPending: boolean;
  onBulkBlock: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const BulkActions = memo(function BulkActions({
  selectedCount,
  isPending,
  onBulkBlock,
  onBulkDelete,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount} usuario{selectedCount > 1 ? "s" : ""} seleccionado
        {selectedCount > 1 ? "s" : ""}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onBulkBlock}
        disabled={isPending}
      >
        <Ban className="mr-2 h-4 w-4" />
        Bloquear
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        disabled={isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        Limpiar selección
      </Button>
    </div>
  );
});

interface AdminUsersDataTableProps {
  users: AdminUser[];
  columns: ReturnType<typeof AdminUsersViewModel>["columns"];
  isLoading: boolean;
  isPending: boolean;
  selectionConfig: ReturnType<typeof AdminUsersViewModel>["selectionConfig"];
  paginationConfig: ReturnType<typeof AdminUsersViewModel>["paginationConfig"];
  sortingConfig: ReturnType<typeof AdminUsersViewModel>["sortingConfig"];
  filterConfig: ReturnType<typeof AdminUsersViewModel>["filterConfig"];
  columnVisibilityConfig: ReturnType<
    typeof AdminUsersViewModel
  >["columnVisibilityConfig"];
  toolbarConfig: ReturnType<typeof AdminUsersViewModel>["toolbarConfig"];
  styleConfig: ReturnType<typeof AdminUsersViewModel>["styleConfig"];
  exportConfig: ReturnType<typeof AdminUsersViewModel>["exportConfig"];
  copyConfig: ReturnType<typeof AdminUsersViewModel>["copyConfig"];
  printConfig: ReturnType<typeof AdminUsersViewModel>["printConfig"];
  fullscreenConfig: ReturnType<typeof AdminUsersViewModel>["fullscreenConfig"];
}

const AdminUsersDataTable = memo(function AdminUsersDataTable({
  users,
  columns,
  isLoading,
  isPending,
  selectionConfig,
  paginationConfig,
  sortingConfig,
  filterConfig,
  columnVisibilityConfig,
  toolbarConfig,
  styleConfig,
  exportConfig,
  copyConfig,
  printConfig,
  fullscreenConfig,
}: AdminUsersDataTableProps) {
  return (
    <CustomDataTable
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      selection={selectionConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      filter={filterConfig}
      columnVisibility={columnVisibilityConfig}
      toolbarConfig={toolbarConfig}
      style={styleConfig}
      export={exportConfig}
      copy={copyConfig}
      print={printConfig}
      fullscreen={fullscreenConfig}
      isLoading={isLoading}
      isPending={isPending}
      emptyMessage="No se encontraron usuarios"
    />
  );
});

export function AdminUsersView() {
  const {
    users,
    stats,
    columns,
    isLoading,
    isPending,
    filters,
    activeDialog,
    selectedUser,
    selectedCount,
    selectionConfig,
    paginationConfig,
    sortingConfig,
    filterConfig,
    columnVisibilityConfig,
    toolbarConfig,
    styleConfig,
    exportConfig,
    copyConfig,
    printConfig,
    fullscreenConfig,
    handleFiltersChange,
    resetFilters,
    clearSelection,
    handleCloseDialog,
    handleBlockUser,
    handleUnblockUser,
    handleChangeRole,
    handleDeleteUser,
    bulkBlockUsers,
    bulkDeleteUsers,
  } = AdminUsersViewModel();

  return (
    <div className="space-y-6">
      <AdminUsersHeader />

      <AnimatedSection animation="fade-up" delay={100}>
        <AdminUsersStatsSection stats={stats} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AdminUsersFiltersSection
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
            />
            <BulkActions
              selectedCount={selectedCount}
              isPending={isPending}
              onBulkBlock={() => bulkBlockUsers()}
              onBulkDelete={bulkDeleteUsers}
              onClearSelection={clearSelection}
            />
          </div>

          <AdminUsersDataTable
            users={users}
            columns={columns}
            isLoading={isLoading}
            isPending={isPending}
            selectionConfig={selectionConfig}
            paginationConfig={paginationConfig}
            sortingConfig={sortingConfig}
            filterConfig={filterConfig}
            columnVisibilityConfig={columnVisibilityConfig}
            toolbarConfig={toolbarConfig}
            styleConfig={styleConfig}
            exportConfig={exportConfig}
            copyConfig={copyConfig}
            printConfig={printConfig}
            fullscreenConfig={fullscreenConfig}
          />
        </div>
      </AnimatedSection>

      <UserDetailsDialog
        user={selectedUser}
        open={activeDialog === "details"}
        onClose={handleCloseDialog}
      />

      <BlockUserDialog
        user={selectedUser}
        open={activeDialog === "block" || activeDialog === "unblock"}
        isPending={isPending}
        mode={activeDialog === "block" ? "block" : "unblock"}
        onClose={handleCloseDialog}
        onBlock={handleBlockUser}
        onUnblock={handleUnblockUser}
      />

      <ChangeRoleDialog
        user={selectedUser}
        open={activeDialog === "change-role"}
        isPending={isPending}
        onClose={handleCloseDialog}
        onChangeRole={handleChangeRole}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={activeDialog === "delete"}
        isPending={isPending}
        onClose={handleCloseDialog}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
