export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    news: number;
  };
}

export interface NewsImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface NewsArticle {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  images: NewsImage[];
  publishedAt: Date | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
  } | null;
}

export type AdminNewsStatus = "active" | "inactive" | "featured" | "published" | "draft" | "all";

export interface AdminNewsFilters {
  search: string;
  status: AdminNewsStatus;
  categoryId: string | "all";
}

export interface AdminNewsStats {
  totalCategories: number;
  totalArticles: number;
  activeCategories: number;
  activeArticles: number;
  featuredCategories: number;
  featuredArticles: number;
  publishedArticles: number;
}

export type AdminNewsDialogType =
  | "category-details"
  | "category-create"
  | "category-edit"
  | "category-delete"
  | "article-details"
  | "article-create"
  | "article-edit"
  | "article-delete"
  | null;

export interface AdminNewsPagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

export interface AdminNewsSorting {
  id: string;
  desc: boolean;
}

export interface GetCategoriesParams {
  page: number;
  limit: number;
  sorting?: AdminNewsSorting[];
  filters?: AdminNewsFilters;
}

export interface GetArticlesParams {
  page: number;
  limit: number;
  sorting?: AdminNewsSorting[];
  filters?: AdminNewsFilters;
  categoryId?: string;
}

export interface GetCategoriesResult {
  categories: NewsCategory[];
  stats: AdminNewsStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetArticlesResult {
  articles: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateCategoryParams {
  name: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateCategoryParams {
  id: string;
  name?: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  order?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ImageInput {
  url: string;
  alt?: string | null;
  order: number;
}

export interface CreateArticleParams {
  categoryId?: string | null;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  images?: ImageInput[];
  publishedAt?: Date | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateArticleParams {
  id: string;
  categoryId?: string | null;
  title?: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  images?: ImageInput[];
  publishedAt?: Date | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CreateResult {
  id: string;
}

export interface AdminNewsActionResult {
  success?: string;
  error?: string;
  data?: GetCategoriesResult | GetArticlesResult | CreateResult;
}

export interface CategoryForSelect {
  id: string;
  name: string;
}
