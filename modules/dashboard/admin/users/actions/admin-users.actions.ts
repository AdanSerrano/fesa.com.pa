"use server";

import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { AdminUsersController } from "../controllers/admin-users.controllers";
import type {
  GetUsersParams,
  AdminUsersActionResult,
} from "../types/admin-users.types";

const controller = new AdminUsersController();

async function validateAdminAccess(): Promise<{
  isValid: boolean;
  userId?: string;
  error?: string;
}> {
  const session = await auth();

  if (!session?.user) {
    return { isValid: false, error: "No autenticado" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { isValid: false, error: "Acceso denegado. Se requiere rol de administrador" };
  }

  return { isValid: true, userId: session.user.id };
}

export async function getUsersAction(
  params: GetUsersParams
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid) {
    return { error: validation.error };
  }

  return await controller.getUsers(params);
}

export async function blockUserAction(
  userId: string,
  reason?: string
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid || !validation.userId) {
    return { error: validation.error };
  }

  return await controller.blockUser({
    userId,
    reason,
    currentUserId: validation.userId,
  });
}

export async function unblockUserAction(
  userId: string
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid || !validation.userId) {
    return { error: validation.error };
  }

  return await controller.unblockUser({
    userId,
    currentUserId: validation.userId,
  });
}

export async function changeRoleAction(
  userId: string,
  newRole: Role
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid || !validation.userId) {
    return { error: validation.error };
  }

  return await controller.changeRole({
    userId,
    newRole,
    currentUserId: validation.userId,
  });
}

export async function deleteUserAction(
  userId: string
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid || !validation.userId) {
    return { error: validation.error };
  }

  return await controller.deleteUser({
    userId,
    currentUserId: validation.userId,
  });
}

export async function bulkBlockUsersAction(
  userIds: string[],
  reason?: string
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid || !validation.userId) {
    return { error: validation.error };
  }

  return await controller.bulkBlockUsers({
    userIds,
    reason,
    currentUserId: validation.userId,
  });
}

export async function bulkDeleteUsersAction(
  userIds: string[]
): Promise<AdminUsersActionResult> {
  const validation = await validateAdminAccess();
  if (!validation.isValid || !validation.userId) {
    return { error: validation.error };
  }

  return await controller.bulkDeleteUsers({
    userIds,
    currentUserId: validation.userId,
  });
}
