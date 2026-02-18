"use server";

import { currentUser } from "@/lib/user";
import { Role } from "@/app/prisma/client";
import { AdminAboutRepository } from "../repository/admin-about.repository";
import { updateAboutSectionSchema } from "../validations/schema/admin-about.schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_CONFIG } from "@/lib/aws/s3-client";
import type {
  AboutSection,
  UpdateAboutSectionParams,
  AdminAboutActionResult,
} from "../types/admin-about.types";

const repository = new AdminAboutRepository();

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

export async function getAllAboutSectionsAction(): Promise<AboutSection[]> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return [];
  }

  return await repository.getAllSections();
}

export async function updateAboutSectionAction(
  params: UpdateAboutSectionParams
): Promise<AdminAboutActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = updateAboutSectionSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    const section = await repository.upsertSection(inputValidation.data);
    return { success: "Sección actualizada correctamente", data: section };
  } catch {
    return { error: "Error al actualizar la sección" };
  }
}

export async function toggleAboutSectionStatusAction(
  section: string,
  isActive: boolean
): Promise<AdminAboutActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  try {
    const data = await repository.toggleSectionStatus(section, isActive);
    return { success: "Estado actualizado", data };
  } catch {
    return { error: "Error al actualizar el estado" };
  }
}

export async function getAboutMediaUploadUrlAction(
  section: string,
  fileName: string,
  contentType: string
): Promise<{ url: string; publicUrl: string } | { error: string }> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error || "No autorizado" };
  }

  const extension = fileName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const key = `public/about/${section}-${timestamp}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: R2_CONFIG.bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = R2_CONFIG.publicUrl ? `${R2_CONFIG.publicUrl}/${key}` : "";

  return { url, publicUrl };
}
