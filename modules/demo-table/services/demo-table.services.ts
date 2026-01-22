import { DemoTableRepository } from "../repository/demo-table.repository";
import { DemoTableDomainService } from "./demo-table.domain.service";
import type {
  GetProductsParams,
  GetProductsResult,
  DemoProductStats,
  DemoProduct,
  ProductStatus,
} from "../types/demo-table.types";

export interface ServiceResult<T = void> {
  success?: string;
  error?: string;
  data?: T;
}

export class DemoTableService {
  private repository: DemoTableRepository;
  private domainService: DemoTableDomainService;

  constructor() {
    this.repository = new DemoTableRepository();
    this.domainService = new DemoTableDomainService();
  }

  public async getProducts(params: GetProductsParams): Promise<ServiceResult<GetProductsResult>> {
    try {
      const validation = this.domainService.validateGetProductsParams(params);
      if (!validation.isValid) {
        return { error: validation.error };
      }

      const result = await this.repository.getProducts(params);
      return { data: result };
    } catch (error) {
      console.error("Error en getProducts:", error);
      return { error: "Error al obtener productos" };
    }
  }

  public async getStats(): Promise<ServiceResult<DemoProductStats>> {
    try {
      const stats = await this.repository.getStats();
      return { data: stats };
    } catch (error) {
      console.error("Error en getStats:", error);
      return { error: "Error al obtener estadísticas" };
    }
  }

  public async getProductById(id: string): Promise<ServiceResult<DemoProduct>> {
    try {
      const validation = await this.domainService.validateProductExists(id);
      if (!validation.isValid) {
        return { error: validation.error };
      }

      const product = await this.repository.getProductById(id);
      if (!product) {
        return { error: "Producto no encontrado" };
      }

      return { data: product };
    } catch (error) {
      console.error("Error en getProductById:", error);
      return { error: "Error al obtener producto" };
    }
  }

  public async deleteProduct(id: string): Promise<ServiceResult> {
    try {
      const validation = await this.domainService.validateProductExists(id);
      if (!validation.isValid) {
        return { error: validation.error };
      }

      const deleted = await this.repository.deleteProduct(id);
      if (!deleted) {
        return { error: "Error al eliminar producto" };
      }

      return { success: "Producto eliminado correctamente" };
    } catch (error) {
      console.error("Error en deleteProduct:", error);
      return { error: "Error al eliminar producto" };
    }
  }

  public async bulkDeleteProducts(ids: string[]): Promise<ServiceResult<{ deleted: number }>> {
    try {
      const validation = this.domainService.validateBulkDeleteIds(ids);
      if (!validation.isValid) {
        return { error: validation.error };
      }

      const deleted = await this.repository.bulkDeleteProducts(ids);
      return {
        success: `${deleted} producto(s) eliminado(s) correctamente`,
        data: { deleted },
      };
    } catch (error) {
      console.error("Error en bulkDeleteProducts:", error);
      return { error: "Error al eliminar productos" };
    }
  }

  public async updateProductStatus(
    id: string,
    status: ProductStatus
  ): Promise<ServiceResult<DemoProduct>> {
    try {
      const validation = await this.domainService.validateProductExists(id);
      if (!validation.isValid) {
        return { error: validation.error };
      }

      const product = await this.repository.updateProductStatus(id, status);
      if (!product) {
        return { error: "Error al actualizar estado" };
      }

      return { success: "Estado actualizado correctamente", data: product };
    } catch (error) {
      console.error("Error en updateProductStatus:", error);
      return { error: "Error al actualizar estado" };
    }
  }
}
