"use client";

import { useCallback, useTransition } from "react";
import { toast } from "sonner";
import { useAdminUsersState } from "./use-admin-users-state";
import {
  getUsersAction,
  blockUserAction,
  unblockUserAction,
  changeRoleAction,
  deleteUserAction,
  bulkBlockUsersAction,
  bulkDeleteUsersAction,
} from "../actions/admin-users.actions";
import type { Role } from "@/app/prisma/enums";
import type {
  AdminUser,
  AdminUsersFilters,
  AdminUsersSorting,
  AdminUsersDialogType,
} from "../types/admin-users.types";

export function useAdminUsers() {
  const state = useAdminUsersState();
  const [isPending, startTransition] = useTransition();

  const fetchUsers = useCallback(() => {
    startTransition(async () => {
      state.setLoading(true);
      state.setError(null);

      const result = await getUsersAction({
        page: state.pagination.pageIndex + 1,
        limit: state.pagination.pageSize,
        sorting: state.sorting,
        filters: state.filters,
      });

      if (result.error) {
        state.setError(result.error);
        toast.error(result.error);
      } else if (result.data) {
        state.setUsers(result.data.users);
        state.setStats(result.data.stats);
        state.setPagination({
          pageIndex: result.data.pagination.page - 1,
          pageSize: result.data.pagination.limit,
          totalRows: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        });
      }

      state.setLoading(false);
      state.setInitialized(true);
    });
  }, [
    state.pagination.pageIndex,
    state.pagination.pageSize,
    state.sorting,
    state.filters,
    state,
  ]);

  const blockUser = useCallback(
    (userId: string, reason?: string) => {
      startTransition(async () => {
        state.setPending(true);

        const result = await blockUserAction(userId, reason);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          state.closeDialog();
          fetchUsers();
        }

        state.setPending(false);
      });
    },
    [fetchUsers, state]
  );

  const unblockUser = useCallback(
    (userId: string) => {
      startTransition(async () => {
        state.setPending(true);

        const result = await unblockUserAction(userId);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          state.closeDialog();
          fetchUsers();
        }

        state.setPending(false);
      });
    },
    [fetchUsers, state]
  );

  const changeRole = useCallback(
    (userId: string, newRole: Role) => {
      startTransition(async () => {
        state.setPending(true);

        const result = await changeRoleAction(userId, newRole);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          state.closeDialog();
          fetchUsers();
        }

        state.setPending(false);
      });
    },
    [fetchUsers, state]
  );

  const deleteUser = useCallback(
    (userId: string) => {
      startTransition(async () => {
        state.setPending(true);

        const result = await deleteUserAction(userId);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          state.closeDialog();
          fetchUsers();
        }

        state.setPending(false);
      });
    },
    [fetchUsers, state]
  );

  const bulkBlockUsers = useCallback(
    (reason?: string) => {
      const selectedIds = Object.keys(state.rowSelection).filter(
        (id) => state.rowSelection[id]
      );

      if (selectedIds.length === 0) {
        toast.error("No hay usuarios seleccionados");
        return;
      }

      startTransition(async () => {
        state.setPending(true);

        const result = await bulkBlockUsersAction(selectedIds, reason);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          state.clearSelection();
          fetchUsers();
        }

        state.setPending(false);
      });
    },
    [state.rowSelection, fetchUsers, state]
  );

  const bulkDeleteUsers = useCallback(() => {
    const selectedIds = Object.keys(state.rowSelection).filter(
      (id) => state.rowSelection[id]
    );

    if (selectedIds.length === 0) {
      toast.error("No hay usuarios seleccionados");
      return;
    }

    startTransition(async () => {
      state.setPending(true);

      const result = await bulkDeleteUsersAction(selectedIds);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        state.clearSelection();
        fetchUsers();
      }

      state.setPending(false);
    });
  }, [state.rowSelection, fetchUsers, state]);

  const handleSearchChange = useCallback(
    (search: string) => {
      state.setSearch(search);
    },
    [state]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminUsersFilters) => {
      state.setFilters(filters);
    },
    [state]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminUsersSorting[]) => {
      state.setSorting(sorting);
    },
    [state]
  );

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      state.setPageIndex(pageIndex);
    },
    [state]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      state.setPageSize(pageSize);
    },
    [state]
  );

  const handleRowSelectionChange = useCallback(
    (selection: Record<string, boolean>) => {
      state.setRowSelection(selection);
    },
    [state]
  );

  const handleOpenDialog = useCallback(
    (dialog: AdminUsersDialogType, user?: AdminUser) => {
      state.openDialog(dialog, user);
    },
    [state]
  );

  const handleCloseDialog = useCallback(() => {
    state.closeDialog();
  }, [state]);

  const getSelectedUsers = useCallback((): AdminUser[] => {
    const selectedIds = Object.keys(state.rowSelection).filter(
      (id) => state.rowSelection[id]
    );
    return state.users.filter((user) => selectedIds.includes(user.id));
  }, [state.rowSelection, state.users]);

  const getSelectedCount = useCallback((): number => {
    return Object.values(state.rowSelection).filter(Boolean).length;
  }, [state.rowSelection]);

  return {
    users: state.users,
    stats: state.stats,
    isLoading: state.isLoading,
    isPending: isPending || state.isPending,
    isInitialized: state.isInitialized,
    error: state.error,

    filters: state.filters,
    rowSelection: state.rowSelection,
    sorting: state.sorting,
    columnVisibility: state.columnVisibility,
    pagination: state.pagination,

    activeDialog: state.activeDialog,
    selectedUser: state.selectedUser,

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

    setColumnVisibility: state.setColumnVisibility,
    clearSelection: state.clearSelection,
    resetFilters: state.resetFilters,

    getSelectedUsers,
    getSelectedCount,
  };
}
