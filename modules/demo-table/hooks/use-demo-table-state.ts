"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";
import { demoTableState } from "../state/demo-table.state";

/**
 * Hook que usa useSyncExternalStore para subscribirse al state.
 * Más eficiente que useState + useEffect para stores externos.
 */
export function useDemoTableState() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    return demoTableState.subscribe(onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => {
    return demoTableState.getState();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Hook para detectar cambios reales en filtros/paginación/sorting.
 * Retorna true solo cuando hay cambios del usuario (no de la inicialización).
 */
export function useStateChangeDetector() {
  const prevFiltersRef = useRef<string | null>(null);
  const prevPaginationRef = useRef<string | null>(null);
  const prevSortingRef = useRef<string | null>(null);

  const detectChanges = useCallback((state: ReturnType<typeof demoTableState.getState>) => {
    const currentFilters = JSON.stringify(state.filters);
    const currentPagination = `${state.pagination.pageIndex}-${state.pagination.pageSize}`;
    const currentSorting = JSON.stringify(state.sorting);

    const filtersChanged = prevFiltersRef.current !== null && prevFiltersRef.current !== currentFilters;
    const paginationChanged = prevPaginationRef.current !== null && prevPaginationRef.current !== currentPagination;
    const sortingChanged = prevSortingRef.current !== null && prevSortingRef.current !== currentSorting;

    // Actualizar refs
    prevFiltersRef.current = currentFilters;
    prevPaginationRef.current = currentPagination;
    prevSortingRef.current = currentSorting;

    return filtersChanged || paginationChanged || sortingChanged;
  }, []);

  return { detectChanges };
}
