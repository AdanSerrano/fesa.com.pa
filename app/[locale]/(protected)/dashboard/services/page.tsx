import { Suspense } from "react";
import { ServicesView } from "@/modules/services/view/services.view";
import { ServicesSkeleton } from "@/modules/services/components/services.skeleton";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ServicesPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ServicesPage() {
  const [session, t] = await Promise.all([
    auth(),
    getTranslations("ServicesPage"),
  ]);
  const firstName = session?.user?.name?.split(" ")[0] || t("defaultUser");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("welcome", { name: firstName })}
        </h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesView />
      </Suspense>
    </div>
  );
}
