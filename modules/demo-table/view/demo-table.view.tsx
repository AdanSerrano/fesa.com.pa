import { Suspense } from "react";
import { getProductsAction, getStatsAction } from "../actions/demo-table.actions";
import { DemoTableClient } from "./demo-table.client";
import { DemoTableSkeleton } from "../components/demo-table.skeleton";
import type { DemoProductFilters, DemoTableSorting } from "../types/demo-table.types";

interface DemoTableViewProps {
  searchParams?: {
    products_page?: string;
    products_pageSize?: string;
    products_sort?: string;
    products_sortDir?: string;
    products_search?: string;
  };
}

/**
 * Server Component que hace el fetch inicial.
 * Los datos se pasan al Client Component para la interactividad.
 */
export async function DemoTableView({ searchParams }: DemoTableViewProps) {
  const params = await Promise.resolve(searchParams || {});

  const page = params.products_page ? parseInt(params.products_page, 10) : 1;
  const pageSize = params.products_pageSize ? parseInt(params.products_pageSize, 10) : 10;
  const sort = params.products_sort || "createdAt";
  const sortDir = (params.products_sortDir || "desc") as "asc" | "desc";
  const search = params.products_search || "";

  const sorting: DemoTableSorting[] = sort
    ? [{ id: sort, desc: sortDir === "desc" }]
    : [];

  const filters: DemoProductFilters = {
    search,
    status: "all",
    category: "all",
  };

  // Fetch inicial en el servidor (solo 1 llamada)
  const [productsResult, statsResult] = await Promise.all([
    getProductsAction({
      page: page - 1, // API espera 0-indexed
      pageSize,
      filters,
      sorting,
    }),
    getStatsAction(),
  ]);

  const initialData = {
    products: productsResult.data?.data || [],
    pagination: {
      pageIndex: page - 1,
      pageSize,
      totalRows: productsResult.data?.pagination.totalRows || 0,
      totalPages: productsResult.data?.pagination.totalPages || 0,
    },
    stats: statsResult.data || null,
    sorting,
    filters,
    error: productsResult.error || null,
  };

  return (
    <Suspense fallback={<DemoTableSkeleton />}>
      <DemoTableClient initialData={initialData} />
    </Suspense>
  );
}
