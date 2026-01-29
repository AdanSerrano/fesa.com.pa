import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { getCatalogsAction } from "../actions/admin-catalogs.actions";
import { AdminCatalogsClient } from "./admin-catalogs.client";
import { AdminCatalogsSkeleton } from "../components/admin-catalogs.skeleton";
import type { AdminCatalogsFilters, AdminCatalogsSorting } from "../types/admin-catalogs.types";

interface AdminCatalogsViewProps {
  searchParams?: {
    catalogs_page?: string;
    catalogs_pageSize?: string;
    catalogs_sort?: string;
    catalogs_sortDir?: string;
    catalogs_search?: string;
    catalogs_status?: string;
    catalogs_year?: string;
  };
}

export async function AdminCatalogsView({ searchParams }: AdminCatalogsViewProps) {
  const params = await Promise.resolve(searchParams || {});
  const t = await getTranslations("Admin.catalogs");
  const locale = await getLocale();

  const page = params.catalogs_page ? parseInt(params.catalogs_page, 10) : 1;
  const pageSize = params.catalogs_pageSize ? parseInt(params.catalogs_pageSize, 10) : 10;
  const sort = params.catalogs_sort || "year";
  const sortDir = (params.catalogs_sortDir || "desc") as "asc" | "desc";
  const search = params.catalogs_search || "";
  const status = params.catalogs_status || "all";
  const yearParam = params.catalogs_year;

  const sorting: AdminCatalogsSorting[] = sort
    ? [{ field: sort, direction: sortDir }]
    : [];

  const filters: AdminCatalogsFilters = {
    search: search || undefined,
    year: yearParam && yearParam !== "all" ? parseInt(yearParam, 10) : undefined,
    isActive: status === "active" ? true : status === "inactive" ? false : undefined,
    isFeatured: status === "featured" ? true : undefined,
  };

  const result = await getCatalogsAction({
    page,
    limit: pageSize,
    sorting,
    filters,
  });

  const hasError = "error" in result;
  const catalogs = hasError ? [] : result.catalogs;
  const total = hasError ? 0 : result.total;
  const stats = hasError ? null : result.stats;
  const years = hasError ? [] : result.years;

  const initialData = {
    catalogs,
    stats,
    years,
    pagination: {
      pageIndex: page - 1,
      pageSize,
      totalRows: total,
      totalPages: Math.ceil(total / pageSize),
    },
    sorting: sort ? [{ id: sort, desc: sortDir === "desc" }] : [],
    filters: {
      search,
      status,
      year: yearParam || "all",
    },
    error: hasError ? result.error : null,
  };

  const labels = {
    title: t("title"),
    description: t("description"),
    stats: {
      totalCatalogs: t("stats.totalCatalogs"),
      totalCatalogsDesc: t("stats.totalCatalogsDesc"),
      activeCatalogs: t("stats.activeCatalogs"),
      activeCatalogsDesc: t("stats.activeCatalogsDesc"),
      featuredCatalogs: t("stats.featuredCatalogs"),
      featuredCatalogsDesc: t("stats.featuredCatalogsDesc"),
      totalPages: t("stats.totalPages"),
      totalPagesDesc: t("stats.totalPagesDesc"),
    },
    filters: {
      status: t("filters.status"),
      allStatuses: t("filters.allStatuses"),
      active: t("filters.active"),
      inactive: t("filters.inactive"),
      featured: t("filters.featured"),
      year: t("filters.year"),
      allYears: t("filters.allYears"),
      clearFilters: t("filters.clearFilters"),
    },
    columns: {
      title: t("columns.title"),
      year: t("columns.year"),
      pages: t("columns.pages"),
      status: t("columns.status"),
      featured: t("columns.featured"),
      createdAt: t("columns.createdAt"),
      active: t("columns.active"),
      inactive: t("columns.inactive"),
      yes: t("columns.yes"),
      no: t("columns.no"),
      actions: t("columns.actions"),
      viewDetails: t("columns.viewDetails"),
      edit: t("columns.edit"),
      delete: t("columns.delete"),
    },
    table: {
      noCatalogs: t("table.noCatalogs"),
      dataUpdated: t("table.dataUpdated"),
      searchPlaceholder: t("table.searchPlaceholder"),
    },
    actions: {
      createCatalog: t("actions.createCatalog"),
    },
    catalogForm: {
      createTitle: t("catalogForm.createTitle"),
      editTitle: t("catalogForm.editTitle"),
      title: t("catalogForm.title"),
      titlePlaceholder: t("catalogForm.titlePlaceholder"),
      year: t("catalogForm.year"),
      yearPlaceholder: t("catalogForm.yearPlaceholder"),
      description: t("catalogForm.description"),
      descriptionPlaceholder: t("catalogForm.descriptionPlaceholder"),
      coverImage: t("catalogForm.coverImage"),
      pages: t("catalogForm.pages"),
      addPage: t("catalogForm.addPage"),
      dragToReorder: t("catalogForm.dragToReorder"),
      isActive: t("catalogForm.isActive"),
      isFeatured: t("catalogForm.isFeatured"),
      save: t("catalogForm.save"),
      saving: t("catalogForm.saving"),
      cancel: t("catalogForm.cancel"),
      uploadCover: t("catalogForm.uploadCover"),
      removeCover: t("catalogForm.removeCover"),
      page: t("catalogForm.page"),
    },
    deleteDialog: {
      title: t("deleteDialog.title"),
      description: t.raw("deleteDialog.description"),
      cancel: t("deleteDialog.cancel"),
      delete: t("deleteDialog.delete"),
      deleting: t("deleteDialog.deleting"),
      warning: t("deleteDialog.warning"),
    },
    catalogDetails: {
      title: t("catalogDetails.title"),
      catalogTitle: t("catalogDetails.catalogTitle"),
      year: t("catalogDetails.year"),
      description: t("catalogDetails.description"),
      status: t("catalogDetails.status"),
      featured: t("catalogDetails.featured"),
      pages: t("catalogDetails.pages"),
      createdAt: t("catalogDetails.createdAt"),
      updatedAt: t("catalogDetails.updatedAt"),
      active: t("catalogDetails.active"),
      inactive: t("catalogDetails.inactive"),
      yes: t("catalogDetails.yes"),
      no: t("catalogDetails.no"),
      noDescription: t("catalogDetails.noDescription"),
      noPages: t("catalogDetails.noPages"),
    },
  };

  return (
    <Suspense fallback={<AdminCatalogsSkeleton />}>
      <AdminCatalogsClient
        initialData={initialData}
        labels={labels}
        locale={locale}
      />
    </Suspense>
  );
}
