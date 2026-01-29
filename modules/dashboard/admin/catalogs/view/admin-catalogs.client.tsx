"use client";

import { memo, useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import {
  deleteCatalogAction,
  toggleCatalogStatusAction,
  toggleCatalogFeaturedAction,
  getCatalogByIdAction,
} from "../actions/admin-catalogs.actions";
import { createCatalogColumns } from "../components/columns/admin-catalogs.columns";
import { AdminCatalogsStatsSection } from "../components/stats/admin-catalogs-stats";
import { AdminCatalogsFiltersSection } from "../components/filters/admin-catalogs-filters";
import { CatalogFormDialog, DeleteDialog, CatalogDetailsDialog } from "../components/dialogs";

import type {
  AdminCatalog,
  AdminCatalogsStats,
  AdminCatalogsFilters,
  AdminCatalogsDialogType,
} from "../types/admin-catalogs.types";
import type {
  StyleConfig,
  CopyConfig,
  FullscreenConfig,
  ToolbarConfig,
  ColumnVisibilityConfig,
  FilterConfig,
  SortingConfig,
  PaginationConfig,
} from "@/components/custom-datatable";

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

const FULLSCREEN_CONFIG: FullscreenConfig = {
  enabled: true,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const PREFIX = "catalogs";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "year";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_STATUS = "all";
const DEFAULT_YEAR = "all";

interface Labels {
  title: string;
  description: string;
  stats: {
    totalCatalogs: string;
    totalCatalogsDesc: string;
    activeCatalogs: string;
    activeCatalogsDesc: string;
    featuredCatalogs: string;
    featuredCatalogsDesc: string;
    totalPages: string;
    totalPagesDesc: string;
  };
  filters: {
    status: string;
    allStatuses: string;
    active: string;
    inactive: string;
    featured: string;
    year: string;
    allYears: string;
    clearFilters: string;
  };
  columns: {
    title: string;
    year: string;
    pages: string;
    status: string;
    featured: string;
    createdAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    actions: string;
    viewDetails: string;
    edit: string;
    delete: string;
  };
  table: {
    noCatalogs: string;
    dataUpdated: string;
    searchPlaceholder: string;
  };
  actions: {
    createCatalog: string;
  };
  catalogForm: {
    createTitle: string;
    editTitle: string;
    title: string;
    titlePlaceholder: string;
    year: string;
    yearPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    coverImage: string;
    pages: string;
    addPage: string;
    dragToReorder: string;
    isActive: string;
    isFeatured: string;
    save: string;
    saving: string;
    cancel: string;
    uploadCover: string;
    removeCover: string;
    page: string;
  };
  deleteDialog: {
    title: string;
    description: string;
    cancel: string;
    delete: string;
    deleting: string;
    warning: string;
  };
  catalogDetails: {
    title: string;
    catalogTitle: string;
    year: string;
    description: string;
    status: string;
    featured: string;
    pages: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    noDescription: string;
    noPages: string;
  };
}

interface Pagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

interface Sorting {
  id: string;
  desc: boolean;
}

interface InitialData {
  catalogs: AdminCatalog[];
  stats: AdminCatalogsStats | null;
  years: number[];
  pagination: Pagination;
  sorting: Sorting[];
  filters: {
    search: string;
    status: string;
    year: string;
  };
  error: string | null;
}

interface AdminCatalogsClientProps {
  initialData: InitialData;
  labels: Labels;
  locale: string;
}

const AdminCatalogsHeader = memo(function AdminCatalogsHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </AnimatedSection>
  );
});

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
  isNavigating: boolean;
  retryLabel: string;
}

const ErrorAlert = memo(function ErrorAlert({
  error,
  onRetry,
  isNavigating,
  retryLabel,
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" role="alert" aria-live="assertive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
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
          {retryLabel}
        </Button>
      </AlertDescription>
    </Alert>
  );
});

