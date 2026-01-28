import { Suspense } from "react";
import { ServiceDetailView } from "@/modules/services/view/service-detail.view";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{
    slug: string;
    serviceSlug: string;
  }>;
}

function ServiceDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-9 w-32" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-video rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug, serviceSlug } = await params;

  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <ServiceDetailView categorySlug={slug} serviceSlug={serviceSlug} />
    </Suspense>
  );
}
