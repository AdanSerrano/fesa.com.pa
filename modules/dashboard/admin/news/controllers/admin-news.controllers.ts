import { AdminNewsService } from "../services/admin-news.services";
import type {
  GetCategoriesParams,
  GetArticlesParams,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateArticleParams,
  UpdateArticleParams,
  AdminNewsActionResult,
  CategoryForSelect,
} from "../types/admin-news.types";

export class AdminNewsController {
  private service: AdminNewsService;

  constructor() {
    this.service = new AdminNewsService();
  }

  public async getCategories(
    params: GetCategoriesParams
  ): Promise<AdminNewsActionResult> {
    return await this.service.getCategories(params);
  }

  public async getArticles(
    params: GetArticlesParams
  ): Promise<AdminNewsActionResult> {
    return await this.service.getArticles(params);
  }

  public async createCategory(
    params: CreateCategoryParams
  ): Promise<AdminNewsActionResult> {
    return await this.service.createCategory(params);
  }

  public async updateCategory(
    params: UpdateCategoryParams
  ): Promise<AdminNewsActionResult> {
    return await this.service.updateCategory(params);
  }

  public async deleteCategory(id: string): Promise<AdminNewsActionResult> {
    return await this.service.deleteCategory(id);
  }

  public async createArticle(
    params: CreateArticleParams
  ): Promise<AdminNewsActionResult> {
    return await this.service.createArticle(params);
  }

  public async updateArticle(
    params: UpdateArticleParams
  ): Promise<AdminNewsActionResult> {
    return await this.service.updateArticle(params);
  }

  public async deleteArticle(id: string): Promise<AdminNewsActionResult> {
    return await this.service.deleteArticle(id);
  }

  public async toggleCategoryStatus(
    id: string,
    isActive: boolean
  ): Promise<AdminNewsActionResult> {
    return await this.service.toggleCategoryStatus(id, isActive);
  }

  public async toggleArticleStatus(
    id: string,
    isActive: boolean
  ): Promise<AdminNewsActionResult> {
    return await this.service.toggleArticleStatus(id, isActive);
  }

  public async toggleCategoryFeatured(
    id: string,
    isFeatured: boolean
  ): Promise<AdminNewsActionResult> {
    return await this.service.toggleCategoryFeatured(id, isFeatured);
  }

  public async toggleArticleFeatured(
    id: string,
    isFeatured: boolean
  ): Promise<AdminNewsActionResult> {
    return await this.service.toggleArticleFeatured(id, isFeatured);
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    return await this.service.getCategoriesForSelect();
  }
}
