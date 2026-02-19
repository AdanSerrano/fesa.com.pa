import { Suspense } from "react";
import { FormDemoView } from "@/modules/form-demo/view/form-demo.view";
import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";

export async function generateMetadata() {
  const t = await getTranslations("FormDemoPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

function FormDemoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

export default async function FormDemoPage() {
  const t = await getTranslations("FormDemoPage");

  return (
    <div className="flex flex-1 flex-col min-w-0 gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <Suspense fallback={<FormDemoSkeleton />}>
        <FormDemoView />
      </Suspense>
    </div>
  );
}
