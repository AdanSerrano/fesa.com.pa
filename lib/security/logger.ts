/**
 * Sistema de Logging Estructurado para Seguridad
 *
 * Implementa logging con:
 * - Pino para alto rendimiento
 * - Formato estructurado JSON para producción
 * - Formato legible para desarrollo
 * - Niveles de severidad
 * - Contexto de seguridad (IP, User-Agent, etc.)
 * - Integración con servicios externos (preparado)
 */

import pino from "pino";

// ============================================================================
// TIPOS
// ============================================================================

export type SecurityLogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export interface SecurityLogContext {
  /** ID único del request */
  requestId?: string;
  /** IP del cliente */
  ip?: string;
  /** User-Agent del cliente */
  userAgent?: string;
  /** Path de la solicitud */
  path?: string;
  /** Método HTTP */
  method?: string;
  /** ID del usuario (si está autenticado) */
  userId?: string;
  /** Email del usuario (si está disponible) */
  userEmail?: string;
  /** Tipo de evento de seguridad */
  eventType?: SecurityEventType;
  /** Datos adicionales */
  metadata?: Record<string, unknown>;
}

export type SecurityEventType =
  | "auth_success"
  | "auth_failure"
  | "auth_logout"
  | "rate_limit_exceeded"
  | "suspicious_activity"
  | "blocked_request"
  | "waf_triggered"
  | "brute_force_detected"
  | "injection_attempt"
  | "xss_attempt"
  | "path_traversal"
  | "unauthorized_access"
  | "privilege_escalation"
  | "data_access"
  | "data_modification"
  | "admin_action"
  | "session_anomaly"
  | "geo_anomaly"
  | "device_change"
  | "password_change"
  | "email_change"
  | "2fa_enabled"
  | "2fa_disabled"
  | "account_locked"
  | "account_unlocked";

export interface SecurityLog {
  timestamp: string;
  level: SecurityLogLevel;
  message: string;
  context: SecurityLogContext;
}

// ============================================================================
// CONFIGURACIÓN DE PINO
// ============================================================================

const isProduction = process.env.NODE_ENV === "production";

// Crear logger base
const baseLogger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  formatters: {
    level: (label) => ({ level: label }),
    bindings: () => ({}),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  // En desarrollo usar formato legible
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }),
});

// Logger específico para seguridad
const securityLogger = baseLogger.child({ service: "security" });

// ============================================================================
// ALMACENAMIENTO DE LOGS (PARA AUDITORÍA)
// ============================================================================

// Buffer circular para logs recientes (últimos 1000)
const LOG_BUFFER_SIZE = 1000;
const recentLogs: SecurityLog[] = [];

function addToBuffer(log: SecurityLog): void {
  recentLogs.push(log);
  if (recentLogs.length > LOG_BUFFER_SIZE) {
    recentLogs.shift();
  }
}

// ============================================================================
// FUNCIONES DE LOGGING
// ============================================================================

/**
 * Log genérico de seguridad
 */
export function securityLog(
  level: SecurityLogLevel,
  message: string,
  context: SecurityLogContext = {}
): void {
  const log: SecurityLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };

  // Agregar al buffer para auditoría
  addToBuffer(log);

  // Log con Pino
  const logData = {
    ...context,
    eventType: context.eventType,
  };

  switch (level) {
    case "trace":
      securityLogger.trace(logData, message);
      break;
    case "debug":
      securityLogger.debug(logData, message);
      break;
    case "info":
      securityLogger.info(logData, message);
      break;
    case "warn":
      securityLogger.warn(logData, message);
      break;
    case "error":
      securityLogger.error(logData, message);
      break;
    case "fatal":
      securityLogger.fatal(logData, message);
      break;
  }

  // En producción, enviar a servicio externo si está configurado
  if (isProduction && shouldSendToExternal(level, context.eventType)) {
    sendToExternalService(log).catch((err) => {
      console.error("[LOGGER] Failed to send to external service:", err);
    });
  }
}

/**
 * Determina si un log debe enviarse a servicio externo
 */
function shouldSendToExternal(
  level: SecurityLogLevel,
  eventType?: SecurityEventType
): boolean {
  // Siempre enviar errores y fatales
  if (level === "error" || level === "fatal") return true;

  // Eventos de seguridad críticos
  const criticalEvents: SecurityEventType[] = [
    "brute_force_detected",
    "injection_attempt",
    "xss_attempt",
    "privilege_escalation",
    "account_locked",
    "waf_triggered",
  ];

  return eventType ? criticalEvents.includes(eventType) : false;
}

/**
 * Envía log a servicio externo (placeholder)
 * Implementar según el servicio: Datadog, Splunk, ELK, etc.
 */
async function sendToExternalService(log: SecurityLog): Promise<void> {
  // Placeholder para integración con servicios externos
  // Ejemplo para Datadog:
  // await fetch('https://http-intake.logs.datadoghq.com/v1/input', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'DD-API-KEY': process.env.DATADOG_API_KEY,
  //   },
  //   body: JSON.stringify(log),
  // });

  // Por ahora, solo loguear que se enviaría
  if (process.env.EXTERNAL_LOG_ENDPOINT) {
    try {
      await fetch(process.env.EXTERNAL_LOG_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.EXTERNAL_LOG_API_KEY && {
            Authorization: `Bearer ${process.env.EXTERNAL_LOG_API_KEY}`,
          }),
        },
        body: JSON.stringify(log),
      });
    } catch {
      // Silenciar errores de envío externo
    }
  }
}

