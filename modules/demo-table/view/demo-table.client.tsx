"use client";

import { memo, useSyncExternalStore, useTransition, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RefreshCw, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import { demoTableState } from "../state/demo-table.state";
import {
  getProductsAction,
  getStatsAction,
  deleteProductAction,
  bulkDeleteProductsAction,
  updateProductStatusAction,
} from "../actions/demo-table.actions";
import { createDemoTableColumns } from "../components/columns/demo-table.columns";
import { DemoTableStats } from "../components/stats/demo-table-stats";
import { DemoTableFilters } from "../components/filters/demo-table-filters";
import { DeleteProductDialog, ProductDetailsDialog } from "../components/dialogs";

import type {
  DemoProduct,
  DemoProductFilters,
  DemoProductStats,
  DemoTablePagination,
  DemoTableSorting,
  ProductStatus,
} from "../types/demo-table.types";
import type {
  StyleConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
  ExportFormat,
  ExportConfig,
  ToolbarConfig,
  ColumnVisibilityConfig,
  FilterConfig,
  SortingConfig,
  PaginationConfig,
  ExpansionConfig,
  SelectionConfig,
} from "@/components/custom-datatable";

// Constantes de configuración (fuera del componente para evitar re-creación)
const STYLE_CONFIG: StyleConfig = {
  striped: true,
  hover: true,
  stickyHeader: true,
  density: "default",
  borderStyle: "default",
  maxHeight: 600,
};

const COPY_CONFIG: CopyConfig = {
  enabled: true,
  format: "csv",
  includeHeaders: true,
};

const PRINT_CONFIG: PrintConfig = {
  enabled: true,
  title: "Catálogo de Productos - Demo",
  showLogo: false,
  pageSize: "A4",
  orientation: "landscape",
};

const FULLSCREEN_CONFIG: FullscreenConfig = {
  enabled: true,
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];
const EXPORT_FORMATS: ExportFormat[] = ["csv", "json", "xlsx"];
const ALWAYS_VISIBLE_COLUMNS = ["name", "actions"];
const PREFIX = "products";

interface InitialData {
  products: DemoProduct[];
  pagination: DemoTablePagination;
  stats: DemoProductStats | null;
  sorting: DemoTableSorting[];
  filters: DemoProductFilters;
  error: string | null;
}

interface DemoTableClientProps {
  initialData: InitialData;
}

const DemoTableHeader = memo(function DemoTableHeader({
  isPending,
  onRefresh,
}: {
  isPending: boolean;
  onRefresh: () => void;
}) {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Demo DataTable</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Demostración de CustomDataTable con todas las funcionalidades disponibles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isPending}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
});