export function AdminCatalogsClient({
  initialData,
  labels,
  locale,
}: AdminCatalogsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [activeDialog, setActiveDialog] = useState<AdminCatalogsDialogType>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<AdminCatalog | null>(null);
  const [isPending, startActionTransition] = useTransition();
  const [isNavigating, startNavigationTransition] = useTransition();

  const { catalogs, stats, years, pagination, error } = initialData;

  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : DEFAULT_PAGE,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : DEFAULT_PAGE_SIZE,
      sort: getParam("sort") || DEFAULT_SORT,
      sortDir: (getParam("sortDir") || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: getParam("search") || "",
      status: getParam("status") || DEFAULT_STATUS,
      year: getParam("year") || DEFAULT_YEAR,
    };
  }, [searchParams]);

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

      if (newState.status === DEFAULT_STATUS) params.delete(`${PREFIX}_status`);
      else params.set(`${PREFIX}_status`, newState.status);

      if (newState.year === DEFAULT_YEAR) params.delete(`${PREFIX}_year`);
      else params.set(`${PREFIX}_year`, newState.year);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startNavigationTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router, urlState]
  );

  const handlePaginationChange = useCallback(
    (paginationUpdate: { pageIndex: number; pageSize: number }) => {
      navigate({
        page: paginationUpdate.pageIndex + 1,
        pageSize: paginationUpdate.pageSize,
      });
    },
    [navigate]
  );

  const handleSortingChange = useCallback(
    (sorting: Sorting[]) => {
      const newSort = sorting.length > 0 ? sorting[0].id : DEFAULT_SORT;
      const newSortDir = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";
      navigate({
        sort: newSort,
        sortDir: newSortDir,
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
    (filters: AdminCatalogsFilters) => {
      let status = DEFAULT_STATUS;
      if (filters.isFeatured === true) status = "featured";
      else if (filters.isActive === true) status = "active";
      else if (filters.isActive === false) status = "inactive";

      navigate({
        status,
        year: filters.year?.toString() || DEFAULT_YEAR,
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
      status: DEFAULT_STATUS,
      year: DEFAULT_YEAR,
    });
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    router.refresh();
    toast.success(labels.table.dataUpdated);
  }, [router, labels.table.dataUpdated]);

  const openDialog = useCallback(
    (type: AdminCatalogsDialogType, catalog: AdminCatalog | null = null) => {
      if ((type === "catalog-details" || type === "catalog-edit") && catalog) {
        startActionTransition(async () => {
          const result = await getCatalogByIdAction(catalog.id);
          if ("error" in result) {
            toast.error(result.error);
            return;
          }
          setSelectedCatalog(result);
          setActiveDialog(type);
        });
      } else {
        setSelectedCatalog(catalog);
        setActiveDialog(type);
      }
    },
    []
  );

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedCatalog(null);
  }, []);

  const handleSuccess = useCallback(() => {
    closeDialog();
    router.refresh();
  }, [closeDialog, router]);

  const handleDelete = useCallback(() => {
    if (!selectedCatalog) return;

    startActionTransition(async () => {
      const result = await deleteCatalogAction(selectedCatalog.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        closeDialog();
        router.refresh();
      }
    });
  }, [selectedCatalog, closeDialog, router]);

  const handleToggleStatus = useCallback(
    (id: string, isActive: boolean) => {
      startActionTransition(async () => {
        const result = await toggleCatalogStatusAction(id, isActive);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          router.refresh();
        }
      });
    },
    [router]
  );

  const handleToggleFeatured = useCallback(
    (id: string, isFeatured: boolean) => {
      startActionTransition(async () => {
        const result = await toggleCatalogFeaturedAction(id, isFeatured);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          router.refresh();
        }
      });
    },
    [router]
  );

  const actionsRef = useRef({
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleStatus,
    onToggleFeatured: handleToggleFeatured,
    translations: labels.columns,
    locale,
  });
  actionsRef.current = {
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleStatus,
    onToggleFeatured: handleToggleFeatured,
    translations: labels.columns,
    locale,
  };

  const columns = useMemo(
    () => createCatalogColumns(actionsRef.current),
    [labels.columns, locale]
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
    }),
    [urlState.page, urlState.pageSize, pagination.totalRows, pagination.totalPages, handlePaginationChange]
  );

  const sortingState: Sorting[] = useMemo(
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
      placeholder: labels.table.searchPlaceholder,
      showClearButton: true,
    }),
    [urlState.search, handleSearchChange, labels.table.searchPlaceholder]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility,
      onColumnVisibilityChange: setColumnVisibility,
      alwaysVisibleColumns: ["title", "actions"],
    }),
    [columnVisibility]
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
      onRefresh: handleRefresh,
    }),
    [handleRefresh]
  );

  const filtersForComponent: AdminCatalogsFilters = useMemo(
    () => ({
      search: urlState.search || undefined,
      year: urlState.year !== DEFAULT_YEAR ? parseInt(urlState.year, 10) : undefined,
      isActive: urlState.status === "active" ? true : urlState.status === "inactive" ? false : undefined,
      isFeatured: urlState.status === "featured" ? true : undefined,
    }),
    [urlState.search, urlState.status, urlState.year]
  );

  const getRowId = useCallback((row: AdminCatalog) => row.id, []);

  const getSelectedCatalogName = useCallback(() => {
    return selectedCatalog?.title || "";
  }, [selectedCatalog]);

  return (
    <div className="space-y-6">
      <AdminCatalogsHeader title={labels.title} description={labels.description} />

      {error && (
        <AnimatedSection animation="fade-up" delay={50}>
          <ErrorAlert
            error={error}
            onRetry={handleRefresh}
            isNavigating={isNavigating}
            retryLabel="Reintentar"
          />
        </AnimatedSection>
      )}

      <AnimatedSection animation="fade-up" delay={100}>
        <AdminCatalogsStatsSection stats={stats} labels={labels.stats} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AdminCatalogsFiltersSection
              filters={filtersForComponent}
              years={years}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              labels={labels.filters}
            />

            <Button onClick={() => openDialog("catalog-create")}>
              <Plus className="mr-2 h-4 w-4" />
              {labels.actions.createCatalog}
            </Button>
          </div>

          <CustomDataTable
            data={catalogs}
            columns={columns}
            getRowId={getRowId}
            pagination={paginationConfig}
            sorting={sortingConfig}
            filter={filterConfig}
            columnVisibility={columnVisibilityConfig}
            toolbarConfig={toolbarConfig}
            style={STYLE_CONFIG}
            copy={COPY_CONFIG}
            fullscreen={FULLSCREEN_CONFIG}
            isLoading={false}
            isPending={isNavigating || isPending}
            emptyMessage={labels.table.noCatalogs}
          />
        </div>
      </AnimatedSection>

      <CatalogFormDialog
        key={`catalog-form-${activeDialog === "catalog-edit" ? selectedCatalog?.id : "create"}`}
        open={activeDialog === "catalog-create" || activeDialog === "catalog-edit"}
        onOpenChange={(open) => !open && closeDialog()}
        catalog={activeDialog === "catalog-edit" ? selectedCatalog : null}
        labels={labels.catalogForm}
        onSuccess={handleSuccess}
      />

      <DeleteDialog
        open={activeDialog === "catalog-delete"}
        onOpenChange={(open) => !open && closeDialog()}
        catalog={selectedCatalog}
        labels={labels.deleteDialog}
        onSuccess={handleDelete}
      />

      <CatalogDetailsDialog
        open={activeDialog === "catalog-details"}
        catalog={selectedCatalog}
        onClose={closeDialog}
        labels={labels.catalogDetails}
        locale={locale}
      />
    </div>
  );
}
