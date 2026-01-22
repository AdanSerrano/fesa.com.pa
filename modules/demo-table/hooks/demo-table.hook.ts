"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  getProductsAction,
  getStatsAction,
  deleteProductAction,
  bulkDeleteProductsAction,
  updateProductStatusAction,
} from "../actions/demo-table.actions";
import { demoTableState } from "../state/demo-table.state";
import { useDataTableUrlState } from "@/hooks/use-datatable-url-state";
import type {
  DemoProductFilters,
  ProductStatus,
  DialogType,
  DemoProduct,
  DemoTableSorting,
} from "../types/demo-table.types";
import type { ColumnVisibilityState } from "@/components/custom-datatable";

export function useDemoTable() {
  const [state, setState] = useState(demoTableState.getState());
  const [isTransitioning, startTransition] = useTransition();

  // Estado persistido en URL (paginación, sorting, búsqueda)
  const urlState = useDataTableUrlState({
    prefix: "products",
    defaults: {
      page: 1,
      pageSize: 10,
      sort: "createdAt",
      sortDir: "desc",
    },
  });

  useEffect(() => {
    return demoTableState.subscribe(() => {
      setState(demoTableState.getState());
    });
  }, []);

  const isPending = isTransitioning || state.isPending;

  const fetchProducts = useCallback(() => {
    const currentParams = {
      page: urlState.state.page,
      pageSize: urlState.state.pageSize,
      sort: urlState.state.sort || "",
      sortDir: urlState.state.sortDir || "",
      search: urlState.state.search || "",
    };

    // Usar el state global para controlar duplicados (persiste entre remontados de Strict Mode)
    if (!demoTableState.canFetchProducts(currentParams)) {
      return;
    }

    // Marcar como fetching SÍNCRONAMENTE antes de cualquier operación async
    demoTableState.startFetchingProducts(currentParams);
    const currentState = demoTableState.getState();
    const isInitialLoad = !currentState.isInitialized;

    if (isInitialLoad) {
      demoTableState.setLoading(true);
    }
    demoTableState.setError(null);

    startTransition(async () => {
      try {
        const sorting: DemoTableSorting[] = currentParams.sort
          ? [{ id: currentParams.sort, desc: currentParams.sortDir === "desc" }]
          : [];

        const filters: DemoProductFilters = {
          ...currentState.filters,
          search: currentParams.search,
        };

        const result = await getProductsAction({
          page: currentParams.page - 1, // API espera 0-indexed
          pageSize: currentParams.pageSize,
          filters,
          sorting,
        });

        if (result.error) {
          demoTableState.setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result.data) {
          demoTableState.setProducts(result.data.data);
          demoTableState.setPagination({
            pageIndex: currentParams.page - 1,
            pageSize: currentParams.pageSize,
            totalRows: result.data.pagination.totalRows,
            totalPages: result.data.pagination.totalPages,
          });
          demoTableState.setInitialized(true);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cargar productos";
        demoTableState.setError(message);
        toast.error(message);
      } finally {
        demoTableState.finishFetchingProducts();
        if (isInitialLoad) {
          demoTableState.setLoading(false);
        }
      }
    });
  }, [
    urlState.state.page,
    urlState.state.pageSize,
    urlState.state.sort,
    urlState.state.sortDir,
    urlState.state.search,
  ]);

  // Efecto para fetch cuando cambian los parámetros de URL
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fetchStats = useCallback(async () => {
    // Usar el state global para controlar duplicados
    if (!demoTableState.canFetchStats()) {
      return;
    }
    demoTableState.startFetchingStats();

    try {
      const result = await getStatsAction();
      if (result.data) {
        startTransition(() => {
          demoTableState.setStats(result.data!);
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      demoTableState.finishFetchingStats();
    }
  }, []);

  // Cargar stats al inicio
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = useCallback(() => {
    // Resetear flags en el state global para forzar nuevo fetch
    demoTableState.resetFetchFlags();
    fetchProducts();
    fetchStats();
    toast.success("Datos actualizados");
  }, [fetchProducts, fetchStats]);

  const deleteProduct = useCallback(async (id: string) => {
    demoTableState.setPending(true);
    try {
      const result = await deleteProductAction(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      demoTableState.removeProduct(id);
      demoTableState.closeDialog();
      toast.success(result.success || "Producto eliminado");
      fetchStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(message);
    } finally {
      demoTableState.setPending(false);
    }
  }, [fetchStats]);

  const bulkDeleteProducts = useCallback(async (ids: string[]) => {
    demoTableState.setPending(true);
    try {
      const result = await bulkDeleteProductsAction(ids);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      ids.forEach((id) => demoTableState.removeProduct(id));
      demoTableState.clearSelection();
      toast.success(result.success || `${ids.length} productos eliminados`);
      fetchStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar";
      toast.error(message);
    } finally {
      demoTableState.setPending(false);
    }
  }, [fetchStats]);

  const changeStatus = useCallback(async (id: string, status: ProductStatus) => {
    demoTableState.setPending(true);
    try {
      const result = await updateProductStatusAction(id, status);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.data) {
        demoTableState.updateProduct(id, result.data);
      }
      toast.success(result.success || "Estado actualizado");
      fetchStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cambiar estado";
      toast.error(message);
    } finally {
      demoTableState.setPending(false);
    }
  }, [fetchStats]);

  // Filtros locales (status, category) - no van en URL
  const handleFiltersChange = useCallback((newFilters: Partial<DemoProductFilters>) => {
    demoTableState.setFilters(newFilters);
    demoTableState.resetFetchFlags();
  }, []);

  // Search va en URL
  const handleSearchChange = useCallback((search: string) => {
    urlState.setSearch(search || undefined);
  }, [urlState]);

  const handleRowSelectionChange = useCallback((selection: Record<string, boolean>) => {
    demoTableState.setRowSelection(selection);
  }, []);

  const handleExpandedChange = useCallback((expanded: Record<string, boolean>) => {
    demoTableState.setExpanded(expanded);
  }, []);

  // Sorting va en URL
  const handleSortingChange = useCallback((sorting: DemoTableSorting[]) => {
    if (sorting.length === 0) {
      urlState.setSort(undefined, undefined);
    } else {
      const { id, desc } = sorting[0];
      urlState.setSort(id, desc ? "desc" : "asc");
    }
  }, [urlState]);

  const handleColumnVisibilityChange = useCallback((visibility: ColumnVisibilityState) => {
    demoTableState.setColumnVisibility(visibility);
  }, []);

  // Paginación va en URL
  const handlePaginationChange = useCallback((pagination: { pageIndex: number; pageSize: number }) => {
    if (pagination.pageSize !== urlState.state.pageSize) {
      urlState.setPageSize(pagination.pageSize);
    } else if (pagination.pageIndex + 1 !== urlState.state.page) {
      urlState.setPage(pagination.pageIndex + 1);
    }
  }, [urlState]);

  const handleOpenDialog = useCallback((type: DialogType, product?: DemoProduct) => {
    demoTableState.openDialog(type, product);
  }, []);

  const handleCloseDialog = useCallback(() => {
    demoTableState.closeDialog();
  }, []);

  const getSelectedProducts = useCallback(() => {
    return demoTableState.getSelectedProducts();
  }, []);

  const clearSelection = useCallback(() => {
    demoTableState.clearSelection();
  }, []);

  const resetFilters = useCallback(() => {
    demoTableState.resetFilters();
    urlState.resetState();
    demoTableState.resetFetchFlags();
  }, [urlState]);

  // Construir el estado de paginación combinando URL y datos del servidor
  const pagination = {
    pageIndex: urlState.paginationState.pageIndex,
    pageSize: urlState.paginationState.pageSize,
    totalRows: state.pagination.totalRows || 0,
    totalPages: state.pagination.totalPages || 0,
  };

  // Construir el estado de sorting desde la URL
  const sorting: DemoTableSorting[] = urlState.sortingState;

  // Construir los filtros combinando URL (search) y estado local (status, category)
  const filters: DemoProductFilters = {
    ...state.filters,
    search: urlState.searchState,
  };

  return {
    ...state,
    pagination,
    sorting,
    filters,
    isPending,
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
    openDialog: handleOpenDialog,
    closeDialog: handleCloseDialog,
    getSelectedProducts,
    clearSelection,
    resetFilters,
  };
}
