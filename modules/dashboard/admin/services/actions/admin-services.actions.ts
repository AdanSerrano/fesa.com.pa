"use server";

import { currentUser } from "@/lib/user";
import { Role } from "@/app/prisma/client";
import { AdminServicesController } from "../controllers/admin-services.controllers";
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
} from "../validations/schema/admin-services.schema";
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

const controller = new AdminServicesController();

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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
): Promise<AdminServicesActionResult> {
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
