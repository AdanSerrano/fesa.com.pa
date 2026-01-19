import { Skeleton } from "@/components/ui/skeleton";

export function RegisterFormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-56" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-64" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-3 w-52" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="flex justify-center">
        <Skeleton className="h-4 w-44" />
      </div>
    </div>
  );
}
