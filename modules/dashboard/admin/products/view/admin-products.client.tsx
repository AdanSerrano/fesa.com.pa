"use client";

import { memo, useCallback, useMemo, useReducer, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, FolderOpen, FolderPlus, Package, Plus, RefreshCw, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getItemsAction,
  deleteCategoryAction,
  deleteItemAction,
  toggleCategoryStatusAction,
  toggleItemStatusAction,
  toggleCategoryFeaturedAction,
} from "../actions/admin-products.actions";
import { createCategoryColumns, createItemColumns } from "../components/columns/admin-products.columns";
import { AdminStatsSection } from "../../_shared/components/stats/admin-stats-section";
import type { StatConfig } from "../../_shared/components/stats/admin-stats-section";
import { AdminFiltersSection } from "../../_shared/components/filters/admin-filters-section";
import { CategoryFormDialog, ItemFormDialog, DeleteDialog, CategoryDetailsDialog, ItemDetailsDialog } from "../components/dialogs";

import type {
  ProductCategory,
  ProductItem,
  AdminProductsFilters,
  AdminProductsStats,
  AdminProductsPagination,
  AdminProductsSorting,
  AdminProductsDialogType,
  AdminProductStatus,
  AdminProductPriceFilter,
  AdminProductSkuFilter,
  CategoryForSelect,
  GetItemsResult,
} from "../types/admin-products.types";
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
const PREFIX = "products";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_STATUS = "all";
const DEFAULT_CATEGORY = "all";
const DEFAULT_PRICE_FILTER = "all";
const DEFAULT_SKU_FILTER = "all";

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
    price: string;
    allPrices: string;
    withPrice: string;
    withoutPrice: string;
    sku: string;
    allSkus: string;
    withSku: string;
    withoutSku: string;
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
    price: string;
    sku: string;
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
    price: string;
    pricePlaceholder: string;
    sku: string;
    skuPlaceholder: string;
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
    price: string;
    sku: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    noCategory: string;
    noDescription: string;
    noPrice: string;
    noSku: string;
  };
}

interface InitialData {
  categories: ProductCategory[];
  stats: AdminProductsStats | null;
  pagination: AdminProductsPagination;
  sorting: AdminProductsSorting[];
  filters: AdminProductsFilters;
  error: string | null;
  activeTab: string;
  items: ProductItem[];
  itemsPagination: AdminProductsPagination | null;
}

interface AdminProductsClientProps {
  initialData: InitialData;
  categoriesForSelect: CategoryForSelect[];
  labels: Labels;
  locale: string;
}

