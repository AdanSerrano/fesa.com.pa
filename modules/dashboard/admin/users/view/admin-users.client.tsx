"use client";

import { memo, useCallback, useMemo, useReducer, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, Ban, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import {
  blockUserAction,
  unblockUserAction,
  changeRoleAction,
  deleteUserAction,
  restoreUserAction,
  bulkBlockUsersAction,
  bulkDeleteUsersAction,
} from "../actions/admin-users.actions";
import { createAdminUsersColumns } from "../components/columns/admin-users.columns";
import { AdminUsersStatsSection } from "../components/stats/admin-users-stats";
import { AdminUsersFiltersSection } from "../components/filters/admin-users-filters";
import {
  UserDetailsDialog,
  BlockUserDialog,
  ChangeRoleDialog,
  DeleteUserDialog,
  RestoreUserDialog,
} from "../components/dialogs";

import type { Role } from "@/app/prisma/enums";
import type {
  AdminUser,
  AdminUsersFilters,
  AdminUsersStats,
  AdminUsersPagination,
  AdminUsersSorting,
  AdminUsersDialogType,
  AdminUserStatus,
} from "../types/admin-users.types";
import type {
  StyleConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
  ExportConfig,
  ToolbarConfig,
  ColumnVisibilityConfig,
  FilterConfig,
  SortingConfig,
  PaginationConfig,
  SelectionConfig,
  ExpansionConfig,
} from "@/components/custom-datatable";
import { UserExpandedContent } from "../components/expanded";

// Constantes de configuración
const STYLE_CONFIG: StyleConfig = {
  striped: true,
  hover: true,
  stickyHeader: true,
  density: "default",
  borderStyle: "horizontal",
  rounded: true,
};

const COPY_CONFIG: CopyConfig = {
  enabled: true,
  format: "csv",
  includeHeaders: true,
};

// PRINT_CONFIG se crea dinámicamente dentro del componente para usar traducciones

const FULLSCREEN_CONFIG: FullscreenConfig = {
  enabled: true,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const PREFIX = "users";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_ROLE = "all";
const DEFAULT_STATUS = "all";

interface InitialData {
  users: AdminUser[];
  stats: AdminUsersStats | null;
  pagination: AdminUsersPagination;
  sorting: AdminUsersSorting[];
  filters: AdminUsersFilters;
  error: string | null;
}

interface AdminUsersClientProps {
  initialData: InitialData;
}

const AdminUsersHeader = memo(function AdminUsersHeader() {
  const t = useTranslations("Admin.users");
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>
    </AnimatedSection>
  );
});

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
  isNavigating: boolean;
}

