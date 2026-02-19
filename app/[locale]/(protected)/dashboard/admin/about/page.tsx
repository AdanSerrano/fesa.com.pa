import { Suspense } from "react";
import { AdminAboutView } from "@/modules/dashboard/admin/about/view/admin-about.view";
import { Skeleton } from "@/components/ui/skeleton";

function AdminAboutSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}

export default function AdminAboutPage() {
  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <Suspense fallback={<AdminAboutSkeleton />}>
        <AdminAboutView />
      </Suspense>
    </div>
  );
}
