import { CatalogDetailView } from "@/modules/catalogs/view/catalog-detail.view";
import { CatalogsRepository } from "@/modules/catalogs/repository/catalogs.repository";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const repository = new CatalogsRepository();
  const catalogs = await repository.getActiveCatalogs();
  return catalogs.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CatalogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <CatalogDetailView slug={slug} />;
}
