import { Suspense } from "react";
import { ProductsView } from "@/modules/products/view/products.view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Productos",
  description: "Descubre todos nuestros productos",
};

function ProductsPageSkeleton() {
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsView />
    </Suspense>
  );
}
