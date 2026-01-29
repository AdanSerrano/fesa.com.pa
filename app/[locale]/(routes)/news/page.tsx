import { Suspense } from "react";
import { NewsView } from "@/modules/news/view/news.view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Noticias",
  description: "Mantente informado con las últimas noticias",
};

function NewsPageSkeleton() {
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

export default function NewsPage() {
  return (
    <Suspense fallback={<NewsPageSkeleton />}>
      <NewsView />
    </Suspense>
  );
}
