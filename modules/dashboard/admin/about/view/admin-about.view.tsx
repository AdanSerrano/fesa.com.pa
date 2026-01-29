import { getTranslations } from "next-intl/server";
import { getAllAboutSectionsAction } from "../actions/admin-about.actions";
import { AdminAboutClient } from "./admin-about.client";

export async function AdminAboutView() {
  const t = await getTranslations("Admin.about");
  const sections = await getAllAboutSectionsAction();

  const labels = {
    title: t("title"),
    description: t("description"),
    tabs: {
      history: t("tabs.history"),
      mission: t("tabs.mission"),
      vision: t("tabs.vision"),
    },
    form: {
      title: t("form.title"),
      titlePlaceholder: t("form.titlePlaceholder"),
      content: t("form.content"),
      contentPlaceholder: t("form.contentPlaceholder"),
      mediaType: t("form.mediaType"),
      selectMediaType: t("form.selectMediaType"),
      image: t("form.image"),
      video: t("form.video"),
      noMedia: t("form.noMedia"),
      mediaUrl: t("form.mediaUrl"),
      mediaUrlPlaceholder: t("form.mediaUrlPlaceholder"),
      isActive: t("form.isActive"),
      save: t("form.save"),
      saving: t("form.saving"),
      uploadMedia: t("form.uploadMedia"),
      removeMedia: t("form.removeMedia"),
    },
    messages: {
      saved: t("messages.saved"),
      error: t("messages.error"),
    },
  };

  return <AdminAboutClient initialSections={sections} labels={labels} />;
}
