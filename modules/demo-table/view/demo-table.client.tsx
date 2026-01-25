"use client";

import { memo, useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RefreshCw, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import {
  deleteProductAction,
  bulkDeleteProductsAction,
  updateProductStatusAction,
} from "../actions/demo-table.actions";
import { createDemoTableColumns, type ColumnLabels } from "../components/columns/demo-table.columns";
import { DemoTableStats, type StatsLabels } from "../components/stats/demo-table-stats";
import { DemoTableFilters, type FilterLabels } from "../components/filters/demo-table-filters";
import { DeleteProductDialog, ProductDetailsDialog } from "../components/dialogs";
import type { DeleteDialogLabels } from "../components/dialogs/delete-product-dialog";
import type { DetailsDialogLabels } from "../components/dialogs/product-details-dialog";

import type {
  DemoProduct,
  DemoProductFilters,
  DemoProductStats,
  DemoTablePagination,
  DemoTableSorting,
  ProductStatus,
  ProductCategory,
  DialogType,
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

interface HeaderLabels {
  title: string;
  description: string;
  refresh: string;
}

const DemoTableHeader = memo(function DemoTableHeader({
  isNavigating,
  onRefresh,
  labels,
}: {
  isNavigating: boolean;
  onRefresh: () => void;
  labels: HeaderLabels;
}) {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{labels.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {labels.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isNavigating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isNavigating ? "animate-spin" : ""}`} />
            {labels.refresh}
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
  const t = useTranslations("DemoTable");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  // Estado de UI local (no datos del servidor)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null);

  // useTransition para operaciones async (siguiendo Vercel Best Practices)
  const [isPending, startTransition] = useTransition();
  const [isNavigating, startNavigation] = useTransition();

  // Datos del servidor (readonly, vienen del Server Component)
  const { products, pagination, stats, filters } = initialData;

  // Memoized labels for all child components
  const headerLabels = useMemo((): HeaderLabels => ({
    title: t("title"),
    description: t("description"),
    refresh: t("refresh"),
  }), [t]);

  const statsLabels = useMemo((): StatsLabels => ({
    total: t("stats.total"),
    active: t("stats.active"),
    inactive: t("stats.inactive"),
    discontinued: t("stats.discontinued"),
    lowStock: t("stats.lowStock"),
    totalValue: t("stats.totalValue"),
  }), [t]);

  const filterLabels = useMemo((): FilterLabels => ({
    filters: t("filters.filters"),
    status: t("filters.status"),
    category: t("filters.category"),
    allStatuses: t("filters.allStatuses"),
    allCategories: t("filters.allCategories"),
    clearFilters: t("filters.clearFilters"),
    statusActive: t("status.active"),
    statusInactive: t("status.inactive"),
    statusDiscontinued: t("status.discontinued"),
    categoryElectronics: t("categories.electronics"),
    categoryClothing: t("categories.clothing"),
    categoryFood: t("categories.food"),
    categoryBooks: t("categories.books"),
    categoryOther: t("categories.other"),
  }), [t]);

  const columnLabels = useMemo((): ColumnLabels => ({
    columns: {
      product: t("columns.product"),
      category: t("columns.category"),
      price: t("columns.price"),
      stock: t("columns.stock"),
      status: t("columns.status"),
      updatedAt: t("columns.updatedAt"),
      actions: t("columns.actions"),
    },
    status: {
      active: t("status.active"),
      inactive: t("status.inactive"),
      discontinued: t("status.discontinued"),
    },
    categories: {
      electronics: t("categories.electronics"),
      clothing: t("categories.clothing"),
      food: t("categories.food"),
      books: t("categories.books"),
      other: t("categories.other"),
    },
    actions: {
      actions: t("actions.actions"),
      viewDetails: t("actions.viewDetails"),
      activate: t("actions.activate"),
      deactivate: t("actions.deactivate"),
      discontinue: t("actions.discontinue"),
      delete: t("actions.delete"),
    },
    lowStock: t("lowStock"),
    locale,
  }), [t, locale]);

  const deleteDialogLabels = useMemo((): DeleteDialogLabels => ({
    title: t("deleteDialog.title"),
    description: t("deleteDialog.description"),
    warning: t.raw("deleteDialog.warning"),
    cancel: tCommon("cancel"),
    delete: tCommon("delete"),
    deleting: t("deleteDialog.deleting"),
  }), [t, tCommon]);

  const detailsDialogLabels = useMemo((): DetailsDialogLabels => ({
    title: t("detailsDialog.title"),
    description: t("detailsDialog.description"),
    sku: t("sku"),
    status: t("columns.status"),
    price: t("columns.price"),
    stock: t("columns.stock"),
    units: t("detailsDialog.units"),
    category: t("columns.category"),
    stockValue: t("stockValue"),
    created: t("detailsDialog.created"),
    updated: t("detailsDialog.updated"),
    statusActive: t("status.active"),
    statusInactive: t("status.inactive"),
    statusDiscontinued: t("status.discontinued"),
    categoryElectronics: t("categories.electronics"),
    categoryClothing: t("categories.clothing"),
    categoryFood: t("categories.food"),
    categoryBooks: t("categories.books"),
    categoryOther: t("categories.other"),
  }), [t]);

  const printConfig: PrintConfig = useMemo(() => ({
    enabled: true,
    title: t("printTitle"),
    showLogo: false,
    pageSize: "A4",
    orientation: "landscape",
  }), [t]);

  // Leer estado de URL para sincronizar UI
  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : 1,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : 10,
      sort: getParam("sort") || "createdAt",
      sortDir: (getParam("sortDir") || "desc") as "asc" | "desc",
      search: getParam("search") || "",
      status: (getParam("status") || "all") as ProductStatus | "all",
      category: (getParam("category") || "all") as ProductCategory | "all",
    };
  }, [searchParams]);

  // Navegar con router.replace - dispara re-fetch en Server Component
  const navigate = useCallback(
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

      if (!newState.status || newState.status === "all") params.delete(`${PREFIX}_status`);
      else params.set(`${PREFIX}_status`, newState.status);

      if (!newState.category || newState.category === "all") params.delete(`${PREFIX}_category`);
      else params.set(`${PREFIX}_category`, newState.category);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // useTransition maneja automáticamente el estado de navegación
      startNavigation(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router, urlState]
  );

  // Handlers de navegación (disparan Server Component re-fetch)
  const handlePaginationChange = useCallback(
    (paginationUpdate: { pageIndex: number; pageSize: number }) => {
      setRowSelection({}); // Limpiar selección al cambiar página
      navigate({
        page: paginationUpdate.pageIndex + 1,
        pageSize: paginationUpdate.pageSize,
      });
    },
    [navigate]
  );

  const handleSortingChange = useCallback(
    (sorting: DemoTableSorting[]) => {
      navigate({
        sort: sorting.length > 0 ? sorting[0].id : "createdAt",
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
    (newFilters: Partial<DemoProductFilters>) => {
      navigate({
        status: newFilters.status ?? urlState.status,
        category: newFilters.category ?? urlState.category,
        page: 1,
      });
    },
    [navigate, urlState.status, urlState.category]
  );

  const handleRefresh = useCallback(() => {
    router.refresh();
    toast.success(t("dataUpdated"));
  }, [router, t]);

  // Dialog handlers
  const openDialog = useCallback((type: DialogType, product: DemoProduct | null = null) => {
    setActiveDialog(type);
    setSelectedProduct(product);
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedProduct(null);
  }, []);

  // Actions que modifican datos (usan Server Actions)
  // Nota: deleteProduct devuelve Promise porque DeleteProductDialog tiene su propio useTransition
  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        const result = await deleteProductAction(id);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        closeDialog();
        toast.success(result.success || t("productDeleted"));
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("deleteError"));
      }
    },
    [closeDialog, router, t]
  );

  // bulkDeleteProducts y changeStatus usan startTransition porque no tienen dialog interno
  const bulkDeleteProducts = useCallback(
    (ids: string[]) => {
      startTransition(async () => {
        try {
          const result = await bulkDeleteProductsAction(ids);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          setRowSelection({});
          toast.success(result.success || t("productsDeleted", { count: ids.length }));
          router.refresh();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : t("deleteError"));
        }
      });
    },
    [router, t]
  );

  const changeStatus = useCallback(
    (id: string, status: ProductStatus) => {
      startTransition(async () => {
        try {
          const result = await updateProductStatusAction(id, status);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success(result.success || t("statusUpdated"));
          router.refresh();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : t("statusError"));
        }
      });
    },
    [router, t]
  );

  // Obtener productos seleccionados
  const getSelectedProducts = useCallback(() => {
    return products.filter((p) => rowSelection[p.id]);
  }, [products, rowSelection]);

  // Ref para acciones estables
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

  // Columnas memoizadas
  const columns = useMemo(
    () =>
      createDemoTableColumns({
        actions: {
          onView: (product) => actionsRef.current.openDialog("details", product),
          onDelete: (product) => actionsRef.current.openDialog("delete", product),
          onChangeStatus: async (product, status) => actionsRef.current.changeStatus(product.id, status),
        },
        labels: columnLabels,
      }),
    [columnLabels]
  );

  // Configs memoizadas
  const selectionConfig: SelectionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple" as const,
      showCheckbox: true,
      selectedRows: rowSelection,
      onSelectionChange: setRowSelection,
      selectOnRowClick: false,
    }),
    [rowSelection]
  );

  const expansionConfig: ExpansionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      expandedRows: expanded,
      onExpansionChange: setExpanded,
      renderContent: (product: DemoProduct) => (
        <div className="p-4 bg-muted/30 rounded-md">
          <h4 className="font-medium mb-2">{t("fullDescription")}</h4>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t("id")}: </span>
              <span className="font-mono">{product.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("sku")}: </span>
              <span className="font-mono">{product.sku}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("category")}: </span>
              <span>{product.category}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t("stockValue")}: </span>
              <span className="font-mono">
                ${(product.price * product.stock).toLocaleString(locale, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ),
      expandOnClick: false,
    }),
    [expanded, t, locale]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: urlState.page - 1,
      pageSize: urlState.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showPageNumbers: true,
      showFirstLast: true,
    }),
    [urlState.page, urlState.pageSize, pagination.totalRows, pagination.totalPages, handlePaginationChange]
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
      placeholder: t("searchPlaceholder"),
      // Usa el global de 700ms desde constants.ts
      showClearButton: true,
    }),
    [urlState.search, handleSearchChange, t]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility: columnVisibility,
      onColumnVisibilityChange: setColumnVisibility,
      alwaysVisibleColumns: ALWAYS_VISIBLE_COLUMNS,
    }),
    [columnVisibility]
  );

  const filtersComponent = useMemo(
    () => <DemoTableFilters filters={filters} onFiltersChange={handleFiltersChange} labels={filterLabels} />,
    [filters, handleFiltersChange, filterLabels]
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
    const filename = `products_demo_${new Date().toISOString().split("T")[0]}`;
    const exportData = data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      status: product.status,
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

    toast.success(t("exportCompleted"), {
      description: t("productsExported", { count: data.length, format: format.toUpperCase() }),
    });
  }, [t]);

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
          <span className="hidden sm:inline">{pagination.totalRows} {t("products")}</span>
        </Button>
      </div>
    ),
    [pagination.totalRows, t]
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
        {t("deleteSelected", { count: selectedRows.length })}
      </Button>
    ),
    [handleBulkDelete, t]
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
      <DemoTableHeader isNavigating={isNavigating || isPending} onRefresh={handleRefresh} labels={headerLabels} />

      <AnimatedSection animation="fade-up" delay={100}>
        <DemoTableStats stats={stats} isLoading={isNavigating} labels={statsLabels} locale={locale} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <CustomDataTable
          data={products}
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
          print={printConfig}
          fullscreen={FULLSCREEN_CONFIG}
          style={STYLE_CONFIG}
          isLoading={false}
          isPending={isNavigating || isPending}
          emptyMessage={t("noProductsFound")}
          emptyIcon={emptyIcon}
          headerActions={headerActions}
          bulkActions={bulkActions}
        />

        <ProductDetailsDialog
          key={`details-${selectedProduct?.id}`}
          product={selectedProduct}
          open={activeDialog === "details"}
          onOpenChange={(open) => !open && closeDialog()}
          labels={detailsDialogLabels}
          locale={locale}
        />

        <DeleteProductDialog
          key={`delete-${selectedProduct?.id}`}
          product={selectedProduct}
          open={activeDialog === "delete"}
          onOpenChange={(open) => !open && closeDialog()}
          onConfirm={handleDelete}
          labels={deleteDialogLabels}
        />
      </AnimatedSection>
    </div>
  );
}
