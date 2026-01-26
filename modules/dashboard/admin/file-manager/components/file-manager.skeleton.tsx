import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function FileManagerSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-28 hidden sm:block" />
                <Skeleton className="h-9 w-28 hidden sm:block" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-9 flex-1 max-w-sm" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-4 rounded-xl border">
              <Skeleton className="w-full aspect-square rounded-lg mb-3" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
