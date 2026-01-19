import { Suspense } from "react";
import { ServicesView } from "@/modules/services/view/services.view";
import { ServicesSkeleton } from "@/modules/services/components/services.skeleton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <div className="w-full max-w-md">
        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesView />
        </Suspense>
      </div>
    </div>
  );
}
