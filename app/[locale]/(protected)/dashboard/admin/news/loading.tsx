import { AdminNewsSkeleton } from "@/modules/dashboard/admin/news/components/admin-news.skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <AdminNewsSkeleton />
    </div>
  );
}
