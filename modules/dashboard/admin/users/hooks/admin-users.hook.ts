"use client";

import { useCallback, useTransition, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAdminUsersState } from "./use-admin-users-state";
import { adminUsersState } from "../state/admin-users.state";
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
  AdminUserStatus,
} from "../types/admin-users.types";

const PREFIX = "users";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_ROLE = "all";
const DEFAULT_STATUS = "all";

export function useAdminUsers() {
  const state = useAdminUsersState();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    const pageParam = getParam("page");
    const pageSizeParam = getParam("pageSize");
    const sortParam = getParam("sort");
    const sortDirParam = getParam("sortDir");
    const searchParam = getParam("search");
    const roleParam = getParam("role");
    const statusParam = getParam("status");

    return {
      page: pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE,
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : DEFAULT_PAGE_SIZE,
      sort: sortParam || DEFAULT_SORT,
      sortDir: (sortDirParam || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: searchParam || "",
      role: (roleParam || DEFAULT_ROLE) as Role | "all",
      status: (statusParam || DEFAULT_STATUS) as AdminUserStatus,
    };
  }, [searchParams]);

  const updateUrl = useCallback(
    (updates: Partial<typeof urlState>) => {
      const params = new URLSearchParams(searchParams.toString());

      const newState = { ...urlState, ...updates };

      if (newState.page === DEFAULT_PAGE) {
        params.delete(`${PREFIX}_page`);
      } else {
        params.set(`${PREFIX}_page`, String(newState.page));
      }

      if (newState.pageSize === DEFAULT_PAGE_SIZE) {
        params.delete(`${PREFIX}_pageSize`);
      } else {
        params.set(`${PREFIX}_pageSize`, String(newState.pageSize));
      }

      if (newState.sort === DEFAULT_SORT && newState.sortDir === DEFAULT_SORT_DIR) {
        params.delete(`${PREFIX}_sort`);
        params.delete(`${PREFIX}_sortDir`);
      } else {
        params.set(`${PREFIX}_sort`, newState.sort);
        params.set(`${PREFIX}_sortDir`, newState.sortDir);
      }

      if (!newState.search) {
        params.delete(`${PREFIX}_search`);
      } else {
        params.set(`${PREFIX}_search`, newState.search);
      }

      if (newState.role === DEFAULT_ROLE) {
        params.delete(`${PREFIX}_role`);
      } else {
        params.set(`${PREFIX}_role`, newState.role);
      }

      if (newState.status === DEFAULT_STATUS) {
        params.delete(`${PREFIX}_status`);
      } else {
        params.set(`${PREFIX}_status`, newState.status);
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url, { scroll: false });
    },
    [searchParams, pathname, router, urlState]
  );

  const fetchUsers = useCallback(() => {
    const currentParams = {
      page: urlState.page,
      pageSize: urlState.pageSize,
      sort: urlState.sort,
      sortDir: urlState.sortDir,
      search: urlState.search,
      role: urlState.role,
      status: urlState.status,
    };

    // Usar el state global para controlar duplicados (persiste entre remontados de Strict Mode)
    if (!adminUsersState.canFetch(currentParams)) {
      return;
    }

    // Marcar como fetching SÍNCRONAMENTE antes de cualquier operación async
    adminUsersState.startFetching(currentParams);

    startTransition(async () => {
      adminUsersState.setLoading(true);
      adminUsersState.setError(null);

      try {
        const sorting: AdminUsersSorting[] = currentParams.sort
          ? [{ id: currentParams.sort, desc: currentParams.sortDir === "desc" }]
          : [];

        const filters: AdminUsersFilters = {
          search: currentParams.search,
          role: currentParams.role,
          status: currentParams.status,
        };

        const result = await getUsersAction({
          page: currentParams.page,
          limit: currentParams.pageSize,
          sorting,
          filters,
        });

        if (result.error) {
          adminUsersState.setError(result.error);
          toast.error(result.error);
        } else if (result.data) {
          adminUsersState.setUsers(result.data.users);
          adminUsersState.setStats(result.data.stats);
          adminUsersState.setPagination({
            pageIndex: result.data.pagination.page - 1,
            pageSize: result.data.pagination.limit,
            totalRows: result.data.pagination.total,
            totalPages: result.data.pagination.totalPages,
          });
          adminUsersState.setFilters(filters);
        }
      } finally {
        adminUsersState.finishFetching();
        adminUsersState.setLoading(false);
        adminUsersState.setInitialized(true);
      }
    });
  }, [urlState]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const forceRefresh = useCallback(() => {
    adminUsersState.resetFetchFlags();
    fetchUsers();
  }, [fetchUsers]);

  const blockUser = useCallback(
    (userId: string, reason?: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);

        const result = await blockUserAction(userId, reason);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          forceRefresh();
        }

        adminUsersState.setPending(false);
      });
    },
    [forceRefresh]
  );

  const unblockUser = useCallback(
    (userId: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);

        const result = await unblockUserAction(userId);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          forceRefresh();
        }

        adminUsersState.setPending(false);
      });
    },
    [forceRefresh]
  );

  const changeRole = useCallback(
    (userId: string, newRole: Role) => {
      startTransition(async () => {
        adminUsersState.setPending(true);

        const result = await changeRoleAction(userId, newRole);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          forceRefresh();
        }

        adminUsersState.setPending(false);
      });
    },
    [forceRefresh]
  );

  const deleteUser = useCallback(
    (userId: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);

        const result = await deleteUserAction(userId);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          forceRefresh();
        }

        adminUsersState.setPending(false);
      });
    },
    [forceRefresh]
  );

  const bulkBlockUsers = useCallback(
    (reason?: string) => {
      const currentState = adminUsersState.getState();
      const selectedIds = Object.keys(currentState.rowSelection).filter(
        (id) => currentState.rowSelection[id]
      );

      if (selectedIds.length === 0) {
        toast.error("No hay usuarios seleccionados");
        return;
      }

      startTransition(async () => {
        adminUsersState.setPending(true);

        const result = await bulkBlockUsersAction(selectedIds, reason);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.clearSelection();
          forceRefresh();
        }

        adminUsersState.setPending(false);
      });
    },
    [forceRefresh]
  );

  const bulkDeleteUsers = useCallback(() => {
    const currentState = adminUsersState.getState();
    const selectedIds = Object.keys(currentState.rowSelection).filter(
      (id) => currentState.rowSelection[id]
    );

    if (selectedIds.length === 0) {
      toast.error("No hay usuarios seleccionados");
      return;
    }

    startTransition(async () => {
      adminUsersState.setPending(true);

      const result = await bulkDeleteUsersAction(selectedIds);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        adminUsersState.clearSelection();
        forceRefresh();
      }

      adminUsersState.setPending(false);
    });
  }, [forceRefresh]);

  const handleSearchChange = useCallback(
    (search: string) => {
      updateUrl({ search: search || "", page: DEFAULT_PAGE });
    },
    [updateUrl]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminUsersFilters) => {
      updateUrl({
        role: filters.role,
        status: filters.status,
        page: DEFAULT_PAGE,
      });
    },
    [updateUrl]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminUsersSorting[]) => {
      if (sorting.length === 0) {
        updateUrl({ sort: DEFAULT_SORT, sortDir: DEFAULT_SORT_DIR });
      } else {
        const { id, desc } = sorting[0];
        updateUrl({ sort: id, sortDir: desc ? "desc" : "asc" });
      }
    },
    [updateUrl]
  );

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      updateUrl({ page: pageIndex + 1 });
    },
    [updateUrl]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      updateUrl({ pageSize, page: DEFAULT_PAGE });
    },
    [updateUrl]
  );

  const handleRowSelectionChange = useCallback((selection: Record<string, boolean>) => {
    adminUsersState.setRowSelection(selection);
  }, []);

  const handleOpenDialog = useCallback((dialog: AdminUsersDialogType, user?: AdminUser) => {
    adminUsersState.openDialog(dialog, user);
  }, []);

  const handleCloseDialog = useCallback(() => {
    adminUsersState.closeDialog();
  }, []);

  const setColumnVisibility = useCallback((visibility: Record<string, boolean>) => {
    adminUsersState.setColumnVisibility(visibility);
  }, []);

  const clearSelection = useCallback(() => {
    adminUsersState.clearSelection();
  }, []);

  const getSelectedUsers = useCallback((): AdminUser[] => {
    const currentState = adminUsersState.getState();
    const selectedIds = Object.keys(currentState.rowSelection).filter(
      (id) => currentState.rowSelection[id]
    );
    return currentState.users.filter((user) => selectedIds.includes(user.id));
  }, []);

  const getSelectedCount = useCallback((): number => {
    return Object.values(state.rowSelection).filter(Boolean).length;
  }, [state.rowSelection]);

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const keysToDelete: string[] = [];
    params.forEach((_, key) => {
      if (key.startsWith(`${PREFIX}_`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => params.delete(key));

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  }, [searchParams, pathname, router]);

  const pagination = {
    pageIndex: urlState.page - 1,
    pageSize: urlState.pageSize,
    totalRows: state.pagination.totalRows,
    totalPages: state.pagination.totalPages,
  };

  const sorting: AdminUsersSorting[] = urlState.sort
    ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }]
    : [];

  const filters: AdminUsersFilters = {
    search: urlState.search,
    role: urlState.role,
    status: urlState.status,
  };

  return {
    users: state.users,
    stats: state.stats,
    isLoading: state.isLoading,
    isPending: isPending || state.isPending,
    isInitialized: state.isInitialized,
    error: state.error,

    filters,
    rowSelection: state.rowSelection,
    sorting,
    columnVisibility: state.columnVisibility,
    pagination,

    activeDialog: state.activeDialog,
    selectedUser: state.selectedUser,

    fetchUsers: forceRefresh,
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

    getSelectedUsers,
    getSelectedCount,
  };
}
