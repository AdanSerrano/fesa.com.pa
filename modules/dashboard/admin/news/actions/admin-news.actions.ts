"use server";

import { revalidateTag } from "next/cache";
import { currentUser } from "@/lib/user";
import { Role } from "@/app/prisma/client";
import { AdminNewsController } from "../controllers/admin-news.controllers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_CONFIG } from "@/lib/aws/s3-client";
import {
  getCategoriesParamsSchema,
  getArticlesParamsSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  createArticleSchema,
  updateArticleSchema,
  deleteArticleSchema,
  toggleStatusSchema,
  toggleFeaturedSchema,
} from "../validations/schema/admin-news.schema";
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

const controller = new AdminNewsController();

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
): Promise<AdminNewsActionResult> {
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

export async function getArticlesAction(
  params: GetArticlesParams
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = getArticlesParamsSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Parámetros inválidos" };
  }

  return await controller.getArticles(inputValidation.data);
}

export async function createCategoryAction(
  params: CreateCategoryParams
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = createCategorySchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.createCategory(inputValidation.data);
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function updateCategoryAction(
  params: UpdateCategoryParams
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = updateCategorySchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.updateCategory(inputValidation.data);
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function deleteCategoryAction(
  id: string
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = deleteCategorySchema.safeParse({ id });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.deleteCategory(inputValidation.data.id);
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function createArticleAction(
  params: CreateArticleParams
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = createArticleSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.createArticle(inputValidation.data);
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function updateArticleAction(
  params: UpdateArticleParams
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = updateArticleSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.updateArticle(inputValidation.data);
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function deleteArticleAction(
  id: string
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = deleteArticleSchema.safeParse({ id });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.deleteArticle(inputValidation.data.id);
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function toggleCategoryStatusAction(
  id: string,
  isActive: boolean
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleStatusSchema.safeParse({ id, isActive });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.toggleCategoryStatus(
    inputValidation.data.id,
    inputValidation.data.isActive
  );
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function toggleArticleStatusAction(
  id: string,
  isActive: boolean
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleStatusSchema.safeParse({ id, isActive });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.toggleArticleStatus(
    inputValidation.data.id,
    inputValidation.data.isActive
  );
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function toggleCategoryFeaturedAction(
  id: string,
  isFeatured: boolean
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleFeaturedSchema.safeParse({ id, isFeatured });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.toggleCategoryFeatured(
    inputValidation.data.id,
    inputValidation.data.isFeatured
  );
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function toggleArticleFeaturedAction(
  id: string,
  isFeatured: boolean
): Promise<AdminNewsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = toggleFeaturedSchema.safeParse({ id, isFeatured });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  const result = await controller.toggleArticleFeatured(
    inputValidation.data.id,
    inputValidation.data.isFeatured
  );
  if (!result.error) revalidateTag("news", "max");
  return result;
}

export async function getCategoriesForSelectAction(): Promise<CategoryForSelect[]> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return [];
  }

  return await controller.getCategoriesForSelect();
}

export async function getNewsImageUploadUrlAction(
  type: "category" | "article",
  id: string,
  fileName: string,
  contentType: string,
  imageIndex?: number
): Promise<{ url: string; publicUrl: string } | { error: string }> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error || "No autorizado" };
  }

  const folder = type === "category" ? "news-categories" : "news-articles";
  const extension = fileName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const uniqueId = imageIndex !== undefined
    ? `${id}-img-${imageIndex}-${timestamp}`
    : `${id}-main-${timestamp}`;
  const key = `public/news/${folder}/${uniqueId}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = R2_CONFIG.publicUrl ? `${R2_CONFIG.publicUrl}/${key}` : "";

  return { url, publicUrl };
}