export function DemoTableClient({ initialData }: DemoTableClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Inicializar el state global con los datos del servidor (solo una vez)
  const isInitializedRef = useRef(false);
  if (!isInitializedRef.current) {
    demoTableState.setProducts(initialData.products);
    demoTableState.setPagination(initialData.pagination);
    if (initialData.stats) {
      demoTableState.setStats(initialData.stats);
    }
    demoTableState.setInitialized(true);
    isInitializedRef.current = true;
  }

  // useSyncExternalStore en lugar de useState + useEffect
  const state = useSyncExternalStore(
    demoTableState.subscribe.bind(demoTableState),
    demoTableState.getState.bind(demoTableState),
    demoTableState.getState.bind(demoTableState)
  );

  // Leer estado de URL
  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : 1,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : 10,
      sort: getParam("sort") || "createdAt",
      sortDir: (getParam("sortDir") || "desc") as "asc" | "desc",
      search: getParam("search") || "",
    };
  }, [searchParams]);

  // Actualizar URL sin useEffect
  const updateUrl = useCallback(
    (updates: Partial<typeof urlState>) => {
      const params = new URLSearchParams(searchParams.toString());
      const newState = { ...urlState, ...updates };

      if (newState.page === 1) params.delete(`${PREFIX}_page`);
      else params.set(`${PREFIX}_page`, String(newState.page));

      if (newState.pageSize === 10) params.delete(`${PREFIX}_pageSize`);
      else params.set(`${PREFIX}_pageSize`, String(newState.pageSize));

      if (newState.sort === "createdAt" && newState.sortDir === "desc") {
        params.delete(`${PREFIX}_sort`);
        params.delete(`${PREFIX}_sortDir`);
      } else {
        params.set(`${PREFIX}_sort`, newState.sort);
        params.set(`${PREFIX}_sortDir`, newState.sortDir);
      }

      if (!newState.search) params.delete(`${PREFIX}_search`);
      else params.set(`${PREFIX}_search`, newState.search);

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router, urlState]
  );

  // Fetch con Server Action directamente (sin useEffect)
  const fetchProducts = useCallback(
    (params: typeof urlState) => {
      startTransition(async () => {
        const sorting: DemoTableSorting[] = params.sort
          ? [{ id: params.sort, desc: params.sortDir === "desc" }]
          : [];

        const filters: DemoProductFilters = {
          ...state.filters,
          search: params.search,
        };

        const result = await getProductsAction({
          page: params.page - 1,
          pageSize: params.pageSize,
          filters,
          sorting,
        });

        if (result.error) {
          demoTableState.setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result.data) {
          demoTableState.setProducts(result.data.data);
          demoTableState.setPagination({
            pageIndex: params.page - 1,
            pageSize: params.pageSize,
            totalRows: result.data.pagination.totalRows,
            totalPages: result.data.pagination.totalPages,
          });
        }
      });
    },
    [state.filters]
  );

  const fetchStats = useCallback(() => {
    startTransition(async () => {
      const result = await getStatsAction();
      if (result.data) {
        demoTableState.setStats(result.data);
      }
    });
  }, []);

  const handleRefresh = useCallback(() => {
    fetchProducts(urlState);
    fetchStats();
    toast.success("Datos actualizados");
  }, [fetchProducts, fetchStats, urlState]);

  // Handlers que actualizan URL y disparan fetch
  const handlePaginationChange = useCallback(
    (pagination: { pageIndex: number; pageSize: number }) => {
      const newParams = {
        ...urlState,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      updateUrl(newParams);
      fetchProducts(newParams);
    },
    [urlState, updateUrl, fetchProducts]
  );

  const handleSortingChange = useCallback(
    (sorting: DemoTableSorting[]) => {
      const newParams = {
        ...urlState,
        sort: sorting.length > 0 ? sorting[0].id : "createdAt",
        sortDir: sorting.length > 0 && sorting[0].desc ? "desc" as const : "asc" as const,
        page: 1,
      };
      updateUrl(newParams);
      fetchProducts(newParams);
    },
    [urlState, updateUrl, fetchProducts]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      const newParams = { ...urlState, search, page: 1 };
      updateUrl(newParams);
      fetchProducts(newParams);
    },
    [urlState, updateUrl, fetchProducts]
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<DemoProductFilters>) => {
      demoTableState.setFilters(newFilters);
      fetchProducts(urlState);
    },
    [urlState, fetchProducts]
  );

  // Actions
  const deleteProduct = useCallback(
    async (id: string) => {
      demoTableState.setPending(true);
      try {
        const result = await deleteProductAction(id);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        demoTableState.removeProduct(id);
        demoTableState.closeDialog();
        toast.success(result.success || "Producto eliminado");
        fetchStats();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar");
      } finally {
        demoTableState.setPending(false);
      }
    },
    [fetchStats]
  );

  const bulkDeleteProducts = useCallback(
    async (ids: string[]) => {
      demoTableState.setPending(true);
      try {
        const result = await bulkDeleteProductsAction(ids);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        ids.forEach((id) => demoTableState.removeProduct(id));
        demoTableState.clearSelection();
        toast.success(result.success || `${ids.length} productos eliminados`);
        fetchStats();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar");
      } finally {
        demoTableState.setPending(false);
      }
    },
    [fetchStats]
  );

  const changeStatus = useCallback(
    async (id: string, status: ProductStatus) => {
      demoTableState.setPending(true);
      try {
        const result = await updateProductStatusAction(id, status);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (result.data) {
          demoTableState.updateProduct(id, result.data);
        }
        toast.success(result.success || "Estado actualizado");
        fetchStats();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al cambiar estado");
      } finally {
        demoTableState.setPending(false);
      }
    },
    [fetchStats]
  );

  // Ref para acciones estables
  const actionsRef = useRef({
    openDialog: demoTableState.openDialog.bind(demoTableState),
    changeStatus,
    getSelectedProducts: demoTableState.getSelectedProducts.bind(demoTableState),
    bulkDeleteProducts,
  });
  actionsRef.current = {
    openDialog: demoTableState.openDialog.bind(demoTableState),
    changeStatus,
    getSelectedProducts: demoTableState.getSelectedProducts.bind(demoTableState),
    bulkDeleteProducts,
  };

  // Columnas memoizadas
  const columns = useMemo(
    () =>
      createDemoTableColumns({
        onView: (product) => actionsRef.current.openDialog("details", product),
        onDelete: (product) => actionsRef.current.openDialog("delete", product),
        onChangeStatus: async (product, status) => actionsRef.current.changeStatus(product.id, status),
      }),
    []
  );

  // Configs memoizadas
  const selectionConfig: SelectionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple" as const,
      showCheckbox: true,
      selectedRows: state.rowSelection,
      onSelectionChange: demoTableState.setRowSelection.bind(demoTableState),
      selectOnRowClick: false,
    }),
    [state.rowSelection]
  );

  const expansionConfig: ExpansionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      expandedRows: state.expanded,
      onExpansionChange: demoTableState.setExpanded.bind(demoTableState),
      renderContent: (product: DemoProduct) => (
        <div className="p-4 bg-muted/30 rounded-md">
          <h4 className="font-medium mb-2">Descripción completa</h4>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ID: </span>
              <span className="font-mono">{product.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">SKU: </span>
              <span className="font-mono">{product.sku}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Categoría: </span>
              <span>{product.category}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Valor en stock: </span>
              <span className="font-mono">
                ${(product.price * product.stock).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ),
      expandOnClick: false,
    }),
    [state.expanded]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: urlState.page - 1,
      pageSize: urlState.pageSize,
      totalRows: state.pagination.totalRows,
      totalPages: state.pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showPageNumbers: true,
      showFirstLast: true,
    }),
    [urlState.page, urlState.pageSize, state.pagination.totalRows, state.pagination.totalPages, handlePaginationChange]
  );

  const sortingState: DemoTableSorting[] = useMemo(
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
      placeholder: "Buscar por nombre, SKU o descripción...",
    }),
    [urlState.search, handleSearchChange]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility: state.columnVisibility,
      onColumnVisibilityChange: demoTableState.setColumnVisibility.bind(demoTableState),
      alwaysVisibleColumns: ALWAYS_VISIBLE_COLUMNS,
    }),
    [state.columnVisibility]
  );

  const filtersComponent = useMemo(
    () => <DemoTableFilters filters={state.filters} onFiltersChange={handleFiltersChange} />,
    [state.filters, handleFiltersChange]
  );

  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
      show: true,
      showSearch: true,
      showExport: true,
      showColumnVisibility: true,
      showDensityToggle: true,
      showRefresh: true,
      showCopy: true,
      showPrint: true,
      showFullscreen: true,
      onRefresh: handleRefresh,
      customStart: filtersComponent,
    }),
    [handleRefresh, filtersComponent]
  );

  const handleExport = useCallback((format: ExportFormat, data: DemoProduct[]) => {
    const filename = `productos_demo_${new Date().toISOString().split("T")[0]}`;
    const exportData = data.map((product) => ({
      id: product.id,
      nombre: product.name,
      descripcion: product.description,
      precio: product.price,
      stock: product.stock,
      categoria: product.category,
      estado: product.status,
      sku: product.sku,
    }));

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case "csv": {
        const headers = Object.keys(exportData[0] || {}).join(",");
        const rows = exportData.map((row) =>
          Object.values(row)
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        );
        content = [headers, ...rows].join("\n");
        mimeType = "text/csv;charset=utf-8;";
        fileExtension = "csv";
        break;
      }
      case "json": {
        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json;charset=utf-8;";
        fileExtension = "json";
        break;
      }
      case "xlsx": {
        const headers = Object.keys(exportData[0] || {}).join("\t");
        const rows = exportData.map((row) => Object.values(row).join("\t"));
        content = [headers, ...rows].join("\n");
        mimeType = "application/vnd.ms-excel;charset=utf-8;";
        fileExtension = "xls";
        break;
      }
      default:
        return;
    }

    const blob = new Blob(["\ufeff" + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exportación completada`, {
      description: `${data.length} productos exportados como ${format.toUpperCase()}`,
    });
  }, []);

  const exportConfig: ExportConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      formats: EXPORT_FORMATS,
      filename: "productos_demo",
      onExport: handleExport,
    }),
    [handleExport]
  );

  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">{state.pagination.totalRows} productos</span>
        </Button>
      </div>
    ),
    [state.pagination.totalRows]
  );

  const handleBulkDelete = useCallback(() => {
    const selected = actionsRef.current.getSelectedProducts();
    if (selected.length > 0) {
      actionsRef.current.bulkDeleteProducts(selected.map((p) => p.id));
    }
  }, []);

  const bulkActions = useCallback(
    (selectedRows: DemoProduct[]) => (
      <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
        <Trash2 className="h-4 w-4" />
        Eliminar ({selectedRows.length})
      </Button>
    ),
    [handleBulkDelete]
  );

  const emptyIcon = useMemo(() => <Package className="h-12 w-12 text-muted-foreground/50" />, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProduct(id);
    },
    [deleteProduct]
  );

  const getRowId = useCallback((row: DemoProduct) => row.id, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DemoTableHeader isPending={isPending || state.isPending} onRefresh={handleRefresh} />

      <AnimatedSection animation="fade-up" delay={100}>
        <DemoTableStats stats={state.stats} isLoading={false} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <CustomDataTable
          data={state.products}
          columns={columns}
          getRowId={getRowId}
          selection={selectionConfig}
          expansion={expansionConfig}
          pagination={paginationConfig}
          sorting={sortingConfig}
          filter={filterConfig}
          columnVisibility={columnVisibilityConfig}
          toolbarConfig={toolbarConfig}
          export={exportConfig}
          copy={COPY_CONFIG}
          print={PRINT_CONFIG}
          fullscreen={FULLSCREEN_CONFIG}
          style={STYLE_CONFIG}
          isLoading={state.isLoading}
          isPending={isPending || state.isPending}
          emptyMessage="No se encontraron productos"
          emptyIcon={emptyIcon}
          headerActions={headerActions}
          bulkActions={bulkActions}
        />

        <ProductDetailsDialog
          key={`details-${state.selectedProduct?.id}`}
          product={state.selectedProduct}
          open={state.activeDialog === "details"}
          onOpenChange={(open) => !open && demoTableState.closeDialog()}
        />

        <DeleteProductDialog
          key={`delete-${state.selectedProduct?.id}`}
          product={state.selectedProduct}
          open={state.activeDialog === "delete"}
          onOpenChange={(open) => !open && demoTableState.closeDialog()}
          onConfirm={handleDelete}
        />
      </AnimatedSection>
    </div>
  );
}
