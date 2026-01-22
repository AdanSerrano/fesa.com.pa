import { Suspense } from "react";

import { DemoTableView } from "@/modules/demo-table/view/demo-table.view";
import { DemoTableSkeleton } from "@/modules/demo-table/components/demo-table.skeleton";

export const metadata = {
  title: "Demo DataTable",
  description: "Demostración de las funcionalidades del CustomDataTable",
};

export default function DemoTablePage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<DemoTableSkeleton />}>
        <DemoTableView />
      </Suspense>
    </div>
  );
}
