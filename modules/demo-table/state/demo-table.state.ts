import type {
  DemoProduct,
  DemoProductFilters,
  DemoProductStats,
  DemoTablePagination,
  DemoTableSorting,
  DialogType,
} from "../types/demo-table.types";
import type { ColumnVisibilityState } from "@/components/custom-datatable";

interface DemoTableStateData {
  products: DemoProduct[];
  stats: DemoProductStats | null;
  isLoading: boolean;
  isPending: boolean;
  isInitialized: boolean;
  error: string | null;
  filters: DemoProductFilters;
  rowSelection: Record<string, boolean>;
  expanded: Record<string, boolean>;
  sorting: DemoTableSorting[];
  columnVisibility: ColumnVisibilityState;
  pagination: DemoTablePagination;
  activeDialog: DialogType;
  selectedProduct: DemoProduct | null;
}

const initialFilters: DemoProductFilters = {
  search: "",
  status: "all",
  category: "all",
};

const initialPagination: DemoTablePagination = {
  pageIndex: 0,
  pageSize: 10,
  totalRows: 0,
  totalPages: 0,
};

const initialState: DemoTableStateData = {
  products: [],
  stats: null,
  isLoading: false,
  isPending: false,
  isInitialized: false,
  error: null,
  filters: initialFilters,
  rowSelection: {},
  expanded: {},
  sorting: [],
  columnVisibility: {},
  pagination: initialPagination,
  activeDialog: null,
  selectedProduct: null,
};

export class DemoTableState {
  private state: DemoTableStateData = { ...initialState };
  private listeners: Set<() => void> = new Set();

  // Flags de fetch que NO causan re-renders (para evitar duplicados en Strict Mode)
  private _isFetchingProducts = false;
  private _isFetchingStats = false;
  private _lastFetchParams = {
    page: 0,
    pageSize: 0,
    sort: "",
    sortDir: "",
    search: "",
  };

  public getState(): DemoTableStateData {
    return this.state;
  }

  // Métodos para controlar fetch sin causar re-renders
  public canFetchProducts(params: typeof this._lastFetchParams): boolean {
    if (this._isFetchingProducts) return false;
    if (
      this.state.isInitialized &&
      this._lastFetchParams.page === params.page &&
      this._lastFetchParams.pageSize === params.pageSize &&
      this._lastFetchParams.sort === params.sort &&
      this._lastFetchParams.sortDir === params.sortDir &&
      this._lastFetchParams.search === params.search
    ) {
      return false;
    }
    return true;
  }

  public startFetchingProducts(params: typeof this._lastFetchParams): void {
    this._isFetchingProducts = true;
    this._lastFetchParams = { ...params };
  }

  public finishFetchingProducts(): void {
    this._isFetchingProducts = false;
  }

  public canFetchStats(): boolean {
    return !this._isFetchingStats && !this.state.stats;
  }

  public startFetchingStats(): void {
    this._isFetchingStats = true;
  }

  public finishFetchingStats(): void {
    this._isFetchingStats = false;
  }

  public resetFetchFlags(): void {
    this._isFetchingProducts = false;
    this._isFetchingStats = false;
    this._lastFetchParams = { page: 0, pageSize: 0, sort: "", sortDir: "", search: "" };
  }

  public setProducts(products: DemoProduct[]): void {
    this.state = { ...this.state, products };
    this.notify();
  }

  public setStats(stats: DemoProductStats): void {
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

  public setFilters(filters: Partial<DemoProductFilters>): void {
    this.state = {
      ...this.state,
      filters: { ...this.state.filters, ...filters },
      pagination: { ...this.state.pagination, pageIndex: 0 },
    };
    this.notify();
  }

  public resetFilters(): void {
    this.state = {
      ...this.state,
      filters: { ...initialFilters },
      pagination: { ...initialPagination },
    };
    this.notify();
  }

  public setRowSelection(rowSelection: Record<string, boolean>): void {
    this.state = { ...this.state, rowSelection };
    this.notify();
  }

  public setExpanded(expanded: Record<string, boolean>): void {
    this.state = { ...this.state, expanded };
    this.notify();
  }

  public setSorting(sorting: DemoTableSorting[]): void {
    this.state = { ...this.state, sorting };
    this.notify();
  }

  public setColumnVisibility(columnVisibility: ColumnVisibilityState): void {
    this.state = { ...this.state, columnVisibility };
    this.notify();
  }

  public setPagination(pagination: Partial<DemoTablePagination>): void {
    this.state = {
      ...this.state,
      pagination: { ...this.state.pagination, ...pagination },
    };
    this.notify();
  }

  public openDialog(type: DialogType, product?: DemoProduct): void {
    this.state = {
      ...this.state,
      activeDialog: type,
      selectedProduct: product ?? null,
    };
    this.notify();
  }

  public closeDialog(): void {
    this.state = {
      ...this.state,
      activeDialog: null,
      selectedProduct: null,
    };
    this.notify();
  }

  public removeProduct(id: string): void {
    this.state = {
      ...this.state,
      products: this.state.products.filter((p) => p.id !== id),
      pagination: {
        ...this.state.pagination,
        totalRows: Math.max(0, this.state.pagination.totalRows - 1),
      },
      rowSelection: Object.fromEntries(
        Object.entries(this.state.rowSelection).filter(([key]) => key !== id)
      ),
    };
    this.notify();
  }

  public updateProduct(id: string, data: Partial<DemoProduct>): void {
    this.state = {
      ...this.state,
      products: this.state.products.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
      ),
    };
    this.notify();
  }

  public getSelectedProducts(): DemoProduct[] {
    return this.state.products.filter((p) => this.state.rowSelection[p.id]);
  }

  public clearSelection(): void {
    this.state = { ...this.state, rowSelection: {} };
    this.notify();
  }

  public reset(): void {
    this.state = { ...initialState };
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const demoTableState = new DemoTableState();
