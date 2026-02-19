import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { AdminServicesView } from "@/modules/dashboard/admin/services/view/admin-services.view";
import { AdminServicesSkeleton } from "@/modules/dashboard/admin/services/components/admin-services.skeleton";

export const metadata = {
  title: "Gestión de Servicios",
  description: "Administra las categorías y servicios de la plataforma",
};

interface PageProps {
  searchParams: Promise<{
    services_page?: string;
    services_pageSize?: string;
    services_sort?: string;
    services_sortDir?: string;
    services_search?: string;
    services_status?: string;
    services_category?: string;
    services_tab?: string;
  }>;
}

export default async function AdminServicesPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard/overview");
  }

  const params = await searchParams;

  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <Suspense fallback={<AdminServicesSkeleton />}>
        <AdminServicesView searchParams={params} />
      </Suspense>
    </div>
  );
}
