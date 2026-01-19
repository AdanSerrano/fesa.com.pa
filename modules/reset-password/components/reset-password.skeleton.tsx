import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResetPasswordSkeleton() {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
        <Skeleton className="h-7 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
