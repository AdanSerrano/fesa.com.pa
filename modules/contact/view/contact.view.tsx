import { getTranslations, getLocale } from "next-intl/server";
import { ContactViewClient } from "../components/contact-view-client";

export async function ContactView() {
  const locale = await getLocale();
  const t = await getTranslations("Contact");
  const tBreadcrumb = await getTranslations("Breadcrumb");

  const labels = {
    badge: t("badge"),
    title: t("title"),
    subtitle: t("subtitle"),
    email: t("email"),
    emailValue: t("emailValue"),
    phone: t("phone"),
    phoneValue: t("phoneValue"),
    location: t("location"),
    locationValue: t("locationValue"),
    sendMessage: t("sendMessage"),
    formDescription: t("formDescription"),
    name: t("name"),
    namePlaceholder: t("namePlaceholder"),
    emailPlaceholder: t("emailPlaceholder"),
    subject: t("subject"),
    subjectPlaceholder: t("subjectPlaceholder"),
    message: t("message"),
    messagePlaceholder: t("messagePlaceholder"),
    send: t("send"),
    sending: t("sending"),
    businessHoursTitle: t("businessHoursTitle"),
    businessHoursValue: t("businessHoursValue"),
    responseTime: t("responseTime"),
    responseTimeValue: t("responseTimeValue"),
    followUs: t("followUs"),
    faqTitle: t("faqTitle"),
    faq1Question: t("faq1Question"),
    faq1Answer: t("faq1Answer"),
    faq2Question: t("faq2Question"),
    faq2Answer: t("faq2Answer"),
    faq3Question: t("faq3Question"),
    faq3Answer: t("faq3Answer"),
    successTitle: t("successTitle"),
    successMessage: t("successMessage"),
    errorTitle: t("errorTitle"),
    errorMessage: t("errorMessage"),
    breadcrumbHome: tBreadcrumb("home"),
  };

  return <ContactViewClient locale={locale} labels={labels} />;
}
