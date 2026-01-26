import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { FileManagerView } from "@/modules/dashboard/admin/file-manager/view/file-manager.view";
import { FileManagerSkeleton } from "@/modules/dashboard/admin/file-manager/components/file-manager.skeleton";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("FileManager");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

interface PageProps {
  searchParams: Promise<{
    path?: string;
  }>;
}

export default async function AdminFilesPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard/services");
  }

  const params = await searchParams;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={<FileManagerSkeleton />}>
        <FileManagerView searchParams={params} />
      </Suspense>
    </div>
  );
}
