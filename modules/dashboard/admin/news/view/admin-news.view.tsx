import { getTranslations, getLocale } from "next-intl/server";
import { getCategoriesAction, getArticlesAction, getCategoriesForSelectAction } from "../actions/admin-news.actions";
import { AdminNewsClient } from "./admin-news.client";
import type { AdminNewsFilters, AdminNewsSorting, AdminNewsStatus, GetCategoriesResult, GetArticlesResult } from "../types/admin-news.types";

interface AdminNewsViewProps {
  searchParams?: {
    news_page?: string;
    news_pageSize?: string;
    news_sort?: string;
    news_sortDir?: string;
    news_search?: string;
    news_status?: string;
    news_category?: string;
    news_tab?: string;
  };
}

export async function AdminNewsView({ searchParams }: AdminNewsViewProps) {
  const params = await Promise.resolve(searchParams || {});
  const t = await getTranslations("Admin.news");
  const locale = await getLocale();

  const page = params.news_page ? parseInt(params.news_page, 10) : 1;
  const pageSize = params.news_pageSize ? parseInt(params.news_pageSize, 10) : 10;
  const sort = params.news_sort || "createdAt";
  const sortDir = (params.news_sortDir || "desc") as "asc" | "desc";
  const search = params.news_search || "";
  const status = (params.news_status || "all") as AdminNewsStatus;
  const categoryId = params.news_category || "all";
  const activeTab = params.news_tab || "categories";

  const sorting: AdminNewsSorting[] = sort
    ? [{ id: sort, desc: sortDir === "desc" }]
    : [];

  const filters: AdminNewsFilters = {
    search,
    status,
    categoryId,
  };

  const [categoriesResult, articlesResult, categoriesForSelect] = await Promise.all([
    getCategoriesAction({
      page,
      limit: pageSize,
      sorting,
      filters,
    }),
    getArticlesAction({
      page,
      limit: pageSize,
      sorting,
      filters,
    }),
    getCategoriesForSelectAction(),
  ]);

  const categoriesData = categoriesResult.data as GetCategoriesResult | undefined;
  const articlesData = articlesResult.data as GetArticlesResult | undefined;

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
    error: categoriesResult.error || articlesResult.error || null,
    activeTab,
    articles: articlesData?.articles || [],
    articlesPagination: articlesData ? {
      pageIndex: page - 1,
      pageSize,
      totalRows: articlesData.pagination.total,
      totalPages: articlesData.pagination.totalPages,
    } : null,
  };

  const labels = {
    title: t("title"),
    description: t("description"),
    tabs: {
      categories: t("tabs.categories"),
      articles: t("tabs.articles"),
    },
    stats: {
      totalCategories: t("stats.totalCategories"),
      totalCategoriesDesc: t("stats.totalCategoriesDesc"),
      totalArticles: t("stats.totalArticles"),
      totalArticlesDesc: t("stats.totalArticlesDesc"),
      publishedArticles: t("stats.publishedArticles"),
      publishedArticlesDesc: t("stats.publishedArticlesDesc"),
      featuredArticles: t("stats.featuredArticles"),
      featuredArticlesDesc: t("stats.featuredArticlesDesc"),
    },
    filters: {
      status: t("filters.status"),
      allStatuses: t("filters.allStatuses"),
      active: t("filters.active"),
      inactive: t("filters.inactive"),
      featured: t("filters.featured"),
      published: t("filters.published"),
      draft: t("filters.draft"),
      category: t("filters.category"),
      allCategories: t("filters.allCategories"),
      clearFilters: t("filters.clearFilters"),
    },
    columns: {
      name: t("columns.name"),
      title: t("columns.title"),
      category: t("columns.category"),
      status: t("columns.status"),
      featured: t("columns.featured"),
      articles: t("columns.articles"),
      publishedAt: t("columns.publishedAt"),
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
      draft: t("columns.draft"),
      published: t("columns.published"),
    },
    table: {
      noCategories: t("table.noCategories"),
      noArticles: t("table.noArticles"),
      dataUpdated: t("table.dataUpdated"),
      searchPlaceholder: t("table.searchPlaceholder"),
    },
    actions: {
      createCategory: t("actions.createCategory"),
      createArticle: t("actions.createArticle"),
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
      icon: t("categoryForm.icon"),
      iconPlaceholder: t("categoryForm.iconPlaceholder"),
      isActive: t("categoryForm.isActive"),
      isFeatured: t("categoryForm.isFeatured"),
      cancel: t("categoryForm.cancel"),
      save: t("categoryForm.save"),
      saving: t("categoryForm.saving"),
    },
    articleForm: {
      createTitle: t("articleForm.createTitle"),
      editTitle: t("articleForm.editTitle"),
      category: t("articleForm.category"),
      selectCategory: t("articleForm.selectCategory"),
      noCategory: t("articleForm.noCategory"),
      title: t("articleForm.title"),
      titlePlaceholder: t("articleForm.titlePlaceholder"),
      excerpt: t("articleForm.excerpt"),
      excerptPlaceholder: t("articleForm.excerptPlaceholder"),
      content: t("articleForm.content"),
      contentPlaceholder: t("articleForm.contentPlaceholder"),
      image: t("articleForm.image"),
      imagePlaceholder: t("articleForm.imagePlaceholder"),
      additionalImages: t("articleForm.additionalImages"),
      publishedAt: t("articleForm.publishedAt"),
      isActive: t("articleForm.isActive"),
      isFeatured: t("articleForm.isFeatured"),
      cancel: t("articleForm.cancel"),
      save: t("articleForm.save"),
      saving: t("articleForm.saving"),
    },
    deleteDialog: {
      categoryTitle: t("deleteDialog.categoryTitle"),
      categoryDescription: t.raw("deleteDialog.categoryDescription"),
      articleTitle: t("deleteDialog.articleTitle"),
      articleDescription: t.raw("deleteDialog.articleDescription"),
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
      articles: t("categoryDetails.articles"),
      createdAt: t("categoryDetails.createdAt"),
      updatedAt: t("categoryDetails.updatedAt"),
      active: t("categoryDetails.active"),
      inactive: t("categoryDetails.inactive"),
      yes: t("categoryDetails.yes"),
      no: t("categoryDetails.no"),
      noDescription: t("categoryDetails.noDescription"),
    },
    articleDetails: {
      title: t("articleDetails.title"),
      articleTitle: t("articleDetails.articleTitle"),
      category: t("articleDetails.category"),
      excerpt: t("articleDetails.excerpt"),
      content: t("articleDetails.content"),
      status: t("articleDetails.status"),
      featured: t("articleDetails.featured"),
      publishedAt: t("articleDetails.publishedAt"),
      createdAt: t("articleDetails.createdAt"),
      updatedAt: t("articleDetails.updatedAt"),
      active: t("articleDetails.active"),
      inactive: t("articleDetails.inactive"),
      yes: t("articleDetails.yes"),
      no: t("articleDetails.no"),
      noCategory: t("articleDetails.noCategory"),
      noExcerpt: t("articleDetails.noExcerpt"),
      noContent: t("articleDetails.noContent"),
      draft: t("articleDetails.draft"),
      published: t("articleDetails.published"),
    },
  };

  return (
    <AdminNewsClient
      initialData={initialData}
      categoriesForSelect={categoriesForSelect}
      labels={labels}
      locale={locale}
    />
  );
}
