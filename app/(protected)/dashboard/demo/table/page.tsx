import { DemoTableView } from "@/modules/demo-table/view/demo-table.view";
import { DemoTableSkeleton } from "@/modules/demo-table/components/demo-table.skeleton";
import { Suspense } from "react";

export const metadata = {
  title: "Demo DataTable",
  description: "Demostración de las funcionalidades del CustomDataTable",
};

interface PageProps {
  searchParams: Promise<{
    products_page?: string;
    products_pageSize?: string;
    products_sort?: string;
    products_sortDir?: string;
    products_search?: string;
  }>;
}

export default async function DemoTablePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<DemoTableSkeleton />}>
        <DemoTableView searchParams={params} />
      </Suspense>
    </div>
  );
}
