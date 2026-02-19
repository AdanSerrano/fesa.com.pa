"use client";

import { memo, useCallback, useMemo, useReducer, useRef, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, FolderPlus, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getArticlesAction,
  deleteCategoryAction,
  deleteArticleAction,
  toggleCategoryStatusAction,
  toggleArticleStatusAction,
  toggleCategoryFeaturedAction,
  toggleArticleFeaturedAction,
} from "../actions/admin-news.actions";
import { createCategoryColumns, createArticleColumns } from "../components/columns/admin-news.columns";
import { AdminNewsStatsSection } from "../components/stats/admin-news-stats";
import { AdminNewsFiltersSection } from "../components/filters/admin-news-filters";
import { CategoryFormDialog, ArticleFormDialog, DeleteDialog, CategoryDetailsDialog, ArticleDetailsDialog } from "../components/dialogs";

import type {
  NewsCategory,
  NewsArticle,
  AdminNewsFilters,
  AdminNewsStats,
  AdminNewsPagination,
  AdminNewsSorting,
  AdminNewsDialogType,
  AdminNewsStatus,
  CategoryForSelect,
  GetArticlesResult,
} from "../types/admin-news.types";
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
const PREFIX = "news";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_STATUS = "all";
const DEFAULT_CATEGORY = "all";

interface Labels {
  title: string;
  description: string;
  tabs: { categories: string; articles: string };
  stats: {
    totalCategories: string;
    totalCategoriesDesc: string;
    totalArticles: string;
    totalArticlesDesc: string;
    publishedArticles: string;
    publishedArticlesDesc: string;
    featuredArticles: string;
    featuredArticlesDesc: string;
  };
  filters: {
    status: string;
    allStatuses: string;
    active: string;
    inactive: string;
    featured: string;
    published: string;
    draft: string;
    category: string;
    allCategories: string;
    clearFilters: string;
  };
  columns: {
    name: string;
    title: string;
    category: string;
    status: string;
    featured: string;
    articles: string;
    publishedAt: string;
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
    draft: string;
    published: string;
  };
  table: {
    noCategories: string;
    noArticles: string;
    dataUpdated: string;
    searchPlaceholder: string;
  };
  actions: { createCategory: string; createArticle: string };
  categoryForm: {
    createTitle: string;
    editTitle: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    icon: string;
    iconPlaceholder: string;
    isActive: string;
    isFeatured: string;
    cancel: string;
    save: string;
    saving: string;
  };
  articleForm: {
    createTitle: string;
    editTitle: string;
    category: string;
    selectCategory: string;
    noCategory: string;
    title: string;
    titlePlaceholder: string;
    excerpt: string;
    excerptPlaceholder: string;
    content: string;
    contentPlaceholder: string;
    image: string;
    imagePlaceholder: string;
    additionalImages: string;
    publishedAt: string;
    isActive: string;
    isFeatured: string;
    cancel: string;
    save: string;
    saving: string;
  };
  deleteDialog: {
    categoryTitle: string;
    categoryDescription: string;
    articleTitle: string;
    articleDescription: string;
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
    articles: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    noDescription: string;
  };
  articleDetails: {
    title: string;
    articleTitle: string;
    category: string;
    excerpt: string;
    content: string;
    status: string;
    featured: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    active: string;
    inactive: string;
    yes: string;
    no: string;
    noCategory: string;
    noExcerpt: string;
    noContent: string;
    draft: string;
    published: string;
  };
}

interface InitialData {
  categories: NewsCategory[];
  stats: AdminNewsStats | null;
  pagination: AdminNewsPagination;
  sorting: AdminNewsSorting[];
  filters: AdminNewsFilters;
  error: string | null;
  activeTab: string;
  articles: NewsArticle[];
  articlesPagination: AdminNewsPagination | null;
}

interface AdminNewsClientProps {
  initialData: InitialData;
  categoriesForSelect: CategoryForSelect[];
  labels: Labels;
  locale: string;
}

