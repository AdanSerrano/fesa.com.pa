import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getCatalogBySlugAction } from "../actions/catalogs.actions";
import { CatalogViewer } from "../components/catalog-viewer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CatalogDetailViewProps {
  slug: string;
}

export async function CatalogDetailView({ slug }: CatalogDetailViewProps) {
  const t = await getTranslations("PublicCatalogs");
  const catalog = await getCatalogBySlugAction(slug);

  if (!catalog) {
    notFound();
  }

  const viewerLabels = {
    page: t("viewer.page"),
    of: t("viewer.of"),
    previous: t("viewer.previous"),
    next: t("viewer.next"),
    fullscreen: t("viewer.fullscreen"),
    exitFullscreen: t("viewer.exitFullscreen"),
    zoomIn: t("viewer.zoomIn"),
    zoomOut: t("viewer.zoomOut"),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedSection animation="fade-down" delay={0}>
        <div className="mb-6">
          <Link href="/catalogs">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToCatalogs")}
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {catalog.title}
            </h1>
            <Badge variant="outline" className="text-sm">
              {catalog.year}
            </Badge>
          </div>

          {catalog.description && (
            <p className="text-muted-foreground max-w-3xl">
              {catalog.description}
            </p>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={100}>
        {catalog.pages.length > 0 ? (
          <CatalogViewer pages={catalog.pages} labels={viewerLabels} />
        ) : (
          <div className="text-center py-16 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">{t("noPages")}</p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
