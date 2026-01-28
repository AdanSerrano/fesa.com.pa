"use client";

import { memo, useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, FolderPlus, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getCategoriesAction,
  getItemsAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  createItemAction,
  updateItemAction,
  deleteItemAction,
  toggleCategoryStatusAction,
  toggleItemStatusAction,
  toggleCategoryFeaturedAction,
} from "../actions/admin-services.actions";
import { createCategoryColumns, createItemColumns } from "../components/columns/admin-services.columns";
import { AdminServicesStatsSection } from "../components/stats/admin-services-stats";
import { AdminServicesFiltersSection } from "../components/filters/admin-services-filters";
import { CategoryFormDialog, ItemFormDialog, DeleteDialog, CategoryDetailsDialog, ItemDetailsDialog } from "../components/dialogs";

import type {
  ServiceCategory,
  ServiceItem,
  AdminServicesFilters,
  AdminServicesStats,
  AdminServicesPagination,
  AdminServicesSorting,
  AdminServicesDialogType,
  AdminServiceStatus,
  CategoryForSelect,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateItemParams,
  UpdateItemParams,
  GetItemsResult,
} from "../types/admin-services.types";
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
const PREFIX = "services";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_STATUS = "all";
const DEFAULT_CATEGORY = "all";

interface Labels {
  title: string;
  description: string;
  tabs: { categories: string; items: string };
  stats: {
    totalCategories: string;
    totalCategoriesDesc: string;
    totalItems: string;
    totalItemsDesc: string;
    activeCategories: string;
    activeCategoriesDesc: string;
    activeItems: string;
    activeItemsDesc: string;
    featuredCategories: string;
    featuredCategoriesDesc: string;
  };
  filters: {
    status: string;
    allStatuses: string;
    active: string;
    inactive: string;
    featured: string;
    category: string;
    allCategories: string;
    clearFilters: string;
  };
  columns: {
    name: string;
    category: string;
    status: string;
    featured: string;
    items: string;
    createdAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    actions: string;
    viewDetails: string;
    edit: string;
    delete: string;
    noCategory: string;
  };
  table: {
    noCategories: string;
    noItems: string;
    dataUpdated: string;
    searchPlaceholder: string;
  };
  actions: { createCategory: string; createItem: string };
  categoryForm: {
    createTitle: string;
    editTitle: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    isActive: string;
    isFeatured: string;
    cancel: string;
    save: string;
    saving: string;
  };
  itemForm: {
    createTitle: string;
    editTitle: string;
    category: string;
    selectCategory: string;
    noCategory: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    isActive: string;
    cancel: string;
    save: string;
    saving: string;
  };
  deleteDialog: {
    categoryTitle: string;
    categoryDescription: string;
    itemTitle: string;
    itemDescription: string;
    cancel: string;
    delete: string;
    deleting: string;
    warning: string;
  };
  categoryDetails: {
    title: string;
    name: string;
    description: string;
    status: string;
    featured: string;
    items: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    noDescription: string;
  };
  itemDetails: {
    title: string;
    name: string;
    category: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    noCategory: string;
    noDescription: string;
  };
}

interface InitialData {
  categories: ServiceCategory[];
  stats: AdminServicesStats | null;
  pagination: AdminServicesPagination;
  sorting: AdminServicesSorting[];
  filters: AdminServicesFilters;
  error: string | null;
  activeTab: string;
  items: ServiceItem[];
  itemsPagination: AdminServicesPagination | null;
}

interface AdminServicesClientProps {
  initialData: InitialData;
  categoriesForSelect: CategoryForSelect[];
  labels: Labels;
  locale: string;
}

