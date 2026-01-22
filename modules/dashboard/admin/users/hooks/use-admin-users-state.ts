"use client";

import { useSyncExternalStore, useCallback } from "react";
import { adminUsersState } from "../state/admin-users.state";

export function useAdminUsersState() {
  const subscribe = useCallback(
    (callback: () => void) => adminUsersState.subscribe(callback),
    []
  );

  const getSnapshot = useCallback(() => adminUsersState.getSnapshot(), []);

  const getServerSnapshot = useCallback(
    () => adminUsersState.getServerSnapshot(),
    []
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ...state,
    setUsers: adminUsersState.setUsers.bind(adminUsersState),
    setStats: adminUsersState.setStats.bind(adminUsersState),
    setLoading: adminUsersState.setLoading.bind(adminUsersState),
    setPending: adminUsersState.setPending.bind(adminUsersState),
    setInitialized: adminUsersState.setInitialized.bind(adminUsersState),
    setError: adminUsersState.setError.bind(adminUsersState),
    setFilters: adminUsersState.setFilters.bind(adminUsersState),
    setSearch: adminUsersState.setSearch.bind(adminUsersState),
    setRowSelection: adminUsersState.setRowSelection.bind(adminUsersState),
    setSorting: adminUsersState.setSorting.bind(adminUsersState),
    setColumnVisibility:
      adminUsersState.setColumnVisibility.bind(adminUsersState),
    setPagination: adminUsersState.setPagination.bind(adminUsersState),
    setPageIndex: adminUsersState.setPageIndex.bind(adminUsersState),
    setPageSize: adminUsersState.setPageSize.bind(adminUsersState),
    setActiveDialog: adminUsersState.setActiveDialog.bind(adminUsersState),
    setSelectedUser: adminUsersState.setSelectedUser.bind(adminUsersState),
    openDialog: adminUsersState.openDialog.bind(adminUsersState),
    closeDialog: adminUsersState.closeDialog.bind(adminUsersState),
    clearSelection: adminUsersState.clearSelection.bind(adminUsersState),
    resetFilters: adminUsersState.resetFilters.bind(adminUsersState),
    reset: adminUsersState.reset.bind(adminUsersState),
  };
}
