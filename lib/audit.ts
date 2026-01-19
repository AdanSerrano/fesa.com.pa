import { AuditAction } from "@/app/prisma/enums";
import { db } from "@/utils/db";
import type { Prisma } from "@/app/prisma/client";


export interface AuditLogData {
  userId?: string;
  action: AuditAction;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Registra un evento de auditoría en la base de datos
 */
export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    // No fallar si el audit log falla, solo loggear
    console.error("Error al registrar audit log:", error);
  }
}

/**
 * Registra un intento de login exitoso
 */
export async function logLoginSuccess(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.LOGIN_SUCCESS,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra un intento de login fallido
 */
export async function logLoginFailed(
  email: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    action: AuditAction.LOGIN_FAILED,
    ipAddress,
    userAgent,
    metadata: { email, reason },
  });
}

/**
 * Registra un logout
 */
export async function logLogout(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.LOGOUT,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra una solicitud de reset de password
 */
export async function logPasswordResetRequested(
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    action: AuditAction.PASSWORD_RESET_REQUESTED,
    ipAddress,
    userAgent,
    metadata: { email },
  });
}

/**
 * Registra un reset de password completado
 */
export async function logPasswordResetCompleted(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.PASSWORD_RESET_COMPLETED,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra verificación de email
 */
export async function logEmailVerified(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.EMAIL_VERIFIED,
    ipAddress,
    userAgent,
    metadata: { email },
  });
}

/**
 * Registra activación de 2FA
 */
export async function logTwoFactorEnabled(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.TWO_FACTOR_ENABLED,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra desactivación de 2FA
 */
export async function logTwoFactorDisabled(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.TWO_FACTOR_DISABLED,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra verificación de 2FA exitosa
 */
export async function logTwoFactorVerified(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.TWO_FACTOR_VERIFIED,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra bloqueo de cuenta
 */
export async function logAccountLocked(
  userId: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.ACCOUNT_LOCKED,
    ipAddress,
    userAgent,
    metadata: { reason },
  });
}

/**
 * Registra desbloqueo de cuenta
 */
export async function logAccountUnlocked(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.ACCOUNT_UNLOCKED,
    ipAddress,
    userAgent,
  });
}

/**
 * Registra un nuevo registro de usuario
 */
export async function logRegistration(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditAction.REGISTRATION,
    ipAddress,
    userAgent,
    metadata: { email },
  });
}

/**
 * Obtiene los últimos eventos de auditoría de un usuario
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50
): Promise<Array<{
  id: string;
  action: AuditAction;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  createdAt: Date;
}>> {
  return db.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      ipAddress: true,
      userAgent: true,
      metadata: true,
      createdAt: true,
    },
  });
}
