"use server";

import { DemoTableController } from "../controllers/demo-table.controllers";
import type { GetProductsParams, ProductStatus } from "../types/demo-table.types";

const controller = new DemoTableController();

export async function getProductsAction(params: GetProductsParams) {
  return await controller.getProducts(params);
}

export async function getStatsAction() {
  return await controller.getStats();
}

export async function getProductByIdAction(id: string) {
  return await controller.getProductById(id);
}

export async function deleteProductAction(id: string) {
  return await controller.deleteProduct(id);
}

export async function bulkDeleteProductsAction(ids: string[]) {
  return await controller.bulkDeleteProducts(ids);
}

export async function updateProductStatusAction(id: string, status: ProductStatus) {
  return await controller.updateProductStatus(id, status);
}
