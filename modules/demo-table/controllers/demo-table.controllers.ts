import { DemoTableService } from "../services/demo-table.services";
import type { GetProductsParams, ProductStatus } from "../types/demo-table.types";

export class DemoTableController {
  private service: DemoTableService;

  constructor() {
    this.service = new DemoTableService();
  }

  public async getProducts(params: GetProductsParams) {
    return await this.service.getProducts(params);
  }

  public async getStats() {
    return await this.service.getStats();
  }

  public async getProductById(id: string) {
    return await this.service.getProductById(id);
  }

  public async deleteProduct(id: string) {
    return await this.service.deleteProduct(id);
  }

  public async bulkDeleteProducts(ids: string[]) {
    return await this.service.bulkDeleteProducts(ids);
  }

  public async updateProductStatus(id: string, status: ProductStatus) {
    return await this.service.updateProductStatus(id, status);
  }
}
