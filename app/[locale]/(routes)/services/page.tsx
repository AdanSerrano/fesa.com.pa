import { Suspense } from "react";
import { ServicesView } from "@/modules/services/view/services.view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Servicios",
  description: "Descubre todos nuestros servicios",
};

function ServicesPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-4 py-12">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesView />
    </Suspense>
  );
}
