import { Skeleton } from "@/components/ui/skeleton";

export function RegisterSuccessSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 p-4 text-center sm:p-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-7 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="flex flex-col gap-3 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}
