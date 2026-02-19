import { Suspense } from "react";
import { UserProfileView } from "@/modules/user/view/user.view";
import { UserProfileSkeleton } from "@/modules/user/components/user.skeleton";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ProfilePage");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ProfilePage() {
  const t = await getTranslations("ProfilePage");

  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileView />
      </Suspense>
    </div>
  );
}
