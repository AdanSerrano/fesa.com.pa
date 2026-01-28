import { AdminServicesService } from "../services/admin-services.services";
import type {
  GetCategoriesParams,
  GetItemsParams,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateItemParams,
  UpdateItemParams,
  AdminServicesActionResult,
  CategoryForSelect,
} from "../types/admin-services.types";

export class AdminServicesController {
  private service: AdminServicesService;

  constructor() {
    this.service = new AdminServicesService();
  }

  public async getCategories(
    params: GetCategoriesParams
  ): Promise<AdminServicesActionResult> {
    return await this.service.getCategories(params);
  }

  public async getItems(
    params: GetItemsParams
  ): Promise<AdminServicesActionResult> {
    return await this.service.getItems(params);
  }

  public async createCategory(
    params: CreateCategoryParams
  ): Promise<AdminServicesActionResult> {
    return await this.service.createCategory(params);
  }

  public async updateCategory(
    params: UpdateCategoryParams
  ): Promise<AdminServicesActionResult> {
    return await this.service.updateCategory(params);
  }

  public async deleteCategory(id: string): Promise<AdminServicesActionResult> {
    return await this.service.deleteCategory(id);
  }

  public async createItem(
    params: CreateItemParams
  ): Promise<AdminServicesActionResult> {
    return await this.service.createItem(params);
  }

  public async updateItem(
    params: UpdateItemParams
  ): Promise<AdminServicesActionResult> {
    return await this.service.updateItem(params);
  }

  public async deleteItem(id: string): Promise<AdminServicesActionResult> {
    return await this.service.deleteItem(id);
  }

  public async toggleCategoryStatus(
    id: string,
    isActive: boolean
  ): Promise<AdminServicesActionResult> {
    return await this.service.toggleCategoryStatus(id, isActive);
  }

  public async toggleItemStatus(
    id: string,
    isActive: boolean
  ): Promise<AdminServicesActionResult> {
    return await this.service.toggleItemStatus(id, isActive);
  }

  public async toggleCategoryFeatured(
    id: string,
    isFeatured: boolean
  ): Promise<AdminServicesActionResult> {
    return await this.service.toggleCategoryFeatured(id, isFeatured);
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    return await this.service.getCategoriesForSelect();
  }
}
