import { DemoTableRepository } from "../repository/demo-table.repository";
import type { GetProductsParams } from "../types/demo-table.types";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class DemoTableDomainService {
  private repository: DemoTableRepository;

  constructor() {
    this.repository = new DemoTableRepository();
  }

  public validateGetProductsParams(params: GetProductsParams): ValidationResult {
    if (params.page < 0) {
      return { isValid: false, error: "La página debe ser mayor o igual a 0" };
    }

    if (params.pageSize < 1 || params.pageSize > 100) {
      return { isValid: false, error: "El tamaño de página debe estar entre 1 y 100" };
    }

    return { isValid: true };
  }

  public async validateProductExists(id: string): Promise<ValidationResult> {
    const product = await this.repository.getProductById(id);
    if (!product) {
      return { isValid: false, error: "Producto no encontrado" };
    }
    return { isValid: true };
  }

  public validateBulkDeleteIds(ids: string[]): ValidationResult {
    if (!ids || ids.length === 0) {
      return { isValid: false, error: "Debe seleccionar al menos un producto" };
    }

    if (ids.length > 50) {
      return { isValid: false, error: "No se pueden eliminar más de 50 productos a la vez" };
    }

    return { isValid: true };
  }
}
