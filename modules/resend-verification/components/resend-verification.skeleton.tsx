import { Skeleton } from "@/components/ui/skeleton";

export function ResendVerificationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-center">
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