const AdminProductsHeader = memo(function AdminProductsHeader({
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

interface ProductsDialogState {
  activeDialog: AdminProductsDialogType;
  selectedCategory: ProductCategory | null;
  selectedItem: ProductItem | null;
}

type ProductsDialogAction =
  | { type: "OPEN"; dialog: AdminProductsDialogType; category?: ProductCategory | null; item?: ProductItem | null }
  | { type: "CLOSE" };

function productsDialogReducer(state: ProductsDialogState, action: ProductsDialogAction): ProductsDialogState {
  switch (action.type) {
    case "OPEN":
      return {
        activeDialog: action.dialog,
        selectedCategory: action.category ?? null,
        selectedItem: action.item ?? null,
      };
    case "CLOSE":
      return { activeDialog: null, selectedCategory: null, selectedItem: null };
  }
}

interface ProductsItemsState {
  items: ProductItem[];
  pagination: AdminProductsPagination;
}

type ProductsItemsAction =
  | { type: "SET"; items: ProductItem[]; pagination: AdminProductsPagination };

function productsItemsReducer(state: ProductsItemsState, action: ProductsItemsAction): ProductsItemsState {
  switch (action.type) {
    case "SET":
      return { items: action.items, pagination: action.pagination };
  }
}

export const AdminProductsClient = memo(function AdminProductsClient({
  initialData,
  categoriesForSelect,
  labels,
  locale,
}: AdminProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [dialogState, dispatchDialog] = useReducer(productsDialogReducer, {
    activeDialog: null,
    selectedCategory: null,
    selectedItem: null,
  });
  const [isPending, startActionTransition] = useTransition();
  const [isNavigating, startNavigationTransition] = useTransition();
  const [isLoadingItems, startItemsTransition] = useTransition();

  const { categories, stats, pagination, error, items: initialItems, itemsPagination: initialItemsPagination } = initialData;

  const [itemsState, dispatchItems] = useReducer(productsItemsReducer, {
    items: initialItems,
    pagination: initialItemsPagination || {
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      totalRows: 0,
      totalPages: 0,
    },
  });

  const items = itemsState.items;
  const itemsPagination = itemsState.pagination;

  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : DEFAULT_PAGE,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : DEFAULT_PAGE_SIZE,
      sort: getParam("sort") || DEFAULT_SORT,
      sortDir: (getParam("sortDir") || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: getParam("search") || "",
      status: (getParam("status") || DEFAULT_STATUS) as AdminProductStatus,
      categoryId: getParam("category") || DEFAULT_CATEGORY,
      priceFilter: (getParam("priceFilter") || DEFAULT_PRICE_FILTER) as AdminProductPriceFilter,
      skuFilter: (getParam("skuFilter") || DEFAULT_SKU_FILTER) as AdminProductSkuFilter,
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

      if (newState.priceFilter === DEFAULT_PRICE_FILTER) params.delete(`${PREFIX}_priceFilter`);
      else params.set(`${PREFIX}_priceFilter`, newState.priceFilter);

      if (newState.skuFilter === DEFAULT_SKU_FILTER) params.delete(`${PREFIX}_skuFilter`);
      else params.set(`${PREFIX}_skuFilter`, newState.skuFilter);

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

  const loadItems = useCallback(
    (
      page: number = 1,
      pageSize: number = DEFAULT_PAGE_SIZE,
      filters: AdminProductsFilters = { search: "", status: "all", categoryId: "all", priceFilter: "all", skuFilter: "all" },
      sorting: AdminProductsSorting[] = []
    ) => {
      startItemsTransition(async () => {
        const result = await getItemsAction({
          page,
          limit: pageSize,
          filters,
          sorting,
        });
        if (result.data && "items" in result.data) {
          const data = result.data as GetItemsResult;
          dispatchItems({
            type: "SET",
            items: data.items,
            pagination: {
              pageIndex: page - 1,
              pageSize,
              totalRows: data.pagination.total,
              totalPages: data.pagination.totalPages,
            },
          });
        }
      });
    },
    []
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      navigate({
        tab,
        page: 1,
        search: "",
        status: "all" as AdminProductStatus,
        categoryId: "all",
        priceFilter: "all" as AdminProductPriceFilter,
        skuFilter: "all" as AdminProductSkuFilter,
      });
    },
    [navigate]
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
          { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId, priceFilter: urlState.priceFilter, skuFilter: urlState.skuFilter },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadItems, urlState]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminProductsSorting[]) => {
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
          { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId, priceFilter: urlState.priceFilter, skuFilter: urlState.skuFilter },
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
          { search, status: urlState.status, categoryId: urlState.categoryId, priceFilter: urlState.priceFilter, skuFilter: urlState.skuFilter },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadItems, urlState]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminProductsFilters) => {
      navigate({
        status: filters.status,
        categoryId: filters.categoryId,
        priceFilter: filters.priceFilter,
        skuFilter: filters.skuFilter,
        page: 1,
      });
      if (urlState.tab === "items") {
        loadItems(
          1,
          urlState.pageSize,
          { search: urlState.search, status: filters.status, categoryId: filters.categoryId, priceFilter: filters.priceFilter, skuFilter: filters.skuFilter },
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
      status: DEFAULT_STATUS as AdminProductStatus,
      categoryId: DEFAULT_CATEGORY,
      priceFilter: DEFAULT_PRICE_FILTER as AdminProductPriceFilter,
      skuFilter: DEFAULT_SKU_FILTER as AdminProductSkuFilter,
    });
    if (urlState.tab === "items") {
      loadItems(
        DEFAULT_PAGE,
        DEFAULT_PAGE_SIZE,
        { search: "", status: "all", categoryId: "all", priceFilter: "all", skuFilter: "all" },
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
        { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId, priceFilter: urlState.priceFilter, skuFilter: urlState.skuFilter },
        urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
      );
    }
    toast.success(labels.table.dataUpdated);
  }, [router, loadItems, urlState, labels.table.dataUpdated]);

  const openDialog = useCallback(
    (type: AdminProductsDialogType, entity: ProductCategory | ProductItem | null = null) => {
      if (type?.startsWith("category") && entity) {
        dispatchDialog({ type: "OPEN", dialog: type, category: entity as ProductCategory });
      } else if (type?.startsWith("item") && entity) {
        dispatchDialog({ type: "OPEN", dialog: type, item: entity as ProductItem });
      } else {
        dispatchDialog({ type: "OPEN", dialog: type });
      }
    },
    []
  );

  const closeDialog = useCallback(() => {
    dispatchDialog({ type: "CLOSE" });
  }, []);

  const handleCategorySuccess = useCallback(() => {
    closeDialog();
    router.refresh();
  }, [closeDialog, router]);

  const handleDeleteCategory = useCallback(() => {
    if (!dialogState.selectedCategory) return;
    startActionTransition(async () => {
      const result = await deleteCategoryAction(dialogState.selectedCategory!.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        closeDialog();
        router.refresh();
      }
    });
  }, [dialogState.selectedCategory, closeDialog, router]);

  const handleItemSuccess = useCallback(() => {
    closeDialog();
    router.refresh();
    loadItems(
      urlState.page,
      urlState.pageSize,
      { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId, priceFilter: urlState.priceFilter, skuFilter: urlState.skuFilter },
      urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
    );
  }, [closeDialog, router, loadItems, urlState]);

  const handleDeleteItem = useCallback(() => {
    if (!dialogState.selectedItem) return;
    startActionTransition(async () => {
      const result = await deleteItemAction(dialogState.selectedItem!.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        closeDialog();
        router.refresh();
        loadItems();
      }
    });
  }, [dialogState.selectedItem, closeDialog, router, loadItems]);

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

  const sortingState: AdminProductsSorting[] = useMemo(
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

  const filters: AdminProductsFilters = useMemo(
    () => ({
      search: urlState.search,
      status: urlState.status,
      categoryId: urlState.categoryId,
      priceFilter: urlState.priceFilter,
      skuFilter: urlState.skuFilter,
    }),
    [urlState.search, urlState.status, urlState.categoryId, urlState.priceFilter, urlState.skuFilter]
  );

  const statConfigs: StatConfig[] = useMemo(() => {
    if (!stats) return [];
    return [
      { title: labels.stats.totalCategories, value: stats.totalCategories, description: labels.stats.totalCategoriesDesc, icon: <FolderOpen className="h-4 w-4" /> },
      { title: labels.stats.totalItems, value: stats.totalItems, description: labels.stats.totalItemsDesc, icon: <Package className="h-4 w-4" /> },
      { title: labels.stats.activeCategories, value: stats.activeCategories, description: labels.stats.activeCategoriesDesc, icon: <CheckCircle className="h-4 w-4" />, variant: "success" },
      { title: labels.stats.activeItems, value: stats.activeItems, description: labels.stats.activeItemsDesc, icon: <ShoppingCart className="h-4 w-4" />, variant: "success" },
      { title: labels.stats.featuredCategories, value: stats.featuredCategories, description: labels.stats.featuredCategoriesDesc, icon: <Star className="h-4 w-4" />, variant: "warning" },
    ];
  }, [stats, labels.stats]);

  const getCategoryRowId = useCallback((row: ProductCategory) => row.id, []);
  const getItemRowId = useCallback((row: ProductItem) => row.id, []);

  const getSelectedCategoryName = useCallback(() => {
    return dialogState.selectedCategory?.name || "";
  }, [dialogState.selectedCategory]);

  const getSelectedItemName = useCallback(() => {
    return dialogState.selectedItem?.name || "";
  }, [dialogState.selectedItem]);

  return (
    <div className="space-y-6">
      <AdminProductsHeader title={labels.title} description={labels.description} />

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
        <AdminStatsSection stats={stats} statConfigs={statConfigs} />
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
            <AdminFiltersSection
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
            <AdminFiltersSection
              filters={filters}
              categories={categoriesForSelect}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              labels={labels.filters}
              showProductFilters
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
        key={`category-form-${dialogState.activeDialog === "category-edit" ? dialogState.selectedCategory?.id : "create"}`}
        open={dialogState.activeDialog === "category-create" || dialogState.activeDialog === "category-edit"}
        category={dialogState.activeDialog === "category-edit" ? dialogState.selectedCategory : null}
        onClose={closeDialog}
        onSuccess={handleCategorySuccess}
        labels={labels.categoryForm}
      />

      <ItemFormDialog
        key={`item-form-${dialogState.activeDialog === "item-edit" ? dialogState.selectedItem?.id : "create"}`}
        open={dialogState.activeDialog === "item-create" || dialogState.activeDialog === "item-edit"}
        item={dialogState.activeDialog === "item-edit" ? dialogState.selectedItem : null}
        categories={categoriesForSelect}
        onClose={closeDialog}
        onSuccess={handleItemSuccess}
        labels={labels.itemForm}
      />

      <DeleteDialog
        open={dialogState.activeDialog === "category-delete"}
        title={labels.deleteDialog.categoryTitle}
        description={labels.deleteDialog.categoryDescription}
        itemName={getSelectedCategoryName()}
        isPending={isPending}
        onClose={closeDialog}
        onConfirm={handleDeleteCategory}
        labels={labels.deleteDialog}
      />

      <DeleteDialog
        open={dialogState.activeDialog === "item-delete"}
        title={labels.deleteDialog.itemTitle}
        description={labels.deleteDialog.itemDescription}
        itemName={getSelectedItemName()}
        isPending={isPending}
        onClose={closeDialog}
        onConfirm={handleDeleteItem}
        labels={labels.deleteDialog}
      />

      <CategoryDetailsDialog
        open={dialogState.activeDialog === "category-details"}
        category={dialogState.selectedCategory}
        onClose={closeDialog}
        labels={labels.categoryDetails}
        locale={locale}
      />

      <ItemDetailsDialog
        open={dialogState.activeDialog === "item-details"}
        item={dialogState.selectedItem}
        onClose={closeDialog}
        labels={labels.itemDetails}
        locale={locale}
      />
    </div>
  );
});