const AdminServicesHeader = memo(function AdminServicesHeader({
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

export function AdminServicesClient({
  initialData,
  categoriesForSelect,
  labels,
  locale,
}: AdminServicesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [activeDialog, setActiveDialog] = useState<AdminServicesDialogType>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);
  const [isPending, startActionTransition] = useTransition();
  const [isNavigating, startNavigationTransition] = useTransition();

  const { categories, stats, pagination, error, activeTab, items: initialItems, itemsPagination: initialItemsPagination } = initialData;

  const [items, setItems] = useState<ServiceItem[]>(initialItems);
  const [itemsPagination, setItemsPagination] = useState<AdminServicesPagination>(
    initialItemsPagination || {
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      totalRows: 0,
      totalPages: 0,
    }
  );
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : DEFAULT_PAGE,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : DEFAULT_PAGE_SIZE,
      sort: getParam("sort") || DEFAULT_SORT,
      sortDir: (getParam("sortDir") || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: getParam("search") || "",
      status: (getParam("status") || DEFAULT_STATUS) as AdminServiceStatus,
      categoryId: getParam("category") || DEFAULT_CATEGORY,
      tab: getParam("tab") || "categories",
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

      if (newState.categoryId === DEFAULT_CATEGORY) params.delete(`${PREFIX}_category`);
      else params.set(`${PREFIX}_category`, newState.categoryId);

      if (newState.tab === "categories") params.delete(`${PREFIX}_tab`);
      else params.set(`${PREFIX}_tab`, newState.tab);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startNavigationTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router, urlState]
  );

  const loadItems = useCallback(async (
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    filters: AdminServicesFilters = { search: "", status: "all", categoryId: "all" },
    sorting: AdminServicesSorting[] = []
  ) => {
    setIsLoadingItems(true);
    try {
      const result = await getItemsAction({
        page,
        limit: pageSize,
        filters,
        sorting,
      });
      if (result.data && "items" in result.data) {
        const data = result.data as GetItemsResult;
        setItems(data.items);
        setItemsPagination({
          pageIndex: page - 1,
          pageSize,
          totalRows: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      }
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: string) => {
      navigate({
        tab,
        page: 1,
        search: "",
        status: "all" as AdminServiceStatus,
        categoryId: "all",
      });
      if (tab === "items") {
        loadItems(
          1,
          urlState.pageSize,
          { search: "", status: "all", categoryId: "all" },
          []
        );
      }
    },
    [navigate, loadItems, urlState.pageSize]
  );

  const handlePaginationChange = useCallback(
    (paginationUpdate: { pageIndex: number; pageSize: number }) => {
      const newPage = paginationUpdate.pageIndex + 1;
      const newPageSize = paginationUpdate.pageSize;
      navigate({
        page: newPage,
        pageSize: newPageSize,
      });
      if (urlState.tab === "items") {
        loadItems(
          newPage,
          newPageSize,
          { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadItems, urlState]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminServicesSorting[]) => {
      const newSort = sorting.length > 0 ? sorting[0].id : DEFAULT_SORT;
      const newSortDir = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";
      navigate({
        sort: newSort,
        sortDir: newSortDir,
        page: 1,
      });
      if (urlState.tab === "items") {
        loadItems(
          1,
          urlState.pageSize,
          { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
          [{ id: newSort, desc: newSortDir === "desc" }]
        );
      }
    },
    [navigate, loadItems, urlState]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      navigate({ search, page: 1 });
      if (urlState.tab === "items") {
        loadItems(
          1,
          urlState.pageSize,
          { search, status: urlState.status, categoryId: urlState.categoryId },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadItems, urlState]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminServicesFilters) => {
      navigate({
        status: filters.status,
        categoryId: filters.categoryId,
        page: 1,
      });
      if (urlState.tab === "items") {
        loadItems(
          1,
          urlState.pageSize,
          { search: urlState.search, status: filters.status, categoryId: filters.categoryId },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadItems, urlState]
  );

  const resetFilters = useCallback(() => {
    navigate({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_SORT,
      sortDir: DEFAULT_SORT_DIR as "asc" | "desc",
      search: "",
      status: DEFAULT_STATUS as AdminServiceStatus,
      categoryId: DEFAULT_CATEGORY,
    });
    if (urlState.tab === "items") {
      loadItems(
        DEFAULT_PAGE,
        DEFAULT_PAGE_SIZE,
        { search: "", status: "all", categoryId: "all" },
        [{ id: DEFAULT_SORT, desc: DEFAULT_SORT_DIR === "desc" }]
      );
    }
  }, [navigate, loadItems, urlState.tab]);

  const handleRefresh = useCallback(() => {
    router.refresh();
    if (urlState.tab === "items") {
      loadItems(
        urlState.page,
        urlState.pageSize,
        { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
        urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
      );
    }
    toast.success(labels.table.dataUpdated);
  }, [router, loadItems, urlState, labels.table.dataUpdated]);

  const openDialog = useCallback(
    (type: AdminServicesDialogType, entity: ServiceCategory | ServiceItem | null = null) => {
      setActiveDialog(type);
      if (type?.startsWith("category") && entity) {
        setSelectedCategory(entity as ServiceCategory);
        setSelectedItem(null);
      } else if (type?.startsWith("item") && entity) {
        setSelectedItem(entity as ServiceItem);
        setSelectedCategory(null);
      } else {
        setSelectedCategory(null);
        setSelectedItem(null);
      }
    },
    []
  );

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedCategory(null);
    setSelectedItem(null);
  }, []);

  const handleCreateCategory = useCallback(
    (data: CreateCategoryParams) => {
      startActionTransition(async () => {
        const result = await createCategoryAction(data);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      });
    },
    [closeDialog, router]
  );

  const handleUpdateCategory = useCallback(
    (data: UpdateCategoryParams) => {
      startActionTransition(async () => {
        const result = await updateCategoryAction(data);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      });
    },
    [closeDialog, router]
  );

  const handleDeleteCategory = useCallback(() => {
    if (!selectedCategory) return;
    startActionTransition(async () => {
      const result = await deleteCategoryAction(selectedCategory.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        closeDialog();
        router.refresh();
      }
    });
  }, [selectedCategory, closeDialog, router]);

  const handleCreateItem = useCallback(
    (data: CreateItemParams) => {
      startActionTransition(async () => {
        const result = await createItemAction(data);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
          loadItems();
        }
      });
    },
    [closeDialog, router, loadItems]
  );

  const handleUpdateItem = useCallback(
    (data: UpdateItemParams) => {
      startActionTransition(async () => {
        const result = await updateItemAction(data);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
          loadItems();
        }
      });
    },
    [closeDialog, router, loadItems]
  );

  const handleDeleteItem = useCallback(() => {
    if (!selectedItem) return;
    startActionTransition(async () => {
      const result = await deleteItemAction(selectedItem.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        closeDialog();
        router.refresh();
        loadItems();
      }
    });
  }, [selectedItem, closeDialog, router, loadItems]);

  const handleToggleCategoryStatus = useCallback(
    (id: string, isActive: boolean) => {
      startActionTransition(async () => {
        const result = await toggleCategoryStatusAction(id, isActive);
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

  const handleToggleItemStatus = useCallback(
    (id: string, isActive: boolean) => {
      startActionTransition(async () => {
        const result = await toggleItemStatusAction(id, isActive);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          loadItems();
        }
      });
    },
    [loadItems]
  );

  const handleToggleCategoryFeatured = useCallback(
    (id: string, isFeatured: boolean) => {
      startActionTransition(async () => {
        const result = await toggleCategoryFeaturedAction(id, isFeatured);
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
    onToggleStatus: handleToggleCategoryStatus,
    onToggleFeatured: handleToggleCategoryFeatured,
    translations: labels.columns,
    locale,
  });
  actionsRef.current = {
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleCategoryStatus,
    onToggleFeatured: handleToggleCategoryFeatured,
    translations: labels.columns,
    locale,
  };

  const categoryColumns = useMemo(
    () => createCategoryColumns(actionsRef.current),
    [labels.columns, locale]
  );

  const itemActionsRef = useRef({
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleItemStatus,
    translations: labels.columns,
    locale,
  });
  itemActionsRef.current = {
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleItemStatus,
    translations: labels.columns,
    locale,
  };

  const itemColumns = useMemo(
    () => createItemColumns(itemActionsRef.current),
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

  const sortingState: AdminServicesSorting[] = useMemo(
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
      alwaysVisibleColumns: ["name", "actions"],
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

  const filters: AdminServicesFilters = useMemo(
    () => ({
      search: urlState.search,
      status: urlState.status,
      categoryId: urlState.categoryId,
    }),
    [urlState.search, urlState.status, urlState.categoryId]
  );

  const getCategoryRowId = useCallback((row: ServiceCategory) => row.id, []);
  const getItemRowId = useCallback((row: ServiceItem) => row.id, []);

  const getSelectedCategoryName = useCallback(() => {
    return selectedCategory?.name || "";
  }, [selectedCategory]);

  const getSelectedItemName = useCallback(() => {
    return selectedItem?.name || "";
  }, [selectedItem]);

  return (
    <div className="space-y-6">
      <AdminServicesHeader title={labels.title} description={labels.description} />

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
        <AdminServicesStatsSection stats={stats} labels={labels.stats} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <Tabs value={urlState.tab} onValueChange={handleTabChange}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="categories">{labels.tabs.categories}</TabsTrigger>
              <TabsTrigger value="items">{labels.tabs.items}</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {urlState.tab === "categories" ? (
                <Button onClick={() => openDialog("category-create")}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  {labels.actions.createCategory}
                </Button>
              ) : (
                <Button onClick={() => openDialog("item-create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  {labels.actions.createItem}
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="categories" className="space-y-4">
            <AdminServicesFiltersSection
              filters={filters}
              categories={[]}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              labels={labels.filters}
            />

            <CustomDataTable
              data={categories}
              columns={categoryColumns}
              getRowId={getCategoryRowId}
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
              emptyMessage={labels.table.noCategories}
            />
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <AdminServicesFiltersSection
              filters={filters}
              categories={categoriesForSelect}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              labels={labels.filters}
            />

            <CustomDataTable
              data={items}
              columns={itemColumns}
              getRowId={getItemRowId}
              pagination={{
                ...paginationConfig,
                pageIndex: itemsPagination.pageIndex,
                totalRows: itemsPagination.totalRows,
                totalPages: itemsPagination.totalPages,
              }}
              sorting={sortingConfig}
              filter={filterConfig}
              columnVisibility={columnVisibilityConfig}
              toolbarConfig={toolbarConfig}
              style={STYLE_CONFIG}
              copy={COPY_CONFIG}
              fullscreen={FULLSCREEN_CONFIG}
              isLoading={isLoadingItems}
              isPending={isNavigating || isPending}
              emptyMessage={labels.table.noItems}
            />
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      <CategoryFormDialog
        key={`category-form-${activeDialog === "category-edit" ? selectedCategory?.id : "create"}`}
        open={activeDialog === "category-create" || activeDialog === "category-edit"}
        category={activeDialog === "category-edit" ? selectedCategory : null}
        isPending={isPending}
        onClose={closeDialog}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        labels={labels.categoryForm}
      />

      <ItemFormDialog
        key={`item-form-${activeDialog === "item-edit" ? selectedItem?.id : "create"}`}
        open={activeDialog === "item-create" || activeDialog === "item-edit"}
        item={activeDialog === "item-edit" ? selectedItem : null}
        categories={categoriesForSelect}
        isPending={isPending}
        onClose={closeDialog}
        onCreate={handleCreateItem}
        onUpdate={handleUpdateItem}
        labels={labels.itemForm}
      />

      <DeleteDialog
        open={activeDialog === "category-delete"}
        title={labels.deleteDialog.categoryTitle}
        description={labels.deleteDialog.categoryDescription}
        itemName={getSelectedCategoryName()}
        isPending={isPending}
        onClose={closeDialog}
        onConfirm={handleDeleteCategory}
        labels={labels.deleteDialog}
      />

      <DeleteDialog
        open={activeDialog === "item-delete"}
        title={labels.deleteDialog.itemTitle}
        description={labels.deleteDialog.itemDescription}
        itemName={getSelectedItemName()}
        isPending={isPending}
        onClose={closeDialog}
        onConfirm={handleDeleteItem}
        labels={labels.deleteDialog}
      />

      <CategoryDetailsDialog
        open={activeDialog === "category-details"}
        category={selectedCategory}
        onClose={closeDialog}
        labels={labels.categoryDetails}
        locale={locale}
      />

      <ItemDetailsDialog
        open={activeDialog === "item-details"}
        item={selectedItem}
        onClose={closeDialog}
        labels={labels.itemDetails}
        locale={locale}
      />
    </div>
  );
}
