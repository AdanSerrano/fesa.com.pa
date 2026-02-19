import { Suspense } from "react";
import { OverviewView } from "@/modules/overview/view/overview.view";
import { OverviewSkeleton } from "@/modules/overview/components/overview.skeleton";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("OverviewPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OverviewPage() {
  const [session, t] = await Promise.all([
    auth(),
    getTranslations("OverviewPage"),
  ]);
  const firstName = session?.user?.name?.split(" ")[0] || t("defaultUser");

  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("welcome", { name: firstName })}
        </h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewView />
      </Suspense>
    </div>
  );
}
