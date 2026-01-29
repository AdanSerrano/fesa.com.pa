import { Suspense } from "react";
import { ArticleDetailView } from "@/modules/news/view/article-detail.view";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{
    category: string;
    article: string;
  }>;
}

function ArticleDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-9 w-32" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="aspect-video rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { category, article } = await params;

  return (
    <Suspense fallback={<ArticleDetailSkeleton />}>
      <ArticleDetailView categorySlug={category} articleSlug={article} />
    </Suspense>
  );
}
