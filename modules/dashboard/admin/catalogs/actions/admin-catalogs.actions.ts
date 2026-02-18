"use server";

import { revalidateTag } from "next/cache";
import { currentUser } from "@/lib/user";
import { Role } from "@/app/prisma/client";
import { AdminCatalogsRepository } from "../repository/admin-catalogs.repository";
import {
  createCatalogSchema,
  updateCatalogSchema,
  getCatalogsParamsSchema,
} from "../validations/schema/admin-catalogs.schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_CONFIG } from "@/lib/aws/s3-client";
import type {
  AdminCatalog,
  AdminCatalogsStats,
  GetCatalogsParams,
  CreateCatalogParams,
  UpdateCatalogParams,
  AdminCatalogsActionResult,
} from "../types/admin-catalogs.types";

const repository = new AdminCatalogsRepository();

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

export async function getCatalogsAction(
  params: GetCatalogsParams = {}
): Promise<{ catalogs: AdminCatalog[]; total: number; stats: AdminCatalogsStats; years: number[] } | { error: string }> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error || "No autorizado" };
  }

  const inputValidation = getCatalogsParamsSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Parámetros inválidos" };
  }

  const { page, limit, sorting, filters } = inputValidation.data;

  const [{ catalogs, total }, stats, years] = await Promise.all([
    repository.getCatalogs(page, limit, sorting, filters),
    repository.getStats(),
    repository.getYears(),
  ]);

  return { catalogs, total, stats, years };
}

export async function getCatalogByIdAction(id: string): Promise<AdminCatalog | { error: string }> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error || "No autorizado" };
  }

  const catalog = await repository.getCatalogById(id);
  if (!catalog) {
    return { error: "Catálogo no encontrado" };
  }

  return catalog;
}

export async function createCatalogAction(
  params: CreateCatalogParams
): Promise<AdminCatalogsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = createCatalogSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    const catalog = await repository.createCatalog(inputValidation.data);
    revalidateTag("catalogs", "max");
    return { success: "Catálogo creado exitosamente", data: catalog };
  } catch {
    return { error: "Error al crear el catálogo" };
  }
}

export async function updateCatalogAction(
  params: UpdateCatalogParams
): Promise<AdminCatalogsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = updateCatalogSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    const catalog = await repository.updateCatalog(inputValidation.data);
    revalidateTag("catalogs", "max");
    return { success: "Catálogo actualizado exitosamente", data: catalog };
  } catch {
    return { error: "Error al actualizar el catálogo" };
  }
}

export async function deleteCatalogAction(id: string): Promise<AdminCatalogsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  try {
    await repository.deleteCatalog(id);
    revalidateTag("catalogs", "max");
    return { success: "Catálogo eliminado exitosamente" };
  } catch {
    return { error: "Error al eliminar el catálogo" };
  }
}

export async function toggleCatalogStatusAction(
  id: string,
  isActive: boolean
): Promise<AdminCatalogsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  try {
    const catalog = await repository.updateCatalog({ id, isActive });
    revalidateTag("catalogs", "max");
    return {
      success: isActive ? "Catálogo activado" : "Catálogo desactivado",
      data: catalog,
    };
  } catch {
    return { error: "Error al cambiar el estado del catálogo" };
  }
}

export async function toggleCatalogFeaturedAction(
  id: string,
  isFeatured: boolean
): Promise<AdminCatalogsActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  try {
    const catalog = await repository.updateCatalog({ id, isFeatured });
    revalidateTag("catalogs", "max");
    return {
      success: isFeatured ? "Catálogo destacado" : "Catálogo no destacado",
      data: catalog,
    };
  } catch {
    return { error: "Error al cambiar el destacado del catálogo" };
  }
}

export async function getCatalogUploadUrlAction(
  catalogId: string,
  fileName: string,
  contentType: string,
  type: "cover" | "page",
  year: number,
  pageIndex?: number
): Promise<{ url: string; publicUrl: string } | { error: string }> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error || "No autorizado" };
  }

  if (!R2_CONFIG.bucket) {
    return { error: "Configuración de almacenamiento incompleta (bucket)" };
  }

  if (!R2_CONFIG.publicUrl) {
    return { error: "Configuración de almacenamiento incompleta (publicUrl)" };
  }

  const extension = fileName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const uniqueId = type === "page" && pageIndex !== undefined
    ? `${catalogId}-page-${pageIndex}-${timestamp}`
    : `${catalogId}-cover-${timestamp}`;
  const key = `public/catalogs/${year}/images/${uniqueId}.${extension}`;

  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${R2_CONFIG.publicUrl}/${key}`;

    return { url, publicUrl };
  } catch {
    return { error: "Error al generar URL de subida" };
  }
}
