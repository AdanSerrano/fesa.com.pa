import { Suspense } from "react";
import { CategoryView } from "@/modules/services/view/category.view";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicServicesRepository } from "@/modules/services/repository/services.repository";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const repository = new PublicServicesRepository();
  const categories = await repository.getActiveCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function CategoryPageSkeleton() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 py-6 sm:py-10 space-y-8 sm:space-y-12 relative">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="text-center space-y-4 py-8 sm:py-12">
          <Skeleton className="h-10 sm:h-12 w-64 mx-auto" />
          <Skeleton className="h-5 w-80 mx-auto" />
          <Skeleton className="h-7 w-28 rounded-full mx-auto mt-4" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <Skeleton className="h-40 sm:h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryView slug={slug} />
    </Suspense>
  );
}