// ============================================================================
// HELPERS PARA EVENTOS ESPECÍFICOS
// ============================================================================

/**
 * Log de autenticación exitosa
 */
export function logAuthSuccess(context: SecurityLogContext): void {
  securityLog("info", "Authentication successful", {
    ...context,
    eventType: "auth_success",
  });
}

/**
 * Log de autenticación fallida
 */
export function logAuthFailure(context: SecurityLogContext, reason: string): void {
  securityLog("warn", `Authentication failed: ${reason}`, {
    ...context,
    eventType: "auth_failure",
    metadata: { ...context.metadata, failureReason: reason },
  });
}

/**
 * Log de logout
 */
export function logLogout(context: SecurityLogContext): void {
  securityLog("info", "User logged out", {
    ...context,
    eventType: "auth_logout",
  });
}

/**
 * Log de rate limit excedido
 */
export function logRateLimitExceeded(
  context: SecurityLogContext,
  limitType: string
): void {
  securityLog("warn", `Rate limit exceeded: ${limitType}`, {
    ...context,
    eventType: "rate_limit_exceeded",
    metadata: { ...context.metadata, limitType },
  });
}

/**
 * Log de actividad sospechosa
 */
export function logSuspiciousActivity(
  context: SecurityLogContext,
  description: string
): void {
  securityLog("warn", `Suspicious activity detected: ${description}`, {
    ...context,
    eventType: "suspicious_activity",
    metadata: { ...context.metadata, description },
  });
}

/**
 * Log de request bloqueado
 */
export function logBlockedRequest(
  context: SecurityLogContext,
  reason: string
): void {
  securityLog("warn", `Request blocked: ${reason}`, {
    ...context,
    eventType: "blocked_request",
    metadata: { ...context.metadata, blockReason: reason },
  });
}

/**
 * Log de WAF activado
 */
export function logWAFTriggered(
  context: SecurityLogContext,
  rule: string,
  payload?: string
): void {
  securityLog("error", `WAF rule triggered: ${rule}`, {
    ...context,
    eventType: "waf_triggered",
    metadata: {
      ...context.metadata,
      wafRule: rule,
      // Truncar payload para evitar logs enormes
      payload: payload?.substring(0, 500),
    },
  });
}

/**
 * Log de intento de fuerza bruta detectado
 */
export function logBruteForceDetected(context: SecurityLogContext): void {
  securityLog("error", "Brute force attack detected", {
    ...context,
    eventType: "brute_force_detected",
  });
}

/**
 * Log de acceso a datos sensibles
 */
export function logDataAccess(
  context: SecurityLogContext,
  dataType: string,
  action: "read" | "write" | "delete"
): void {
  securityLog("info", `Data ${action}: ${dataType}`, {
    ...context,
    eventType: action === "read" ? "data_access" : "data_modification",
    metadata: { ...context.metadata, dataType, action },
  });
}

/**
 * Log de acción administrativa
 */
export function logAdminAction(
  context: SecurityLogContext,
  action: string,
  targetUserId?: string
): void {
  securityLog("info", `Admin action: ${action}`, {
    ...context,
    eventType: "admin_action",
    metadata: { ...context.metadata, action, targetUserId },
  });
}

// ============================================================================
// API DE CONSULTA
// ============================================================================

/**
 * Obtiene los logs recientes (para auditoría)
 */
export function getRecentLogs(
  filter?: {
    level?: SecurityLogLevel;
    eventType?: SecurityEventType;
    ip?: string;
    userId?: string;
    since?: Date;
  },
  limit = 100
): SecurityLog[] {
  let logs = [...recentLogs];

  if (filter) {
    if (filter.level) {
      logs = logs.filter((l) => l.level === filter.level);
    }
    if (filter.eventType) {
      logs = logs.filter((l) => l.context.eventType === filter.eventType);
    }
    if (filter.ip) {
      logs = logs.filter((l) => l.context.ip === filter.ip);
    }
    if (filter.userId) {
      logs = logs.filter((l) => l.context.userId === filter.userId);
    }
    if (filter.since) {
      const sinceTime = filter.since.getTime();
      logs = logs.filter((l) => new Date(l.timestamp).getTime() >= sinceTime);
    }
  }

  return logs.slice(-limit).reverse();
}

/**
 * Obtiene estadísticas de seguridad
 */
export function getSecurityStats(): {
  totalLogs: number;
  byLevel: Record<SecurityLogLevel, number>;
  byEventType: Record<string, number>;
  recentAlerts: number;
} {
  const stats = {
    totalLogs: recentLogs.length,
    byLevel: {} as Record<SecurityLogLevel, number>,
    byEventType: {} as Record<string, number>,
    recentAlerts: 0,
  };

  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;

  for (const log of recentLogs) {
    // Por nivel
    stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

    // Por tipo de evento
    if (log.context.eventType) {
      stats.byEventType[log.context.eventType] =
        (stats.byEventType[log.context.eventType] || 0) + 1;
    }

    // Alertas recientes (warn/error/fatal en últimos 15 min)
    if (
      ["warn", "error", "fatal"].includes(log.level) &&
      new Date(log.timestamp).getTime() > fifteenMinutesAgo
    ) {
      stats.recentAlerts++;
    }
  }

  return stats;
}

/**
 * Limpia el buffer de logs
 */
export function clearLogBuffer(): void {
  recentLogs.length = 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { baseLogger, securityLogger };
