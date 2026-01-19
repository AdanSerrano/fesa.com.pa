/**
 * Sistema centralizado de manejo de errores para autenticación
 */

export enum AuthErrorCode {
  // Errores de credenciales
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_PASSWORD = "INVALID_PASSWORD",

  // Errores de verificación
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_ALREADY_USED = "TOKEN_ALREADY_USED",

  // Errores de rate limiting y seguridad
  RATE_LIMITED = "RATE_LIMITED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",

  // Errores de 2FA
  TWO_FACTOR_REQUIRED = "TWO_FACTOR_REQUIRED",
  TWO_FACTOR_INVALID = "TWO_FACTOR_INVALID",
  TWO_FACTOR_EXPIRED = "TWO_FACTOR_EXPIRED",

  // Errores de validación
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Errores de registro
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS",

  // Errores generales
  INTERNAL_ERROR = "INTERNAL_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: "Credenciales inválidas",
  [AuthErrorCode.USER_NOT_FOUND]: "Usuario no encontrado",
  [AuthErrorCode.INVALID_PASSWORD]: "Contraseña incorrecta",
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: "Tu cuenta aún no está verificada. Revisa tu correo electrónico.",
  [AuthErrorCode.TOKEN_EXPIRED]: "El enlace ha expirado. Solicita uno nuevo.",
  [AuthErrorCode.TOKEN_INVALID]: "El enlace no es válido o ya fue utilizado.",
  [AuthErrorCode.TOKEN_ALREADY_USED]: "Este enlace ya fue utilizado.",
  [AuthErrorCode.RATE_LIMITED]: "Demasiados intentos. Intenta de nuevo más tarde.",
  [AuthErrorCode.ACCOUNT_LOCKED]: "Tu cuenta ha sido bloqueada temporalmente por seguridad.",
  [AuthErrorCode.TOO_MANY_ATTEMPTS]: "Demasiados intentos fallidos.",
  [AuthErrorCode.TWO_FACTOR_REQUIRED]: "Se requiere verificación de dos factores.",
  [AuthErrorCode.TWO_FACTOR_INVALID]: "Código de verificación incorrecto.",
  [AuthErrorCode.TWO_FACTOR_EXPIRED]: "El código ha expirado. Solicita uno nuevo.",
  [AuthErrorCode.VALIDATION_ERROR]: "Los datos proporcionados no son válidos.",
  [AuthErrorCode.INVALID_INPUT]: "Campos inválidos.",
  [AuthErrorCode.EMAIL_ALREADY_EXISTS]: "Ya existe una cuenta con este correo electrónico.",
  [AuthErrorCode.USERNAME_ALREADY_EXISTS]: "Este nombre de usuario ya está en uso.",
  [AuthErrorCode.INTERNAL_ERROR]: "Error interno del servidor.",
  [AuthErrorCode.UNKNOWN_ERROR]: "Ha ocurrido un error inesperado.",
};

export function createAuthError(
  code: AuthErrorCode,
  options?: {
    message?: string;
    field?: string;
    details?: Record<string, unknown>;
  }
): AuthError {
  return {
    code,
    message: options?.message || ERROR_MESSAGES[code],
    field: options?.field,
    details: options?.details,
  };
}

export function getErrorMessage(code: AuthErrorCode): string {
  return ERROR_MESSAGES[code];
}

export function formatRateLimitError(resetIn: number): AuthError {
  const minutes = Math.ceil(resetIn / 60000);
  const timeStr = minutes === 1 ? "1 minuto" : `${minutes} minutos`;

  return createAuthError(AuthErrorCode.RATE_LIMITED, {
    message: `Demasiados intentos fallidos. Intenta de nuevo en ${timeStr}.`,
    details: { resetIn },
  });
}

export function formatAccountLockedError(lockedUntil: Date): AuthError {
  const now = new Date();
  const diffMs = lockedUntil.getTime() - now.getTime();
  const diffMins = Math.ceil(diffMs / 60000);
  const timeStr = diffMins <= 1 ? "1 minuto" : `${diffMins} minutos`;

  return createAuthError(AuthErrorCode.ACCOUNT_LOCKED, {
    message: `Tu cuenta ha sido bloqueada temporalmente. Intenta de nuevo en ${timeStr}.`,
    details: { lockedUntil: lockedUntil.toISOString() },
  });
}

/**
 * Logger centralizado para errores de autenticación
 * En producción, esto debería enviar a un servicio como Sentry
 */
export function logAuthError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>
): void {
  const errorInfo = {
    context,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    metadata,
  };

  // En desarrollo, usar console.error
  // En producción, enviar a servicio de monitoreo (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === "development") {
    console.error("[Auth Error]", JSON.stringify(errorInfo, null, 2));
  } else {
    // TODO: Integrar con servicio de monitoreo
    console.error("[Auth Error]", JSON.stringify(errorInfo));
  }
}

/**
 * Resultado estándar para operaciones de autenticación
 */
export interface AuthResult<T = unknown> {
  success?: string;
  error?: string;
  errorCode?: AuthErrorCode;
  data?: T;
  redirect?: string;
}

export function successResult<T>(message: string, data?: T): AuthResult<T> {
  return { success: message, data };
}

export function errorResult(
  code: AuthErrorCode,
  customMessage?: string
): AuthResult {
  return {
    error: customMessage || ERROR_MESSAGES[code],
    errorCode: code,
  };
}
