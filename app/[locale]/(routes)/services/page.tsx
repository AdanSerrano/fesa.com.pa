import { Suspense } from "react";
import { ServicesView } from "@/modules/services/view/services.view";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 3600;

export const metadata = {
  title: "Servicios",
  description: "Descubre todos nuestros servicios",
};

function ServicesPageSkeleton() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 py-6 sm:py-10 space-y-8 sm:space-y-12 relative">
        <Skeleton className="h-5 w-32" />

        <div className="text-center space-y-4 py-8 sm:py-12">
          <Skeleton className="h-10 w-10 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 sm:h-12 w-64 mx-auto" />
          <Skeleton className="h-5 w-80 mx-auto" />
          <div className="flex justify-center gap-3 pt-4">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <div className="relative h-36 sm:h-40 bg-muted">
                  <Skeleton className="absolute bottom-3 left-3 h-6 w-24 rounded-full" />
                </div>
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-2 border-t border-border/50">
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
