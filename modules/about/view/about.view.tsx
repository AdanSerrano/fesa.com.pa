import { getTranslations, getLocale } from "next-intl/server";
import { getAboutPageDataAction } from "../actions/about.actions";
import { AboutViewClient } from "../components/about-view-client";

export async function AboutView() {
  const locale = await getLocale();
  const t = await getTranslations("PublicAbout");
  const tBreadcrumb = await getTranslations("Breadcrumb");
  const data = await getAboutPageDataAction();

  const labels = {
    badge: t("badge"),
    title: t("title"),
    subtitle: t("subtitle"),
    noContent: t("noContent"),
    noContentTitle: t("noContentTitle"),
    noContentSubtitle: t("noContentSubtitle"),
    historyTitle: t("historyTitle"),
    missionTitle: t("missionTitle"),
    visionTitle: t("visionTitle"),
    valuesTitle: t("valuesTitle"),
    valuesSubtitle: t("valuesSubtitle"),
    value1Title: t("value1Title"),
    value1Description: t("value1Description"),
    value2Title: t("value2Title"),
    value2Description: t("value2Description"),
    value3Title: t("value3Title"),
    value3Description: t("value3Description"),
    value4Title: t("value4Title"),
    value4Description: t("value4Description"),
    ctaTitle: t("ctaTitle"),
    ctaSubtitle: t("ctaSubtitle"),
    ctaButton: t("ctaButton"),
    breadcrumbHome: tBreadcrumb("home"),
  };

  return <AboutViewClient data={data} locale={locale} labels={labels} />;
}
