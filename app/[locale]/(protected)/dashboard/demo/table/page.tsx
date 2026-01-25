import { DemoTableView } from "@/modules/demo-table/view/demo-table.view";
import { DemoTableSkeleton } from "@/modules/demo-table/components/demo-table.skeleton";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DemoTable");
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

interface PageProps {
  searchParams: Promise<{
    products_page?: string;
    products_pageSize?: string;
    products_sort?: string;
    products_sortDir?: string;
    products_search?: string;
    products_status?: string;
    products_category?: string;
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
