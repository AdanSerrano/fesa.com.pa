import { Suspense } from "react";
import { AboutView } from "@/modules/about/view/about.view";
import { Skeleton } from "@/components/ui/skeleton";

function AboutSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutView />
    </Suspense>
  );
}
