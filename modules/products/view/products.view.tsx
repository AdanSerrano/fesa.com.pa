import { getTranslations, getLocale } from "next-intl/server";
import { getProductsPageDataAction } from "../actions/products.actions";
import { ProductsHero } from "../components/products-hero";
import { CategoriesSection } from "../components/categories-section";
import { FeaturedProductsSection } from "../components/featured-products-section";

export async function ProductsView() {
  const locale = await getLocale();
  const t = await getTranslations("PublicProducts");

  const { categories, featuredProducts } = await getProductsPageDataAction();

  const labels = {
    title: t("title"),
    subtitle: t("subtitle"),
    categoriesTitle: t("categoriesTitle"),
    featuredTitle: t("featuredTitle"),
    viewMore: t("viewMore"),
    noCategories: t("noCategories"),
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16 relative">
        <ProductsHero title={labels.title} subtitle={labels.subtitle} />

        <CategoriesSection
          title={labels.categoriesTitle}
          categories={categories}
          locale={locale}
          viewMoreLabel={labels.viewMore}
          emptyMessage={labels.noCategories}
        />

        {featuredProducts.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <FeaturedProductsSection
              title={labels.featuredTitle}
              products={featuredProducts}
              locale={locale}
              viewMoreLabel={labels.viewMore}
            />
          </div>
        )}
      </div>
    </div>
  );
}
