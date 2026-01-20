import { db } from "@/utils/db";
import { logAccountLocked, logLoginFailed } from "./audit";
import { AuthErrorCode, createAuthError, formatAccountLockedError } from "./errors";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos

export interface AccountSecurityResult {
  allowed: boolean;
  error?: {
    code: AuthErrorCode;
    message: string;
  };
  remainingAttempts?: number;
}

export async function checkAccountLock(
  userId: string
): Promise<AccountSecurityResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        lockedUntil: true,
        failedLoginAttempts: true,
      },
    });

    if (!user) {
      return { allowed: true };
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const authError = formatAccountLockedError(user.lockedUntil);
      return {
        allowed: false,
        error: {
          code: authError.code,
          message: authError.message,
        },
      };
    }

    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await db.user.update({
        where: { id: userId },
        data: {
          lockedUntil: null,
          failedLoginAttempts: 0,
        },
      });
    }

    return {
      allowed: true,
      remainingAttempts: MAX_FAILED_ATTEMPTS - user.failedLoginAttempts,
    };
  } catch (error) {
    console.error("Error checking account lock:", error);
    return { allowed: true };
  }
}

export async function recordFailedLogin(
  userId: string,
  email: string,
  reason: string,
  ipAddress?: string,
  userAgent?: string
): Promise<AccountSecurityResult> {
  try {
    await logLoginFailed(email, reason, ipAddress, userAgent);

    const user = await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: { increment: 1 },
        lastFailedLogin: new Date(),
      },
      select: {
        failedLoginAttempts: true,
      },
    });

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);

      await db.user.update({
        where: { id: userId },
        data: { lockedUntil },
      });

      await logAccountLocked(userId, "Demasiados intentos fallidos", ipAddress, userAgent);

      const authError = formatAccountLockedError(lockedUntil);
      return {
        allowed: false,
        error: {
          code: authError.code,
          message: authError.message,
        },
      };
    }

    return {
      allowed: true,
      remainingAttempts: MAX_FAILED_ATTEMPTS - user.failedLoginAttempts,
    };
  } catch (error) {
    console.error("Error recording failed login:", error);
    return { allowed: true };
  }
}

export async function resetFailedAttempts(userId: string): Promise<void> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
      },
    });
  } catch (error) {
    console.error("Error resetting failed attempts:", error);
  }
}

export async function unlockAccount(
  userId: string,
  adminId?: string
): Promise<boolean> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
      },
    });

    return true;
  } catch (error) {
    console.error("Error unlocking account:", error);
    return false;
  }
}

export async function getAccountSecurityInfo(userId: string): Promise<{
  failedAttempts: number;
  lockedUntil: Date | null;
  lastFailedLogin: Date | null;
  isTwoFactorEnabled: boolean;
} | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        failedLoginAttempts: true,
        lockedUntil: true,
        lastFailedLogin: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user) return null;

    return {
      failedAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
      lastFailedLogin: user.lastFailedLogin,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };
  } catch (error) {
    console.error("Error getting account security info:", error);
    return null;
  }
}
