import type {
  AdminUser,
  AdminUsersStats,
  AdminUsersFilters,
  AdminUsersPagination,
  AdminUsersSorting,
  AdminUsersColumnVisibility,
  AdminUsersDialogType,
} from "../types/admin-users.types";

interface AdminUsersStateData {
  users: AdminUser[];
  stats: AdminUsersStats | null;
  isLoading: boolean;
  isPending: boolean;
  isInitialized: boolean;
  error: string | null;

  filters: AdminUsersFilters;
  rowSelection: Record<string, boolean>;
  sorting: AdminUsersSorting[];
  columnVisibility: AdminUsersColumnVisibility;
  pagination: AdminUsersPagination;

  activeDialog: AdminUsersDialogType;
  selectedUser: AdminUser | null;
}

const initialFilters: AdminUsersFilters = {
  search: "",
  role: "all",
  status: "all",
};

const initialPagination: AdminUsersPagination = {
  pageIndex: 0,
  pageSize: 10,
  totalRows: 0,
  totalPages: 0,
};

const initialState: AdminUsersStateData = {
  users: [],
  stats: null,
  isLoading: false,
  isPending: false,
  isInitialized: false,
  error: null,

  filters: initialFilters,
  rowSelection: {},
  sorting: [{ id: "createdAt", desc: true }],
  columnVisibility: {},
  pagination: initialPagination,

  activeDialog: null,
  selectedUser: null,
};

export class AdminUsersState {
  private state: AdminUsersStateData = { ...initialState };
  private listeners: Set<() => void> = new Set();

  public getState(): AdminUsersStateData {
    return this.state;
  }

  public getSnapshot(): AdminUsersStateData {
    return this.state;
  }

  public getServerSnapshot(): AdminUsersStateData {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public setUsers(users: AdminUser[]): void {
    this.state = { ...this.state, users };
    this.notify();
  }

  public setStats(stats: AdminUsersStats | null): void {
    this.state = { ...this.state, stats };
    this.notify();
  }

  public setLoading(isLoading: boolean): void {
    this.state = { ...this.state, isLoading };
    this.notify();
  }

  public setPending(isPending: boolean): void {
    this.state = { ...this.state, isPending };
    this.notify();
  }

  public setInitialized(isInitialized: boolean): void {
    this.state = { ...this.state, isInitialized };
    this.notify();
  }

  public setError(error: string | null): void {
    this.state = { ...this.state, error };
    this.notify();
  }

  public setFilters(filters: AdminUsersFilters): void {
    this.state = {
      ...this.state,
      filters,
      pagination: { ...this.state.pagination, pageIndex: 0 },
    };
    this.notify();
  }

  public setSearch(search: string): void {
    this.state = {
      ...this.state,
      filters: { ...this.state.filters, search },
      pagination: { ...this.state.pagination, pageIndex: 0 },
    };
    this.notify();
  }

  public setRowSelection(rowSelection: Record<string, boolean>): void {
    this.state = { ...this.state, rowSelection };
    this.notify();
  }

  public setSorting(sorting: AdminUsersSorting[]): void {
    this.state = { ...this.state, sorting };
    this.notify();
  }

  public setColumnVisibility(
    columnVisibility: AdminUsersColumnVisibility
  ): void {
    this.state = { ...this.state, columnVisibility };
    this.notify();
  }

  public setPagination(pagination: AdminUsersPagination): void {
    this.state = { ...this.state, pagination };
    this.notify();
  }

  public setPageIndex(pageIndex: number): void {
    this.state = {
      ...this.state,
      pagination: { ...this.state.pagination, pageIndex },
    };
    this.notify();
  }

  public setPageSize(pageSize: number): void {
    this.state = {
      ...this.state,
      pagination: { ...this.state.pagination, pageSize, pageIndex: 0 },
    };
    this.notify();
  }

  public setActiveDialog(activeDialog: AdminUsersDialogType): void {
    this.state = { ...this.state, activeDialog };
    this.notify();
  }

  public setSelectedUser(selectedUser: AdminUser | null): void {
    this.state = { ...this.state, selectedUser };
    this.notify();
  }

  public openDialog(dialog: AdminUsersDialogType, user?: AdminUser): void {
    this.state = {
      ...this.state,
      activeDialog: dialog,
      selectedUser: user || null,
    };
    this.notify();
  }

  public closeDialog(): void {
    this.state = {
      ...this.state,
      activeDialog: null,
      selectedUser: null,
    };
    this.notify();
  }

  public clearSelection(): void {
    this.state = { ...this.state, rowSelection: {} };
    this.notify();
  }

  public resetFilters(): void {
    this.state = {
      ...this.state,
      filters: initialFilters,
      pagination: { ...this.state.pagination, pageIndex: 0 },
    };
    this.notify();
  }

  public reset(): void {
    this.state = { ...initialState };
    this.notify();
  }
}

export const adminUsersState = new AdminUsersState();
