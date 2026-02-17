import { AdminCatalogsSkeleton } from "@/modules/dashboard/admin/catalogs/components/admin-catalogs.skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <AdminCatalogsSkeleton />
    </div>
  );
}
