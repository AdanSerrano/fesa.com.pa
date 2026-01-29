import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { AdminNewsView } from "@/modules/dashboard/admin/news/view/admin-news.view";
import { AdminNewsSkeleton } from "@/modules/dashboard/admin/news/components/admin-news.skeleton";

export const metadata = {
  title: "Gestión de Noticias",
  description: "Administra las categorías y artículos de noticias de la plataforma",
};

interface PageProps {
  searchParams: Promise<{
    news_page?: string;
    news_pageSize?: string;
    news_sort?: string;
    news_sortDir?: string;
    news_search?: string;
    news_status?: string;
    news_category?: string;
    news_tab?: string;
  }>;
}

export default async function AdminNewsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard/overview");
  }

  const params = await searchParams;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={<AdminNewsSkeleton />}>
        <AdminNewsView searchParams={params} />
      </Suspense>
    </div>
  );
}
