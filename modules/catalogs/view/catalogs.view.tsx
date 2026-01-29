import { getTranslations } from "next-intl/server";
import { getCatalogsByYearAction } from "../actions/catalogs.actions";
import { CatalogsHero } from "../components/catalogs-hero";
import { CatalogsByYearSection } from "../components/catalogs-by-year";
import { AnimatedSection } from "@/components/ui/animated-section";

export async function CatalogsView() {
  const t = await getTranslations("PublicCatalogs");
  const data = await getCatalogsByYearAction();

  const labels = {
    title: t("title"),
    subtitle: t("description"),
    view: t("view"),
    pages: t("pages"),
    noCatalogs: t("noCatalogs"),
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16 relative">
        <CatalogsHero title={labels.title} subtitle={labels.subtitle} />

        <AnimatedSection animation="fade-up" delay={100}>
          {data.length > 0 ? (
            <CatalogsByYearSection data={data} labels={{ view: labels.view, pages: labels.pages }} />
          ) : (
            <div className="text-center py-16 rounded-xl border bg-muted/30">
              <p className="text-muted-foreground">{labels.noCatalogs}</p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
