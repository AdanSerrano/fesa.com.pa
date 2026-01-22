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
import type {
  DemoProductFilters,
  ProductStatus,
  DialogType,
  DemoProduct,
  DemoTableSorting,
} from "../types/demo-table.types";
import type { ColumnVisibilityState, PaginationState } from "@/components/custom-datatable";

export function useDemoTable() {
  const [state, setState] = useState(demoTableState.getState());
  const [isTransitioning, startTransition] = useTransition();

  useEffect(() => {
    return demoTableState.subscribe(() => {
      setState(demoTableState.getState());
    });
  }, []);

  const isPending = isTransitioning || state.isPending;

  const fetchProducts = useCallback(async () => {
    const currentState = demoTableState.getState();
    const isInitialLoad = !currentState.isInitialized;

    if (isInitialLoad) {
      demoTableState.setLoading(true);
    }
    demoTableState.setError(null);

    try {
      const result = await getProductsAction({
        page: currentState.pagination.pageIndex,
        pageSize: currentState.pagination.pageSize,
        filters: currentState.filters,
        sorting: currentState.sorting,
      });

      if (result.error) {
        demoTableState.setError(result.error);
        toast.error(result.error);
        return;
      }

      if (result.data) {
        startTransition(() => {
          demoTableState.setProducts(result.data!.data);
          demoTableState.setPagination(result.data!.pagination);
          demoTableState.setInitialized(true);
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar productos";
      demoTableState.setError(message);
      toast.error(message);
    } finally {
      if (isInitialLoad) {
        demoTableState.setLoading(false);
      }
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getStatsAction();
      if (result.data) {
        startTransition(() => {
          demoTableState.setStats(result.data!);
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchStats()]);
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
      startTransition(() => {
        demoTableState.removeProduct(id);
        demoTableState.closeDialog();
      });
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
      startTransition(() => {
        ids.forEach((id) => demoTableState.removeProduct(id));
        demoTableState.clearSelection();
      });
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
        startTransition(() => {
          demoTableState.updateProduct(id, result.data!);
        });
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

  const handleFiltersChange = useCallback((newFilters: Partial<DemoProductFilters>) => {
    demoTableState.setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    demoTableState.setFilters({ search });
  }, []);

  const handleRowSelectionChange = useCallback((selection: Record<string, boolean>) => {
    demoTableState.setRowSelection(selection);
  }, []);

  const handleExpandedChange = useCallback((expanded: Record<string, boolean>) => {
    demoTableState.setExpanded(expanded);
  }, []);

  const handleSortingChange = useCallback((sorting: DemoTableSorting[]) => {
    demoTableState.setSorting(sorting);
  }, []);

  const handleColumnVisibilityChange = useCallback((visibility: ColumnVisibilityState) => {
    demoTableState.setColumnVisibility(visibility);
  }, []);

  const handlePaginationChange = useCallback((pagination: PaginationState) => {
    demoTableState.setPagination({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, []);

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
  }, []);

  return {
    ...state,
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
