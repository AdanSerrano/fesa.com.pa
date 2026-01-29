import { CatalogDetailView } from "@/modules/catalogs/view/catalog-detail.view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CatalogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <CatalogDetailView slug={slug} />;
}
