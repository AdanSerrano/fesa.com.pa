import { AdminUsersSkeleton } from "@/modules/dashboard/admin/users/components/admin-users.skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <AdminUsersSkeleton />
    </div>
  );
}
