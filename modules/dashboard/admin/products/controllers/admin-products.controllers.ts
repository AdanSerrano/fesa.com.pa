import { AdminProductsService } from "../services/admin-products.services";
import type {
  GetCategoriesParams,
  GetItemsParams,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateItemParams,
  UpdateItemParams,
  AdminProductsActionResult,
  CategoryForSelect,
} from "../types/admin-products.types";

export class AdminProductsController {
  private service: AdminProductsService;

  constructor() {
    this.service = new AdminProductsService();
  }

  public async getCategories(
    params: GetCategoriesParams
  ): Promise<AdminProductsActionResult> {
    return await this.service.getCategories(params);
  }

  public async getItems(
    params: GetItemsParams
  ): Promise<AdminProductsActionResult> {
    return await this.service.getItems(params);
  }

  public async createCategory(
    params: CreateCategoryParams
  ): Promise<AdminProductsActionResult> {
    return await this.service.createCategory(params);
  }

  public async updateCategory(
    params: UpdateCategoryParams
  ): Promise<AdminProductsActionResult> {
    return await this.service.updateCategory(params);
  }

  public async deleteCategory(id: string): Promise<AdminProductsActionResult> {
    return await this.service.deleteCategory(id);
  }

  public async createItem(
    params: CreateItemParams
  ): Promise<AdminProductsActionResult> {
    return await this.service.createItem(params);
  }

  public async updateItem(
    params: UpdateItemParams
  ): Promise<AdminProductsActionResult> {
    return await this.service.updateItem(params);
  }

  public async deleteItem(id: string): Promise<AdminProductsActionResult> {
    return await this.service.deleteItem(id);
  }

  public async toggleCategoryStatus(
    id: string,
    isActive: boolean
  ): Promise<AdminProductsActionResult> {
    return await this.service.toggleCategoryStatus(id, isActive);
  }

  public async toggleItemStatus(
    id: string,
    isActive: boolean
  ): Promise<AdminProductsActionResult> {
    return await this.service.toggleItemStatus(id, isActive);
  }

  public async toggleCategoryFeatured(
    id: string,
    isFeatured: boolean
  ): Promise<AdminProductsActionResult> {
    return await this.service.toggleCategoryFeatured(id, isFeatured);
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    return await this.service.getCategoriesForSelect();
  }
}
