import { SecuritySettingsSkeleton } from "@/modules/settings/security/components/security-settings.skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <SecuritySettingsSkeleton />
    </div>
  );
}
