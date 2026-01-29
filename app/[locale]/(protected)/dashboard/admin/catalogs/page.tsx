import { AdminCatalogsView } from "@/modules/dashboard/admin/catalogs/view/admin-catalogs.view";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    catalogs_page?: string;
    catalogs_pageSize?: string;
    catalogs_sort?: string;
    catalogs_sortDir?: string;
    catalogs_search?: string;
    catalogs_status?: string;
    catalogs_year?: string;
  }>;
}

export default async function AdminCatalogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <AdminCatalogsView searchParams={params} />
    </div>
  )
}
