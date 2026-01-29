import { Suspense } from "react";
import { CatalogsView } from "@/modules/catalogs/view/catalogs.view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Catálogos",
  description: "Explora nuestros catálogos digitales",
};

function CatalogsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="relative overflow-hidden rounded-2xl border p-12">
        <div className="text-center space-y-4">
          <Skeleton className="h-14 w-14 rounded-full mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>
      <div className="space-y-8">
        <Skeleton className="h-8 w-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CatalogsPage() {
  return (
    <Suspense fallback={<CatalogsPageSkeleton />}>
      <CatalogsView />
    </Suspense>
  );
}
