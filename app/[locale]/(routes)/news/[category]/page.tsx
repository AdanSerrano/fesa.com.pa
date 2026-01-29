import { Suspense } from "react";
import { CategoryView } from "@/modules/news/view/category.view";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsCategoryPageProps {
  params: Promise<{ category: string }>;
}

function CategoryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-8 w-32" />
      <div className="text-center space-y-4 py-8">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function NewsCategoryPage({ params }: NewsCategoryPageProps) {
  const { category } = await params;

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryView slug={category} />
    </Suspense>
  );
}
