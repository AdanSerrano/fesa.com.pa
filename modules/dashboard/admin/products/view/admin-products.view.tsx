import { getTranslations, getLocale } from "next-intl/server";
import { getCategoriesAction, getCategoriesForSelectAction, getItemsAction } from "../actions/admin-products.actions";
import { AdminProductsClient } from "./admin-products.client";
import type { AdminProductsFilters, AdminProductsSorting, AdminProductStatus, AdminProductPriceFilter, AdminProductSkuFilter, GetItemsResult } from "../types/admin-products.types";

interface AdminProductsViewProps {
  searchParams?: {
    products_page?: string;
    products_pageSize?: string;
    products_sort?: string;
    products_sortDir?: string;
    products_search?: string;
    products_status?: string;
    products_category?: string;
    products_priceFilter?: string;
    products_skuFilter?: string;
    products_tab?: string;
  };
}

export async function AdminProductsView({ searchParams }: AdminProductsViewProps) {
  const params = await Promise.resolve(searchParams || {});
  const locale = await getLocale();
  const t = await getTranslations("Admin.products");

  const page = params.products_page ? parseInt(params.products_page, 10) : 1;
  const pageSize = params.products_pageSize ? parseInt(params.products_pageSize, 10) : 10;
  const sort = params.products_sort || "createdAt";
  const sortDir = (params.products_sortDir || "desc") as "asc" | "desc";
  const search = params.products_search || "";
  const status = (params.products_status || "all") as AdminProductStatus;
  const categoryId = params.products_category || "all";
  const priceFilter = (params.products_priceFilter || "all") as AdminProductPriceFilter;
  const skuFilter = (params.products_skuFilter || "all") as AdminProductSkuFilter;
  const activeTab = params.products_tab || "categories";

  const sorting: AdminProductsSorting[] = sort
    ? [{ id: sort, desc: sortDir === "desc" }]
    : [];

  const filters: AdminProductsFilters = {
    search,
    status,
    categoryId,
    priceFilter,
    skuFilter,
  };

  const [result, categoriesForSelect, itemsResult] = await Promise.all([
    getCategoriesAction({
      page,
      limit: pageSize,
      sorting,
      filters,
    }),
    getCategoriesForSelectAction(),
    getItemsAction({
      page,
      limit: pageSize,
      sorting,
      filters,
    }),
  ]);

  const labels = {
    title: t("title"),
    description: t("description"),
    tabs: {
      categories: t("tabs.categories"),
      items: t("tabs.items"),
    },
    stats: {
      totalCategories: t("stats.totalCategories"),
      totalCategoriesDesc: t("stats.totalCategoriesDesc"),
      totalItems: t("stats.totalItems"),
      totalItemsDesc: t("stats.totalItemsDesc"),
      activeCategories: t("stats.activeCategories"),
      activeCategoriesDesc: t("stats.activeCategoriesDesc"),
      activeItems: t("stats.activeItems"),
      activeItemsDesc: t("stats.activeItemsDesc"),
      featuredCategories: t("stats.featuredCategories"),
      featuredCategoriesDesc: t("stats.featuredCategoriesDesc"),
    },
    filters: {
      status: t("filters.status"),
      allStatuses: t("filters.allStatuses"),
      active: t("filters.active"),
      inactive: t("filters.inactive"),
      featured: t("filters.featured"),
      category: t("filters.category"),
      allCategories: t("filters.allCategories"),
      clearFilters: t("filters.clearFilters"),
      price: t("filters.price"),
      allPrices: t("filters.allPrices"),
      withPrice: t("filters.withPrice"),
      withoutPrice: t("filters.withoutPrice"),
      sku: t("filters.sku"),
      allSkus: t("filters.allSkus"),
      withSku: t("filters.withSku"),
      withoutSku: t("filters.withoutSku"),
    },
    columns: {
      name: t("columns.name"),
      category: t("columns.category"),
      status: t("columns.status"),
      featured: t("columns.featured"),
      items: t("columns.items"),
      createdAt: t("columns.createdAt"),
      active: t("columns.active"),
      inactive: t("columns.inactive"),
      yes: t("columns.yes"),
      no: t("columns.no"),
      actions: t("columns.actions"),
      viewDetails: t("columns.viewDetails"),
      edit: t("columns.edit"),
      delete: t("columns.delete"),
      noCategory: t("columns.noCategory"),
      price: t("columns.price"),
      sku: t("columns.sku"),
    },
    table: {
      noCategories: t("table.noCategories"),
      noItems: t("table.noItems"),
      dataUpdated: t("table.dataUpdated"),
      searchPlaceholder: t("table.searchPlaceholder"),
    },
    actions: {
      createCategory: t("actions.createCategory"),
      createItem: t("actions.createItem"),
    },
    categoryForm: {
      createTitle: t("categoryForm.createTitle"),
      editTitle: t("categoryForm.editTitle"),
      name: t("categoryForm.name"),
      namePlaceholder: t("categoryForm.namePlaceholder"),
      description: t("categoryForm.description"),
      descriptionPlaceholder: t("categoryForm.descriptionPlaceholder"),
      image: t("categoryForm.image"),
      imagePlaceholder: t("categoryForm.imagePlaceholder"),
      isActive: t("categoryForm.isActive"),
      isFeatured: t("categoryForm.isFeatured"),
      cancel: t("categoryForm.cancel"),
      save: t("categoryForm.save"),
      saving: t("categoryForm.saving"),
    },
    itemForm: {
      createTitle: t("itemForm.createTitle"),
      editTitle: t("itemForm.editTitle"),
      category: t("itemForm.category"),
      selectCategory: t("itemForm.selectCategory"),
      noCategory: t("itemForm.noCategory"),
      name: t("itemForm.name"),
      namePlaceholder: t("itemForm.namePlaceholder"),
      description: t("itemForm.description"),
      descriptionPlaceholder: t("itemForm.descriptionPlaceholder"),
      image: t("itemForm.image"),
      imagePlaceholder: t("itemForm.imagePlaceholder"),
      isActive: t("itemForm.isActive"),
      price: t("itemForm.price"),
      pricePlaceholder: t("itemForm.pricePlaceholder"),
      sku: t("itemForm.sku"),
      skuPlaceholder: t("itemForm.skuPlaceholder"),
      cancel: t("itemForm.cancel"),
      save: t("itemForm.save"),
      saving: t("itemForm.saving"),
    },
    deleteDialog: {
      categoryTitle: t("deleteDialog.categoryTitle"),
      categoryDescription: t.raw("deleteDialog.categoryDescription"),
      itemTitle: t("deleteDialog.itemTitle"),
      itemDescription: t.raw("deleteDialog.itemDescription"),
      cancel: t("deleteDialog.cancel"),
      delete: t("deleteDialog.delete"),
      deleting: t("deleteDialog.deleting"),
      warning: t("deleteDialog.warning"),
    },
    categoryDetails: {
      title: t("categoryDetails.title"),
      name: t("categoryDetails.name"),
      description: t("categoryDetails.description"),
      status: t("categoryDetails.status"),
      featured: t("categoryDetails.featured"),
      items: t("categoryDetails.items"),
      createdAt: t("categoryDetails.createdAt"),
      updatedAt: t("categoryDetails.updatedAt"),
      active: t("categoryDetails.active"),
      inactive: t("categoryDetails.inactive"),
      yes: t("categoryDetails.yes"),
      no: t("categoryDetails.no"),
      noDescription: t("categoryDetails.noDescription"),
    },
    itemDetails: {
      title: t("itemDetails.title"),
      name: t("itemDetails.name"),
      category: t("itemDetails.category"),
      description: t("itemDetails.description"),
      status: t("itemDetails.status"),
      price: t("itemDetails.price"),
      sku: t("itemDetails.sku"),
      createdAt: t("itemDetails.createdAt"),
      updatedAt: t("itemDetails.updatedAt"),
      active: t("itemDetails.active"),
      inactive: t("itemDetails.inactive"),
      noCategory: t("itemDetails.noCategory"),
      noDescription: t("itemDetails.noDescription"),
      noPrice: t("itemDetails.noPrice"),
      noSku: t("itemDetails.noSku"),
    },
  };

  const categoriesData = result.data as { categories: unknown[]; stats: unknown; pagination: { total: number; totalPages: number } } | undefined;
  const itemsData = itemsResult.data as GetItemsResult | undefined;

  const initialData = {
    categories: categoriesData?.categories || [],
    stats: categoriesData?.stats || null,
    pagination: {
      pageIndex: page - 1,
      pageSize,
      totalRows: categoriesData?.pagination.total || 0,
      totalPages: categoriesData?.pagination.totalPages || 0,
    },
    sorting,
    filters,
    error: result.error || itemsResult.error || null,
    activeTab,
    items: itemsData?.items || [],
    itemsPagination: itemsData
      ? {
          pageIndex: page - 1,
          pageSize,
          totalRows: itemsData.pagination.total,
          totalPages: itemsData.pagination.totalPages,
        }
      : null,
  };

  return (
    <AdminProductsClient
      initialData={initialData as Parameters<typeof AdminProductsClient>[0]["initialData"]}
      categoriesForSelect={categoriesForSelect}
      labels={labels}
      locale={locale}
    />
  );
}
