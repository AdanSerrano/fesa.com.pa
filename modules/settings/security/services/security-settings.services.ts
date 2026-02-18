import { db } from "@/utils/db";
import { logTwoFactorEnabled, logTwoFactorDisabled, getUserAuditLogs } from "@/lib/audit";
import { getAccountSecurityInfo } from "@/lib/account-security";

export interface SecuritySettingsResult {
  success?: string;
  error?: string;
}

export interface SecurityInfo {
  isTwoFactorEnabled: boolean;
  failedAttempts: number;
  lockedUntil: Date | null;
  lastFailedLogin: Date | null;
  email: string | null;
  recentActivity: Array<{
    id: string;
    action: string;
    ipAddress: string | null;
    createdAt: Date;
  }>;
}

export class SecuritySettingsService {
  /**
   * Obtiene la información de seguridad del usuario
   */
  public async getSecurityInfo(userId: string): Promise<SecurityInfo | null> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          isTwoFactorEnabled: true,
          failedLoginAttempts: true,
          lockedUntil: true,
          lastFailedLogin: true,
        },
      });

      if (!user) return null;

      const recentActivity = await getUserAuditLogs(userId, 10);

      return {
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        failedAttempts: user.failedLoginAttempts,
        lockedUntil: user.lockedUntil,
        lastFailedLogin: user.lastFailedLogin,
        email: user.email,
        recentActivity: recentActivity.map((log) => ({
          id: log.id,
          action: log.action,
          ipAddress: log.ipAddress,
          createdAt: log.createdAt,
        })),
      };
    } catch {
      return null;
    }
  }

  /**
   * Activa la autenticación de dos factores
   */
  public async enableTwoFactor(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SecuritySettingsResult> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true, isTwoFactorEnabled: true },
      });

      if (!user) {
        return { error: "Usuario no encontrado" };
      }

      if (user.isTwoFactorEnabled) {
        return { error: "La autenticación de dos factores ya está activada" };
      }

      if (!user.email) {
        return { error: "Necesitas un email verificado para activar 2FA" };
      }

      await db.user.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: true },
      });

      await logTwoFactorEnabled(userId, ipAddress, userAgent);

      return { success: "Autenticación de dos factores activada" };
    } catch {
      return { error: "Error al activar la autenticación de dos factores" };
    }
  }

  /**
   * Desactiva la autenticación de dos factores
   */
  public async disableTwoFactor(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SecuritySettingsResult> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { isTwoFactorEnabled: true },
      });

      if (!user) {
        return { error: "Usuario no encontrado" };
      }

      if (!user.isTwoFactorEnabled) {
        return { error: "La autenticación de dos factores ya está desactivada" };
      }

      await db.user.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: false },
      });

      // Eliminar confirmaciones pendientes
      await db.twoFactorConfirmation.deleteMany({
        where: { userId },
      });

      await logTwoFactorDisabled(userId, ipAddress, userAgent);

      return { success: "Autenticación de dos factores desactivada" };
    } catch {
      return { error: "Error al desactivar la autenticación de dos factores" };
    }
  }
}
