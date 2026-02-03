import { Suspense } from "react";
import { PrivacyView } from "@/modules/privacy/view/privacy.view";
import { Skeleton } from "@/components/ui/skeleton";

function PrivacySkeleton() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 h-[40vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />

      <div className="container mx-auto px-4 py-6 sm:py-10 relative">
        <Skeleton className="h-5 w-32 mb-8" />

        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-36 rounded-full mx-auto" />
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<PrivacySkeleton />}>
      <PrivacyView />
    </Suspense>
  );
}