const AdminNewsHeader = memo(function AdminNewsHeader({
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

interface NewsDialogState {
  activeDialog: AdminNewsDialogType;
  selectedCategory: NewsCategory | null;
  selectedArticle: NewsArticle | null;
}

type NewsDialogAction =
  | { type: "OPEN"; dialog: AdminNewsDialogType; category?: NewsCategory | null; article?: NewsArticle | null }
  | { type: "CLOSE" };

function newsDialogReducer(state: NewsDialogState, action: NewsDialogAction): NewsDialogState {
  switch (action.type) {
    case "OPEN":
      return {
        activeDialog: action.dialog,
        selectedCategory: action.category ?? null,
        selectedArticle: action.article ?? null,
      };
    case "CLOSE":
      return { activeDialog: null, selectedCategory: null, selectedArticle: null };
  }
}

interface NewsArticlesState {
  articles: NewsArticle[];
  pagination: AdminNewsPagination;
}

type NewsArticlesAction =
  | { type: "SET"; articles: NewsArticle[]; pagination: AdminNewsPagination };

function newsArticlesReducer(state: NewsArticlesState, action: NewsArticlesAction): NewsArticlesState {
  switch (action.type) {
    case "SET":
      return { articles: action.articles, pagination: action.pagination };
  }
}

export const AdminNewsClient = memo(function AdminNewsClient({
  initialData,
  categoriesForSelect,
  labels,
  locale,
}: AdminNewsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [dialogState, dispatchDialog] = useReducer(newsDialogReducer, {
    activeDialog: null,
    selectedCategory: null,
    selectedArticle: null,
  });
  const [isPending, startActionTransition] = useTransition();
  const [isNavigating, startNavigationTransition] = useTransition();
  const [isLoadingArticles, startArticlesTransition] = useTransition();

  const { categories, stats, pagination, error, articles: initialArticles, articlesPagination: initialArticlesPagination } = initialData;

  const [articlesState, dispatchArticles] = useReducer(newsArticlesReducer, {
    articles: initialArticles,
    pagination: initialArticlesPagination || {
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      totalRows: 0,
      totalPages: 0,
    },
  });

  const articles = articlesState.articles;
  const articlesPagination = articlesState.pagination;

  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : DEFAULT_PAGE,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : DEFAULT_PAGE_SIZE,
      sort: getParam("sort") || DEFAULT_SORT,
      sortDir: (getParam("sortDir") || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: getParam("search") || "",
      status: (getParam("status") || DEFAULT_STATUS) as AdminNewsStatus,
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

  const loadArticles = useCallback(
    (
      page: number = 1,
      pageSize: number = DEFAULT_PAGE_SIZE,
      filters: AdminNewsFilters = { search: "", status: "all", categoryId: "all" },
      sorting: AdminNewsSorting[] = []
    ) => {
      startArticlesTransition(async () => {
        const result = await getArticlesAction({
          page,
          limit: pageSize,
          filters,
          sorting,
        });
        if (result.data && "articles" in result.data) {
          const data = result.data as GetArticlesResult;
          dispatchArticles({
            type: "SET",
            articles: data.articles,
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
      const params = new URLSearchParams(searchParams.toString());
      params.delete(`${PREFIX}_page`);
      params.delete(`${PREFIX}_pageSize`);
      params.delete(`${PREFIX}_sort`);
      params.delete(`${PREFIX}_sortDir`);
      params.delete(`${PREFIX}_search`);
      params.delete(`${PREFIX}_status`);
      params.delete(`${PREFIX}_category`);
      if (tab === "categories") params.delete(`${PREFIX}_tab`);
      else params.set(`${PREFIX}_tab`, tab);
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [searchParams, pathname]
  );

  const handlePaginationChange = useCallback(
    (paginationUpdate: { pageIndex: number; pageSize: number }) => {
      const newPage = paginationUpdate.pageIndex + 1;
      const newPageSize = paginationUpdate.pageSize;
      navigate({
        page: newPage,
        pageSize: newPageSize,
      });
      if (urlState.tab === "articles") {
        loadArticles(
          newPage,
          newPageSize,
          { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadArticles, urlState]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminNewsSorting[]) => {
      const newSort = sorting.length > 0 ? sorting[0].id : DEFAULT_SORT;
      const newSortDir = sorting.length > 0 && sorting[0].desc ? "desc" : "asc";
      navigate({
        sort: newSort,
        sortDir: newSortDir,
        page: 1,
      });
      if (urlState.tab === "articles") {
        loadArticles(
          1,
          urlState.pageSize,
          { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
          [{ id: newSort, desc: newSortDir === "desc" }]
        );
      }
    },
    [navigate, loadArticles, urlState]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      navigate({ search, page: 1 });
      if (urlState.tab === "articles") {
        loadArticles(
          1,
          urlState.pageSize,
          { search, status: urlState.status, categoryId: urlState.categoryId },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadArticles, urlState]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminNewsFilters) => {
      navigate({
        status: filters.status,
        categoryId: filters.categoryId,
        page: 1,
      });
      if (urlState.tab === "articles") {
        loadArticles(
          1,
          urlState.pageSize,
          { search: urlState.search, status: filters.status, categoryId: filters.categoryId },
          urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
        );
      }
    },
    [navigate, loadArticles, urlState]
  );

  const resetFilters = useCallback(() => {
    navigate({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_SORT,
      sortDir: DEFAULT_SORT_DIR as "asc" | "desc",
      search: "",
      status: DEFAULT_STATUS as AdminNewsStatus,
      categoryId: DEFAULT_CATEGORY,
    });
    if (urlState.tab === "articles") {
      loadArticles(
        DEFAULT_PAGE,
        DEFAULT_PAGE_SIZE,
        { search: "", status: "all", categoryId: "all" },
        [{ id: DEFAULT_SORT, desc: DEFAULT_SORT_DIR === "desc" }]
      );
    }
  }, [navigate, loadArticles, urlState.tab]);

  const handleRefresh = useCallback(() => {
    router.refresh();
    if (urlState.tab === "articles") {
      loadArticles(
        urlState.page,
        urlState.pageSize,
        { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
        urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
      );
    }
    toast.success(labels.table.dataUpdated);
  }, [router, loadArticles, urlState, labels.table.dataUpdated]);

  const openDialog = useCallback(
    (type: AdminNewsDialogType, entity: NewsCategory | NewsArticle | null = null) => {
      if (type?.startsWith("category") && entity) {
        dispatchDialog({ type: "OPEN", dialog: type, category: entity as NewsCategory });
      } else if (type?.startsWith("article") && entity) {
        dispatchDialog({ type: "OPEN", dialog: type, article: entity as NewsArticle });
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

  const handleArticleSuccess = useCallback(() => {
    closeDialog();
    router.refresh();
    loadArticles(
      urlState.page,
      urlState.pageSize,
      { search: urlState.search, status: urlState.status, categoryId: urlState.categoryId },
      urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []
    );
  }, [closeDialog, router, loadArticles, urlState]);

  const handleDeleteArticle = useCallback(() => {
    if (!dialogState.selectedArticle) return;
    startActionTransition(async () => {
      const result = await deleteArticleAction(dialogState.selectedArticle!.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        closeDialog();
        router.refresh();
        loadArticles();
      }
    });
  }, [dialogState.selectedArticle, closeDialog, router, loadArticles]);

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

  const handleToggleArticleStatus = useCallback(
    (id: string, isActive: boolean) => {
      startActionTransition(async () => {
        const result = await toggleArticleStatusAction(id, isActive);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          loadArticles();
        }
      });
    },
    [loadArticles]
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

  const handleToggleArticleFeatured = useCallback(
    (id: string, isFeatured: boolean) => {
      startActionTransition(async () => {
        const result = await toggleArticleFeaturedAction(id, isFeatured);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          loadArticles();
        }
      });
    },
    [loadArticles]
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

  const articleActionsRef = useRef({
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleArticleStatus,
    onToggleFeatured: handleToggleArticleFeatured,
    translations: labels.columns,
    locale,
  });
  articleActionsRef.current = {
    onOpenDialog: openDialog,
    onToggleStatus: handleToggleArticleStatus,
    onToggleFeatured: handleToggleArticleFeatured,
    translations: labels.columns,
    locale,
  };

  const articleColumns = useMemo(
    () => createArticleColumns(articleActionsRef.current),
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

  const sortingState: AdminNewsSorting[] = useMemo(
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
      alwaysVisibleColumns: ["name", "title", "actions"],
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

  const filters: AdminNewsFilters = useMemo(
    () => ({
      search: urlState.search,
      status: urlState.status,
      categoryId: urlState.categoryId,
    }),
    [urlState.search, urlState.status, urlState.categoryId]
  );

  const getCategoryRowId = useCallback((row: NewsCategory) => row.id, []);
  const getArticleRowId = useCallback((row: NewsArticle) => row.id, []);

  const getSelectedCategoryName = useCallback(() => {
    return dialogState.selectedCategory?.name || "";
  }, [dialogState.selectedCategory]);

  const getSelectedArticleName = useCallback(() => {
    return dialogState.selectedArticle?.title || "";
  }, [dialogState.selectedArticle]);

  return (
    <div className="space-y-6">
      <AdminNewsHeader title={labels.title} description={labels.description} />

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
        <AdminNewsStatsSection stats={stats} labels={labels.stats} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <Tabs value={urlState.tab} onValueChange={handleTabChange}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="categories">{labels.tabs.categories}</TabsTrigger>
              <TabsTrigger value="articles">{labels.tabs.articles}</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {urlState.tab === "categories" ? (
                <Button onClick={() => openDialog("category-create")}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  {labels.actions.createCategory}
                </Button>
              ) : (
                <Button onClick={() => openDialog("article-create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  {labels.actions.createArticle}
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="categories" className="space-y-4">
            <AdminNewsFiltersSection
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

          <TabsContent value="articles" className="space-y-4">
            <AdminNewsFiltersSection
              filters={filters}
              categories={categoriesForSelect}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              labels={labels.filters}
              showArticleFilters
            />

            <CustomDataTable
              data={articles}
              columns={articleColumns}
              getRowId={getArticleRowId}
              pagination={{
                ...paginationConfig,
                pageIndex: articlesPagination.pageIndex,
                totalRows: articlesPagination.totalRows,
                totalPages: articlesPagination.totalPages,
              }}
              sorting={sortingConfig}
              filter={filterConfig}
              columnVisibility={columnVisibilityConfig}
              toolbarConfig={toolbarConfig}
              style={STYLE_CONFIG}
              copy={COPY_CONFIG}
              fullscreen={FULLSCREEN_CONFIG}
              isLoading={isLoadingArticles}
              isPending={isNavigating || isPending}
              emptyMessage={labels.table.noArticles}
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

      <ArticleFormDialog
        key={`article-form-${dialogState.activeDialog === "article-edit" ? dialogState.selectedArticle?.id : "create"}`}
        open={dialogState.activeDialog === "article-create" || dialogState.activeDialog === "article-edit"}
        article={dialogState.activeDialog === "article-edit" ? dialogState.selectedArticle : null}
        categories={categoriesForSelect}
        onClose={closeDialog}
        onSuccess={handleArticleSuccess}
        labels={labels.articleForm}
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
        open={dialogState.activeDialog === "article-delete"}
        title={labels.deleteDialog.articleTitle}
        description={labels.deleteDialog.articleDescription}
        itemName={getSelectedArticleName()}
        isPending={isPending}
        onClose={closeDialog}
        onConfirm={handleDeleteArticle}
        labels={labels.deleteDialog}
      />

      <CategoryDetailsDialog
        open={dialogState.activeDialog === "category-details"}
        category={dialogState.selectedCategory}
        onClose={closeDialog}
        labels={labels.categoryDetails}
        locale={locale}
      />

      <ArticleDetailsDialog
        open={dialogState.activeDialog === "article-details"}
        article={dialogState.selectedArticle}
        onClose={closeDialog}
        labels={labels.articleDetails}
        locale={locale}
      />
    </div>
  );
});