const ErrorAlert = memo(function ErrorAlert({ error, onRetry, isNavigating }: ErrorAlertProps) {
  const t = useTranslations("Common");
  return (
    <Alert variant="destructive" role="alert" aria-live="assertive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t("errorLoading")}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isNavigating}
          className="ml-4"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isNavigating ? "animate-spin" : ""}`} />
          {t("retry")}
        </Button>
      </AlertDescription>
    </Alert>
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
  const t = useTranslations("Admin.users");
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount > 1
          ? t("bulk.selectedUsersPlural", { count: selectedCount })
          : t("bulk.selectedUsers", { count: selectedCount })}
      </span>
      <Button variant="outline" size="sm" onClick={onBulkBlock} disabled={isPending}>
        <Ban className="mr-2 h-4 w-4" />
        {t("actions.block")}
      </Button>
      <Button variant="destructive" size="sm" onClick={onBulkDelete} disabled={isPending}>
        <Trash2 className="mr-2 h-4 w-4" />
        {t("actions.delete")}
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        {t("bulk.clearSelection")}
      </Button>
    </div>
  );
});

interface UsersDialogState {
  activeDialog: AdminUsersDialogType;
  selectedUser: AdminUser | null;
}

type UsersDialogAction =
  | { type: "OPEN"; dialog: AdminUsersDialogType; user?: AdminUser | null }
  | { type: "CLOSE" };

function usersDialogReducer(state: UsersDialogState, action: UsersDialogAction): UsersDialogState {
  switch (action.type) {
    case "OPEN":
      return { activeDialog: action.dialog, selectedUser: action.user ?? null };
    case "CLOSE":
      return { activeDialog: null, selectedUser: null };
  }
}

interface UsersTableUIState {
  rowSelection: Record<string, boolean>;
  expandedRows: Record<string, boolean>;
  columnVisibility: Record<string, boolean>;
}

type UsersTableUIAction =
  | { type: "SET_ROW_SELECTION"; selection: Record<string, boolean> }
  | { type: "SET_EXPANDED_ROWS"; rows: Record<string, boolean> }
  | { type: "SET_COLUMN_VISIBILITY"; visibility: Record<string, boolean> }
  | { type: "CLEAR_SELECTION" };

function usersTableUIReducer(state: UsersTableUIState, action: UsersTableUIAction): UsersTableUIState {
  switch (action.type) {
    case "SET_ROW_SELECTION":
      return { ...state, rowSelection: action.selection };
    case "SET_EXPANDED_ROWS":
      return { ...state, expandedRows: action.rows };
    case "SET_COLUMN_VISIBILITY":
      return { ...state, columnVisibility: action.visibility };
    case "CLEAR_SELECTION":
      return { ...state, rowSelection: {} };
  }
}

export const AdminUsersClient = memo(function AdminUsersClient({ initialData }: AdminUsersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Admin.users");
  const tCommon = useTranslations("Common");

  const [tableUI, dispatchTableUI] = useReducer(usersTableUIReducer, {
    rowSelection: {},
    expandedRows: {},
    columnVisibility: {},
  });
  const [dialogState, dispatchDialog] = useReducer(usersDialogReducer, {
    activeDialog: null,
    selectedUser: null,
  });
  const [isPending, startActionTransition] = useTransition();
  const [isNavigating, startNavigationTransition] = useTransition();

  const { users, stats, pagination, error } = initialData;

  // Leer estado de URL para sincronizar UI
  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : DEFAULT_PAGE,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : DEFAULT_PAGE_SIZE,
      sort: getParam("sort") || DEFAULT_SORT,
      sortDir: (getParam("sortDir") || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: getParam("search") || "",
      role: (getParam("role") || DEFAULT_ROLE) as Role | "all",
      status: (getParam("status") || DEFAULT_STATUS) as AdminUserStatus,
    };
  }, [searchParams]);

  // Navegar con router.replace - dispara re-fetch en Server Component con _rsc
  const navigate = useCallback(
    (updates: Partial<typeof urlState>) => {
      const params = new URLSearchParams(searchParams.toString());
      const newState = { ...urlState, ...updates };

      if (newState.page === DEFAULT_PAGE) params.delete(`${PREFIX}_page`);
      else params.set(`${PREFIX}_page`, String(newState.page));

      if (newState.pageSize === DEFAULT_PAGE_SIZE) params.delete(`${PREFIX}_pageSize`);
      else params.set(`${PREFIX}_pageSize`, String(newState.pageSize));

      if (newState.sort === DEFAULT_SORT && newState.sortDir === DEFAULT_SORT_DIR) {
        params.delete(`${PREFIX}_sort`);
        params.delete(`${PREFIX}_sortDir`);
      } else {
        params.set(`${PREFIX}_sort`, newState.sort);
        params.set(`${PREFIX}_sortDir`, newState.sortDir);
      }

      if (!newState.search) params.delete(`${PREFIX}_search`);
      else params.set(`${PREFIX}_search`, newState.search);

      if (newState.role === DEFAULT_ROLE) params.delete(`${PREFIX}_role`);
      else params.set(`${PREFIX}_role`, newState.role);

      if (newState.status === DEFAULT_STATUS) params.delete(`${PREFIX}_status`);
      else params.set(`${PREFIX}_status`, newState.status);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startNavigationTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router, urlState]
  );

  // Handlers de navegación (disparan Server Component re-fetch)
  const handlePaginationChange = useCallback(
    (paginationUpdate: { pageIndex: number; pageSize: number }) => {
      dispatchTableUI({ type: "CLEAR_SELECTION" });
      navigate({
        page: paginationUpdate.pageIndex + 1,
        pageSize: paginationUpdate.pageSize,
      });
    },
    [navigate]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminUsersSorting[]) => {
      navigate({
        sort: sorting.length > 0 ? sorting[0].id : DEFAULT_SORT,
        sortDir: sorting.length > 0 && sorting[0].desc ? "desc" : "asc",
        page: 1,
      });
    },
    [navigate]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      navigate({ search, page: 1 });
    },
    [navigate]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminUsersFilters) => {
      navigate({
        role: filters.role,
        status: filters.status,
        page: 1,
      });
    },
    [navigate]
  );

  const resetFilters = useCallback(() => {
    navigate({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_SORT,
      sortDir: DEFAULT_SORT_DIR as "asc" | "desc",
      search: "",
      role: DEFAULT_ROLE as Role | "all",
      status: DEFAULT_STATUS as AdminUserStatus,
    });
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    router.refresh();
    toast.success(t("table.dataUpdated"));
  }, [router, t]);

  const openDialog = useCallback((type: AdminUsersDialogType, user: AdminUser | null = null) => {
    dispatchDialog({ type: "OPEN", dialog: type, user });
  }, []);

  const closeDialog = useCallback(() => {
    dispatchDialog({ type: "CLOSE" });
  }, []);

  // Actions que modifican datos (usan Server Actions y luego router.refresh)
  const blockUser = useCallback(
    (userId: string, reason?: string) => {
      startActionTransition(async () => {
        try {
          const result = await blockUserAction(userId, reason);
          if (result.error) {
            toast.error(result.error);
          } else if (result.success) {
            toast.success(result.success);
            closeDialog();
            router.refresh();
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al bloquear usuario");
        }
      });
    },
    [closeDialog, router]
  );

  const unblockUser = useCallback(
    (userId: string) => {
      startActionTransition(async () => {
        try {
          const result = await unblockUserAction(userId);
          if (result.error) {
            toast.error(result.error);
          } else if (result.success) {
            toast.success(result.success);
            closeDialog();
            router.refresh();
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al desbloquear usuario");
        }
      });
    },
    [closeDialog, router]
  );

  const changeRole = useCallback(
    (userId: string, newRole: Role) => {
      startActionTransition(async () => {
        try {
          const result = await changeRoleAction(userId, newRole);
          if (result.error) {
            toast.error(result.error);
          } else if (result.success) {
            toast.success(result.success);
            closeDialog();
            router.refresh();
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al cambiar rol");
        }
      });
    },
    [closeDialog, router]
  );

  const deleteUser = useCallback(
    (userId: string, reason: string) => {
      startActionTransition(async () => {
        try {
          const result = await deleteUserAction(userId, reason);
          if (result.error) {
            toast.error(result.error);
          } else if (result.success) {
            toast.success(result.success);
            closeDialog();
            router.refresh();
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al eliminar usuario");
        }
      });
    },
    [closeDialog, router]
  );

  const restoreUser = useCallback(
    (userId: string) => {
      startActionTransition(async () => {
        try {
          const result = await restoreUserAction(userId);
          if (result.error) {
            toast.error(result.error);
          } else if (result.success) {
            toast.success(result.success);
            closeDialog();
            router.refresh();
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error al restaurar usuario");
        }
      });
    },
    [closeDialog, router]
  );

  const bulkBlockUsers = useCallback(
    (reason?: string) => {
      const selectedIds = Object.keys(tableUI.rowSelection).filter((id) => tableUI.rowSelection[id]);
      if (selectedIds.length === 0) {
        toast.error(t("bulk.noUsersSelected"));
        return;
      }

      startActionTransition(async () => {
        try {
          const result = await bulkBlockUsersAction(selectedIds, reason);
          if (result.error) {
            toast.error(result.error);
          } else if (result.success) {
            toast.success(result.success);
            dispatchTableUI({ type: "CLEAR_SELECTION" });
            router.refresh();
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : tCommon("error"));
        }
      });
    },
    [tableUI.rowSelection, router, t, tCommon]
  );

  const bulkDeleteUsers = useCallback(() => {
    const selectedIds = Object.keys(tableUI.rowSelection).filter((id) => tableUI.rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error(t("bulk.noUsersSelected"));
      return;
    }

    startActionTransition(async () => {
      try {
        const result = await bulkDeleteUsersAction(selectedIds);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          dispatchTableUI({ type: "CLEAR_SELECTION" });
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : tCommon("error"));
      }
    });
  }, [tableUI.rowSelection, router, t, tCommon]);

  // Traducciones de columnas memoizadas
  const columnTranslations = useMemo(
    () => ({
      user: t("columns.user"),
      email: t("columns.email"),
      role: t("columns.role"),
      status: t("columns.status"),
      emailVerified: t("columns.emailVerified"),
      twoFactor: t("columns.twoFactor"),
      createdAt: t("columns.createdAt"),
      updatedAt: t("columns.updatedAt"),
    }),
    [t]
  );

  // Ref para acciones estables
  const actionsRef = useRef({
    onOpenDialog: openDialog,
    translations: columnTranslations,
  });
  actionsRef.current = { onOpenDialog: openDialog, translations: columnTranslations };

  // Columnas memoizadas
  const columns = useMemo(
    () => createAdminUsersColumns(actionsRef.current),
    [columnTranslations]
  );

  // Configs memoizadas
  const handleRowSelectionChange = useCallback(
    (selection: Record<string, boolean>) => dispatchTableUI({ type: "SET_ROW_SELECTION", selection }),
    []
  );

  const selectionConfig: SelectionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple",
      showCheckbox: true,
      selectedRows: tableUI.rowSelection,
      onSelectionChange: handleRowSelectionChange,
    }),
    [tableUI.rowSelection, handleRowSelectionChange]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: urlState.page - 1,
      pageSize: urlState.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showRowsInfo: true,
      showSelectedInfo: true,
    }),
    [urlState.page, urlState.pageSize, pagination.totalRows, pagination.totalPages, handlePaginationChange]
  );

  const sortingState: AdminUsersSorting[] = useMemo(
    () => (urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []),
    [urlState.sort, urlState.sortDir]
  );

  const sortingConfig: SortingConfig = useMemo(
    () => ({
      sorting: sortingState,
      onSortingChange: handleSortingChange,
      manualSorting: true,
    }),
    [sortingState, handleSortingChange]
  );

  const filterConfig: FilterConfig = useMemo(
    () => ({
      globalFilter: urlState.search,
      onGlobalFilterChange: handleSearchChange,
      placeholder: t("search.placeholder"),
      showClearButton: true,
      // Usa el global de 700ms desde constants.ts
    }),
    [urlState.search, handleSearchChange, t]
  );

  const handleColumnVisibilityChange = useCallback(
    (visibility: Record<string, boolean>) => dispatchTableUI({ type: "SET_COLUMN_VISIBILITY", visibility }),
    []
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility: tableUI.columnVisibility,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      alwaysVisibleColumns: ["user", "actions"],
    }),
    [tableUI.columnVisibility, handleColumnVisibilityChange]
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
      onRefresh: handleRefresh,
    }),
    [handleRefresh]
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

  const printConfig: PrintConfig = useMemo(
    () => ({
      enabled: true,
      title: t("table.printTitle"),
      pageSize: "A4",
      orientation: "landscape",
    }),
    [t]
  );

  const renderExpandedContent = useCallback(
    (user: AdminUser) => <UserExpandedContent user={user} />,
    []
  );

  const handleExpansionChange = useCallback(
    (rows: Record<string, boolean>) => dispatchTableUI({ type: "SET_EXPANDED_ROWS", rows }),
    []
  );

  const expansionConfig: ExpansionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      expandedRows: tableUI.expandedRows,
      onExpansionChange: handleExpansionChange,
      renderContent: renderExpandedContent,
      expandOnClick: false,
    }),
    [tableUI.expandedRows, handleExpansionChange, renderExpandedContent]
  );

  const selectedCount = useMemo(
    () => Object.values(tableUI.rowSelection).filter(Boolean).length,
    [tableUI.rowSelection]
  );

  const filters: AdminUsersFilters = useMemo(
    () => ({
      search: urlState.search,
      role: urlState.role,
      status: urlState.status,
    }),
    [urlState.search, urlState.role, urlState.status]
  );

  const getRowId = useCallback((row: AdminUser) => row.id, []);

  const clearSelection = useCallback(() => dispatchTableUI({ type: "CLEAR_SELECTION" }), []);

  return (
    <div className="space-y-6">
      <AdminUsersHeader />

      {error && (
        <AnimatedSection animation="fade-up" delay={50}>
          <ErrorAlert
            error={error}
            onRetry={handleRefresh}
            isNavigating={isNavigating}
          />
        </AnimatedSection>
      )}

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

          <CustomDataTable
            data={users}
            columns={columns}
            getRowId={getRowId}
            selection={selectionConfig}
            expansion={expansionConfig}
            pagination={paginationConfig}
            sorting={sortingConfig}
            filter={filterConfig}
            columnVisibility={columnVisibilityConfig}
            toolbarConfig={toolbarConfig}
            style={STYLE_CONFIG}
            export={exportConfig}
            copy={COPY_CONFIG}
            print={printConfig}
            fullscreen={FULLSCREEN_CONFIG}
            isLoading={false}
            isPending={isNavigating || isPending}
            emptyMessage={t("table.noUsers")}
          />
        </div>
      </AnimatedSection>

      <UserDetailsDialog
        user={dialogState.selectedUser}
        open={dialogState.activeDialog === "details"}
        onClose={closeDialog}
      />

      <BlockUserDialog
        user={dialogState.selectedUser}
        open={dialogState.activeDialog === "block" || dialogState.activeDialog === "unblock"}
        isPending={isPending}
        mode={dialogState.activeDialog === "block" ? "block" : "unblock"}
        onClose={closeDialog}
        onBlock={blockUser}
        onUnblock={unblockUser}
      />

      <ChangeRoleDialog
        user={dialogState.selectedUser}
        open={dialogState.activeDialog === "change-role"}
        isPending={isPending}
        onClose={closeDialog}
        onChangeRole={changeRole}
      />

      <DeleteUserDialog
        user={dialogState.selectedUser}
        open={dialogState.activeDialog === "delete"}
        isPending={isPending}
        onClose={closeDialog}
        onDelete={deleteUser}
      />

      <RestoreUserDialog
        user={dialogState.selectedUser}
        open={dialogState.activeDialog === "restore"}
        isPending={isPending}
        onClose={closeDialog}
        onRestore={restoreUser}
      />
    </div>
  );
});
