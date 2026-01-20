import { db } from "@/utils/db";
import { AuditAction } from "@/app/prisma/enums";
import { logAuditEvent } from "./audit";

export interface BlockUserResult {
  success: boolean;
  error?: string;
}

export interface UserBlockStatus {
  isBlocked: boolean;
  blockedAt: Date | null;
  blockedReason: string | null;
  blockedServices: string[];
}

/**
 * Bloquea a un usuario completamente del sistema
 */
export async function blockUser(
  userId: string,
  reason: string,
  adminId?: string
): Promise<BlockUserResult> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason,
      },
    });

    await logAuditEvent({
      userId,
      action: AuditAction.USER_BLOCKED,
      metadata: { reason, blockedBy: adminId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error blocking user:", error);
    return { success: false, error: "Error al bloquear usuario" };
  }
}

/**
 * Desbloquea a un usuario del sistema
 */
export async function unblockUser(
  userId: string,
  adminId?: string
): Promise<BlockUserResult> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        isBlocked: false,
        blockedAt: null,
        blockedReason: null,
      },
    });

    await logAuditEvent({
      userId,
      action: AuditAction.USER_UNBLOCKED,
      metadata: { unblockedBy: adminId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error unblocking user:", error);
    return { success: false, error: "Error al desbloquear usuario" };
  }
}

/**
 * Bloquea a un usuario de servicios específicos
 */
export async function blockUserFromServices(
  userId: string,
  services: string[],
  adminId?: string
): Promise<BlockUserResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { blockedServices: true },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Combinar servicios existentes con los nuevos (sin duplicados)
    const currentServices = user.blockedServices || [];
    const newServices = [...new Set([...currentServices, ...services])];

    await db.user.update({
      where: { id: userId },
      data: { blockedServices: newServices },
    });

    await logAuditEvent({
      userId,
      action: AuditAction.SERVICE_BLOCKED,
      metadata: { services, blockedBy: adminId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error blocking user from services:", error);
    return { success: false, error: "Error al bloquear servicios" };
  }
}

/**
 * Desbloquea a un usuario de servicios específicos
 */
export async function unblockUserFromServices(
  userId: string,
  services: string[],
  adminId?: string
): Promise<BlockUserResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { blockedServices: true },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Remover los servicios especificados
    const currentServices = user.blockedServices || [];
    const newServices = currentServices.filter((s) => !services.includes(s));

    await db.user.update({
      where: { id: userId },
      data: { blockedServices: newServices },
    });

    await logAuditEvent({
      userId,
      action: AuditAction.SERVICE_UNBLOCKED,
      metadata: { services, unblockedBy: adminId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error unblocking user from services:", error);
    return { success: false, error: "Error al desbloquear servicios" };
  }
}

/**
 * Verifica si un usuario está bloqueado del sistema
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isBlocked: true },
    });

    return user?.isBlocked ?? false;
  } catch (error) {
    console.error("Error checking if user is blocked:", error);
    return false;
  }
}

/**
 * Verifica si un usuario está bloqueado de un servicio específico
 */
export async function isUserBlockedFromService(
  userId: string,
  service: string
): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isBlocked: true, blockedServices: true },
    });

    if (!user) return false;

    // Si está bloqueado completamente, está bloqueado de todos los servicios
    if (user.isBlocked) return true;

    // Verificar si está bloqueado del servicio específico
    return user.blockedServices?.includes(service) ?? false;
  } catch (error) {
    console.error("Error checking if user is blocked from service:", error);
    return false;
  }
}

/**
 * Obtiene el estado de bloqueo de un usuario
 */
export async function getUserBlockStatus(
  userId: string
): Promise<UserBlockStatus | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        isBlocked: true,
        blockedAt: true,
        blockedReason: true,
        blockedServices: true,
      },
    });

    if (!user) return null;

    return {
      isBlocked: user.isBlocked,
      blockedAt: user.blockedAt,
      blockedReason: user.blockedReason,
      blockedServices: user.blockedServices || [],
    };
  } catch (error) {
    console.error("Error getting user block status:", error);
    return null;
  }
}

/**
 * Lista de servicios disponibles para bloquear
 * Puedes agregar más según tus necesidades
 */
export const AVAILABLE_SERVICES = {
  PREMIUM: "premium",
  API: "api",
  EXPORTS: "exports",
  REPORTS: "reports",
  INTEGRATIONS: "integrations",
  ANALYTICS: "analytics",
} as const;

export type ServiceType = (typeof AVAILABLE_SERVICES)[keyof typeof AVAILABLE_SERVICES];
