import { Suspense } from "react";
import { ProductDetailView } from "@/modules/products/view/product-detail.view";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{
    slug: string;
    productSlug: string;
  }>;
}

function ProductDetailSkeleton() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 py-6 sm:py-10 space-y-8 relative">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-video rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 sm:h-12 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/5" />
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-44 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, productSlug } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailView categorySlug={slug} productSlug={productSlug} />
    </Suspense>
  );
}
