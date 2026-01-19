import { Skeleton } from "@/components/ui/skeleton";

export function LoginFormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="flex justify-center">
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
