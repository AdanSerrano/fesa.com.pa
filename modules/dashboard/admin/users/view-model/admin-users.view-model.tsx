"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import { useAdminUsers } from "../hooks/admin-users.hook";
import { createAdminUsersColumns } from "../components/columns/admin-users.columns";
import type { Role } from "@/app/prisma/enums";
import type {
  AdminUser,
  AdminUsersDialogType,
} from "../types/admin-users.types";
import type {
  SelectionConfig,
  PaginationConfig,
  SortingConfig,
  FilterConfig,
  ColumnVisibilityConfig,
  ToolbarConfig,
  StyleConfig,
  ExportConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
} from "@/components/custom-datatable";

export function AdminUsersViewModel() {
  const {
    users,
    stats,
    isLoading,
    isPending,
    isInitialized,
    error,
    filters,
    rowSelection,
    sorting,
    columnVisibility,
    pagination,
    activeDialog,
    selectedUser,
    fetchUsers,
    blockUser,
    unblockUser,
    changeRole,
    deleteUser,
    bulkBlockUsers,
    bulkDeleteUsers,
    handleSearchChange,
    handleFiltersChange,
    handleSortingChange,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelectionChange,
    handleOpenDialog,
    handleCloseDialog,
    setColumnVisibility,
    clearSelection,
    resetFilters,
    getSelectedCount,
  } = useAdminUsers();

  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchUsers();
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (isInitialized) {
      fetchUsers();
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, filters, isInitialized]);

  const actionsRef = useRef({
    onOpenDialog: (dialog: AdminUsersDialogType, user: AdminUser) => {
      handleOpenDialog(dialog, user);
    },
  });

  useEffect(() => {
    actionsRef.current.onOpenDialog = handleOpenDialog;
  }, [handleOpenDialog]);

  const columns = useMemo(
    () => createAdminUsersColumns(actionsRef.current),
    []
  );

  const handleBlockUser = useCallback(
    (userId: string, reason?: string) => {
      blockUser(userId, reason);
    },
    [blockUser]
  );

  const handleUnblockUser = useCallback(
    (userId: string) => {
      unblockUser(userId);
    },
    [unblockUser]
  );

  const handleChangeRole = useCallback(
    (userId: string, newRole: Role) => {
      changeRole(userId, newRole);
    },
    [changeRole]
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      deleteUser(userId);
    },
    [deleteUser]
  );

  const selectionConfig: SelectionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple",
      showCheckbox: true,
      selectedRows: rowSelection,
      onSelectionChange: handleRowSelectionChange,
    }),
    [rowSelection, handleRowSelectionChange]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: [10, 20, 50, 100],
      onPaginationChange: (newPagination) => {
        if (newPagination.pageIndex !== pagination.pageIndex) {
          handlePageChange(newPagination.pageIndex);
        }
        if (newPagination.pageSize !== pagination.pageSize) {
          handlePageSizeChange(newPagination.pageSize);
        }
      },
      showRowsInfo: true,
      showSelectedInfo: true,
    }),
    [pagination, handlePageChange, handlePageSizeChange]
  );

  const sortingConfig: SortingConfig = useMemo(
    () => ({
      sorting,
      onSortingChange: handleSortingChange,
      manualSorting: true,
    }),
    [sorting, handleSortingChange]
  );

  const filterConfig: FilterConfig = useMemo(
    () => ({
      globalFilter: filters.search,
      onGlobalFilterChange: handleSearchChange,
      placeholder: "Buscar por nombre, email o usuario...",
      debounceMs: 300,
      showClearButton: true,
    }),
    [filters.search, handleSearchChange]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility,
      onColumnVisibilityChange: setColumnVisibility,
      alwaysVisibleColumns: ["user", "actions"],
    }),
    [columnVisibility, setColumnVisibility]
  );

  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
      show: true,
      showSearch: true,
      showColumnVisibility: true,
      showDensityToggle: true,
      showRefresh: true,
      showFullscreen: true,
      showCopy: true,
      showPrint: true,
      showExport: true,
      onRefresh: fetchUsers,
    }),
    [fetchUsers]
  );

  const styleConfig: StyleConfig = useMemo(
    () => ({
      striped: true,
      hover: true,
      stickyHeader: true,
      density: "default",
      borderStyle: "horizontal",
      rounded: true,
    }),
    []
  );

  const exportConfig: ExportConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      formats: ["csv", "json"],
      filename: "usuarios",
      includeHeaders: true,
    }),
    []
  );

  const copyConfig: CopyConfig = useMemo(
    () => ({
      enabled: true,
      format: "csv",
      includeHeaders: true,
    }),
    []
  );

  const printConfig: PrintConfig = useMemo(
    () => ({
      enabled: true,
      title: "Listado de Usuarios",
      pageSize: "A4",
      orientation: "landscape",
    }),
    []
  );

  const fullscreenConfig: FullscreenConfig = useMemo(
    () => ({
      enabled: true,
    }),
    []
  );

  return {
    users,
    stats,
    columns,
    isLoading,
    isPending,
    error,

    filters,
    activeDialog,
    selectedUser,
    selectedCount: getSelectedCount(),

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
  };
}
