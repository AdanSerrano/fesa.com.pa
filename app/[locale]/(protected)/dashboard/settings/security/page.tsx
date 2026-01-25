import { SecuritySettingsView } from "@/modules/settings/security/view/security-settings.view";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("SecurityPage");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SecuritySettingsPage() {
  const t = await getTranslations("SecurityPage");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <SecuritySettingsView />
    </div>
  );
}
