export interface PublicProductCategory {
  id: string;
  image: string | null;
  name: string;
  slug: string;
  description: string | null;
  itemCount: number;
}

export interface PublicProductItem {
  id: string;
  categoryId: string | null;
  image: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  sku: string | null;
  categoryName: string;
  categorySlug: string;
}

export interface ProductsPageData {
  categories: PublicProductCategory[];
  featuredProducts: PublicProductItem[];
}
