"use client";

import { useRef, memo, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import { DemoTableViewModel } from "../view-model/demo-table.view-model";
import { DemoTableStats } from "../components/stats/demo-table-stats";
import { DemoTableSkeleton } from "../components/demo-table.skeleton";
import { DeleteProductDialog, ProductDetailsDialog } from "../components/dialogs";
import { useDemoTableState, useStateChangeDetector } from "../hooks/use-demo-table-state";

const DemoTableHeader = memo(function DemoTableHeader({
  isPending,
  onRefresh,
}: {
  isPending: boolean;
  onRefresh: () => void;
}) {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Demo DataTable</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Demostración de CustomDataTable con todas las funcionalidades disponibles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isPending}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
});

const DemoTableStatsSection = memo(function DemoTableStatsSection() {
  const state = useDemoTableState();

  return (
    <AnimatedSection animation="fade-up" delay={100}>
      <DemoTableStats stats={state.stats} isLoading={state.isLoading && !state.stats} />
    </AnimatedSection>
  );
});

const DemoTableDataTableSection = memo(function DemoTableDataTableSection() {
  const {
    dataTableConfig,
    selectedProduct,
    activeDialog,
    closeDialog,
    handleDelete,
  } = DemoTableViewModel();

  return (
    <AnimatedSection animation="fade-up" delay={200}>
      <CustomDataTable
        data={dataTableConfig.data}
        columns={dataTableConfig.columns}
        getRowId={dataTableConfig.getRowId}
        selection={dataTableConfig.selection}
        expansion={dataTableConfig.expansion}
        pagination={dataTableConfig.pagination}
        sorting={dataTableConfig.sorting}
        filter={dataTableConfig.filter}
        columnVisibility={dataTableConfig.columnVisibility}
        toolbarConfig={dataTableConfig.toolbarConfig}
        export={dataTableConfig.exportConfig}
        copy={dataTableConfig.copyConfig}
        print={dataTableConfig.printConfig}
        fullscreen={dataTableConfig.fullscreenConfig}
        style={dataTableConfig.style}
        isLoading={dataTableConfig.isLoading}
        isPending={dataTableConfig.isPending}
        emptyMessage={dataTableConfig.emptyMessage}
        emptyIcon={dataTableConfig.emptyIcon}
        headerActions={dataTableConfig.headerActions}
        bulkActions={dataTableConfig.bulkActions}
      />

      <ProductDetailsDialog
        key={`details-${selectedProduct?.id}`}
        product={selectedProduct}
        open={activeDialog === "details"}
        onOpenChange={(open) => !open && closeDialog()}
      />

      <DeleteProductDialog
        key={`delete-${selectedProduct?.id}`}
        product={selectedProduct}
        open={activeDialog === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleDelete}
      />
    </AnimatedSection>
  );
});

export function DemoTableView() {
  const state = useDemoTableState();
  const { detectChanges } = useStateChangeDetector();
  const isInitializedRef = useRef(false);

  const { fetchProducts, fetchStats, handleRefresh } = DemoTableViewModel();

  // Un solo useEffect para inicialización y cambios
  useEffect(() => {
    // Inicialización (solo una vez)
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchProducts();
      fetchStats();
      return;
    }

    // Detectar cambios reales después de la inicialización
    if (state.isInitialized && detectChanges(state)) {
      fetchProducts();
    }
  }, [state, detectChanges, fetchProducts, fetchStats]);

  if (!state.isInitialized) {
    return <DemoTableSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DemoTableHeader isPending={state.isPending} onRefresh={handleRefresh} />
      <DemoTableStatsSection />
      <DemoTableDataTableSection />
    </div>
  );
}
