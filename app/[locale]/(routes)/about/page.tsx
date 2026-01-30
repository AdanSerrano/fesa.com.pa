import { Suspense } from "react";
import { AboutView } from "@/modules/about/view/about.view";
import { Skeleton } from "@/components/ui/skeleton";

function AboutSkeleton() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 h-[40vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />

      <div className="container mx-auto px-4 py-6 sm:py-10 relative">
        <Skeleton className="h-5 w-32 mb-8" />

        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-36 rounded-full mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        <div className="space-y-16 sm:space-y-24">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-16 w-16 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-32 rounded-full" />
                  <Skeleton className="h-8 w-64" />
                </div>
                <Skeleton className="aspect-video rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border-2 p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border p-6 space-y-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
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
