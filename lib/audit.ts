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
    console.error("Error al registrar audit log:", error);
  }
}

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
