"use server";

import { currentUser } from "@/lib/user";
import { Role } from "@/app/prisma/client";
import { AdminProductsController } from "../controllers/admin-products.controllers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_CONFIG } from "@/lib/aws/s3-client";
import {
  getCategoriesParamsSchema,
  getItemsParamsSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  createItemSchema,
  updateItemSchema,
  deleteItemSchema,
  toggleStatusSchema,
  toggleFeaturedSchema,
} from "../validations/schema/admin-products.schema";
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

const controller = new AdminProductsController();

async function validateAdminAccess(): Promise<{
  isValid: boolean;
  userId?: string;
  error?: string;
}> {
  const user = await currentUser();

  if (!user) {
    return { isValid: false, error: "No autenticado" };
  }

  if (user.role !== Role.ADMIN) {
    return { isValid: false, error: "Acceso denegado. Se requiere rol de administrador" };
  }

  return { isValid: true, userId: user.id };
}

export async function getCategoriesAction(
  params: GetCategoriesParams
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = getCategoriesParamsSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Parámetros inválidos" };
  }

  return await controller.getCategories(inputValidation.data);
}

export async function getItemsAction(
  params: GetItemsParams
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = getItemsParamsSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Parámetros inválidos" };
  }

  return await controller.getItems(inputValidation.data);
}

export async function createCategoryAction(
  params: CreateCategoryParams
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = createCategorySchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.createCategory(inputValidation.data);
}

export async function updateCategoryAction(
  params: UpdateCategoryParams
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = updateCategorySchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.updateCategory(inputValidation.data);
}

export async function deleteCategoryAction(
  id: string
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = deleteCategorySchema.safeParse({ id });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.deleteCategory(inputValidation.data.id);
}

export async function createItemAction(
  params: CreateItemParams
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = createItemSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.createItem(inputValidation.data);
}

export async function updateItemAction(
  params: UpdateItemParams
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = updateItemSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.updateItem(inputValidation.data);
}

export async function deleteItemAction(
  id: string
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = deleteItemSchema.safeParse({ id });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.deleteItem(inputValidation.data.id);
}

export async function toggleCategoryStatusAction(
  id: string,
  isActive: boolean
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleStatusSchema.safeParse({ id, isActive });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.toggleCategoryStatus(
    inputValidation.data.id,
    inputValidation.data.isActive
  );
}

export async function toggleItemStatusAction(
  id: string,
  isActive: boolean
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleStatusSchema.safeParse({ id, isActive });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.toggleItemStatus(
    inputValidation.data.id,
    inputValidation.data.isActive
  );
}

export async function toggleCategoryFeaturedAction(
  id: string,
  isFeatured: boolean
): Promise<AdminProductsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleFeaturedSchema.safeParse({ id, isFeatured });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.toggleCategoryFeatured(
    inputValidation.data.id,
    inputValidation.data.isFeatured
  );
}

export async function getCategoriesForSelectAction(): Promise<CategoryForSelect[]> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return [];
  }

  return await controller.getCategoriesForSelect();
}

export async function getProductImageUploadUrlAction(
  type: "category" | "item",
  id: string,
  fileName: string,
  contentType: string
): Promise<{ url: string; publicUrl: string } | { error: string }> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error || "No autorizado" };
  }

  const folder = type === "category" ? "products-categories" : "products-items";
  const extension = fileName.split(".").pop() || "jpg";
  const key = `public/products/${folder}/${id}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = R2_CONFIG.publicUrl ? `${R2_CONFIG.publicUrl}/${key}` : "";

  return { url, publicUrl };
}
