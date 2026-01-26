"use server";

import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { FileManagerController } from "../controllers/file-manager.controller";
import { revalidatePath } from "next/cache";

const controller = new FileManagerController();

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { error: "Acceso denegado. Se requieren permisos de administrador" };
  }

  return { userId: session.user.id };
}

export async function listR2ObjectsAction(
  prefix?: string,
  continuationToken?: string
) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return { error: authResult.error };
  }

  return await controller.listObjects(prefix, continuationToken);
}

export async function deleteR2ObjectAction(key: string) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return { error: authResult.error };
  }

  const result = await controller.deleteObject(key);

  if (result.success) {
    revalidatePath("/dashboard/admin/files");
  }

  return result;
}

export async function deleteR2FolderAction(prefix: string) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return { error: authResult.error };
  }

  const result = await controller.deleteFolder(prefix);

  if (result.success) {
    revalidatePath("/dashboard/admin/files");
  }

  return result;
}

export async function createR2FolderAction(path: string, folderName: string) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return { error: authResult.error };
  }

  if (!folderName || folderName.trim() === "") {
    return { error: "El nombre de la carpeta es requerido" };
  }

  const sanitizedName = folderName.trim().replace(/[^a-zA-Z0-9-_]/g, "-");

  const result = await controller.createFolder(path, sanitizedName);

  if (result.success) {
    revalidatePath("/dashboard/admin/files");
  }

  return result;
}

export async function getR2UploadUrlAction(
  path: string,
  fileName: string,
  contentType: string
) {
  const authResult = await requireAdmin();
  if (authResult.error) {
    return { error: authResult.error };
  }

  return await controller.getUploadUrl(path, fileName, contentType);
}
