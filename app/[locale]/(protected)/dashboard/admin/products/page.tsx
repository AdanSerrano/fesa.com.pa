import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { AdminProductsView } from "@/modules/dashboard/admin/products/view/admin-products.view";
import { AdminProductsSkeleton } from "@/modules/dashboard/admin/products/components/admin-products.skeleton";

export const metadata = {
  title: "Gestión de Productos",
  description: "Administra las categorías y productos de la plataforma",
};

interface PageProps {
  searchParams: Promise<{
    products_page?: string;
    products_pageSize?: string;
    products_sort?: string;
    products_sortDir?: string;
    products_search?: string;
    products_status?: string;
    products_category?: string;
    products_tab?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
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
      <Suspense fallback={<AdminProductsSkeleton />}>
        <AdminProductsView searchParams={params} />
      </Suspense>
    </div>
  );
}
