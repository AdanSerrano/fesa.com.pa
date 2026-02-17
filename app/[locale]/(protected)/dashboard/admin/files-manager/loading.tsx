import { FileManagerSkeleton } from "@/modules/dashboard/admin/file-manager/components/file-manager.skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <FileManagerSkeleton />
    </div>
  );
}
