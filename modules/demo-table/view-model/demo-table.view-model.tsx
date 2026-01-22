"use client";

import { useCallback, useMemo, useRef } from "react";
import { Trash2, Package, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type {
  CustomColumnDef,
  SelectionConfig,
  ExpansionConfig,
  PaginationConfig,
  SortingConfig,
  FilterConfig,
  ColumnVisibilityConfig,
  ToolbarConfig,
  ExportConfig,
  ExportFormat,
  StyleConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
} from "@/components/custom-datatable";

import { useDemoTable } from "../hooks/demo-table.hook";
import { createDemoTableColumns } from "../components/columns/demo-table.columns";
import { DemoTableFilters } from "../components/filters/demo-table-filters";
import type { DemoProduct, ProductStatus, DemoTableSorting } from "../types/demo-table.types";

const getRowId = (row: DemoProduct) => row.id;

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
  onFullscreenChange: (isFullscreen) => {
    if (isFullscreen) {
      toast.info("Modo pantalla completa activado", {
        description: "Presiona Escape para salir",
        duration: 2000,
      });
    }
  },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];
const EXPORT_FORMATS: ExportFormat[] = ["csv", "json", "xlsx"];
const ALWAYS_VISIBLE_COLUMNS = ["name", "actions"];

export function DemoTableViewModel() {
  const {
    products,
    stats,
    isLoading,
    isPending,
    isInitialized,
    filters,
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,
    activeDialog,
    selectedProduct,
    fetchProducts,
    fetchStats,
    handleRefresh,
    deleteProduct,
    bulkDeleteProducts,
    changeStatus,
    handleFiltersChange,
    handleSearchChange,
    handleRowSelectionChange,
    handleExpandedChange,
    handleSortingChange,
    handleColumnVisibilityChange,
    handlePaginationChange,
    openDialog,
    closeDialog,
    getSelectedProducts,
    clearSelection,
  } = useDemoTable();

  const actionsRef = useRef({
    openDialog,
    changeStatus,
    getSelectedProducts,
    bulkDeleteProducts,
  });

  actionsRef.current = {
    openDialog,
    changeStatus,
    getSelectedProducts,
    bulkDeleteProducts,
  };

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProduct(id);
    },
    [deleteProduct]
  );

  const handleChangeStatus = useCallback(async (product: DemoProduct, status: ProductStatus) => {
    await actionsRef.current.changeStatus(product.id, status);
  }, []);

  const handleBulkDelete = useCallback(async () => {
    const selected = actionsRef.current.getSelectedProducts();
    if (selected.length > 0) {
      await actionsRef.current.bulkDeleteProducts(selected.map((p) => p.id));
    }
  }, []);

  const columns = useMemo(
    () =>
      createDemoTableColumns({
        onView: (product) => actionsRef.current.openDialog("details", product),
        onDelete: (product) => actionsRef.current.openDialog("delete", product),
        onChangeStatus: handleChangeStatus,
      }),
    [handleChangeStatus]
  );

  const renderExpandedContent = useCallback(
    (product: DemoProduct) => (
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
    []
  );

  const selectionConfig: SelectionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple" as const,
      showCheckbox: true,
      selectedRows: rowSelection,
      onSelectionChange: handleRowSelectionChange,
      selectOnRowClick: false,
    }),
    [rowSelection, handleRowSelectionChange]
  );

  const expansionConfig: ExpansionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      expandedRows: expanded,
      onExpansionChange: handleExpandedChange,
      renderContent: renderExpandedContent,
      expandOnClick: false,
    }),
    [expanded, handleExpandedChange, renderExpandedContent]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showPageNumbers: true,
      showFirstLast: true,
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      pagination.totalRows,
      pagination.totalPages,
      handlePaginationChange,
    ]
  );

  const sortingConfig: SortingConfig = useMemo(
    () => ({
      sorting: sorting as DemoTableSorting[],
      onSortingChange: handleSortingChange,
      manualSorting: true,
    }),
    [sorting, handleSortingChange]
  );

  const filterConfig: FilterConfig = useMemo(
    () => ({
      globalFilter: filters.search || "",
      onGlobalFilterChange: handleSearchChange,
      placeholder: "Buscar por nombre, SKU o descripción...",
    }),
    [filters.search, handleSearchChange]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      alwaysVisibleColumns: ALWAYS_VISIBLE_COLUMNS,
    }),
    [columnVisibility, handleColumnVisibilityChange]
  );

  const filtersComponent = useMemo(
    () => <DemoTableFilters filters={filters} onFiltersChange={handleFiltersChange} />,
    [filters, handleFiltersChange]
  );

  const toolbarConfigOptions: ToolbarConfig = useMemo(
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

  const exportConfigOptions: ExportConfig<DemoProduct> = useMemo(
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
          <span className="hidden sm:inline">{pagination.totalRows} productos</span>
        </Button>
      </div>
    ),
    [pagination.totalRows]
  );

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

  const showLoading = isLoading && !products.length;

  const dataTableConfig = useMemo(
    () => ({
      data: products,
      columns,
      getRowId,
      selection: selectionConfig,
      expansion: expansionConfig,
      pagination: paginationConfig,
      sorting: sortingConfig,
      filter: filterConfig,
      columnVisibility: columnVisibilityConfig,
      toolbarConfig: toolbarConfigOptions,
      exportConfig: exportConfigOptions,
      copyConfig: COPY_CONFIG,
      printConfig: PRINT_CONFIG,
      fullscreenConfig: FULLSCREEN_CONFIG,
      style: STYLE_CONFIG,
      isLoading: showLoading,
      isPending,
      emptyMessage: "No se encontraron productos",
      emptyIcon,
      headerActions,
      bulkActions,
    }),
    [
      products,
      columns,
      selectionConfig,
      expansionConfig,
      paginationConfig,
      sortingConfig,
      filterConfig,
      columnVisibilityConfig,
      toolbarConfigOptions,
      exportConfigOptions,
      showLoading,
      isPending,
      emptyIcon,
      headerActions,
      bulkActions,
    ]
  );

  return {
    dataTableConfig,
    stats,
    selectedProduct,
    activeDialog,
    isLoading,
    isPending,
    isInitialized,
    fetchProducts,
    fetchStats,
    handleRefresh,
    openDialog,
    closeDialog,
    handleDelete,
    getSelectedProducts,
    clearSelection,
  };
}
