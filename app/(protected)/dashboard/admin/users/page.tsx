import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { AdminUsersView } from "@/modules/dashboard/admin/users/view/admin-users.view";
import { AdminUsersSkeleton } from "@/modules/dashboard/admin/users/components/admin-users.skeleton";

export const metadata = {
  title: "Gestión de Usuarios",
  description: "Administra los usuarios de la plataforma",
};

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard/services");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={<AdminUsersSkeleton />}>
        <AdminUsersView />
      </Suspense>
    </div>
  );
}
