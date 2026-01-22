/**
 * Sistema de Alertas de Seguridad
 *
 * Implementa alertas para:
 * - Detección de ataques
 * - Comportamiento anómalo
 * - Eventos críticos de seguridad
 *
 * Canales de notificación:
 * - Email (usando Resend)
 * - Webhook (Slack, Discord, etc.)
 * - SMS (preparado)
 */

import { securityLog, type SecurityLogContext, type SecurityEventType } from "./logger";

// ============================================================================
// TIPOS
// ============================================================================

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type AlertChannel = "email" | "webhook" | "sms" | "console";

export interface Alert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  eventType: SecurityEventType;
  context: SecurityLogContext;
  channels: AlertChannel[];
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  eventTypes: SecurityEventType[];
  severity: AlertSeverity;
  channels: AlertChannel[];
  /** Cantidad de eventos para activar */
  threshold: number;
  /** Ventana de tiempo en ms */
  windowMs: number;
  /** Cooldown entre alertas en ms */
  cooldownMs: number;
  enabled: boolean;
}

// ============================================================================
// CONFIGURACIÓN DE REGLAS DE ALERTA
// ============================================================================

export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: "brute_force",
    name: "Ataque de Fuerza Bruta",
    description: "Múltiples intentos fallidos de autenticación desde la misma IP",
    eventTypes: ["auth_failure", "brute_force_detected"],
    severity: "critical",
    channels: ["email", "webhook", "console"],
    threshold: 5,
    windowMs: 5 * 60 * 1000, // 5 minutos
    cooldownMs: 30 * 60 * 1000, // 30 minutos
    enabled: true,
  },
  {
    id: "waf_attack",
    name: "Ataque WAF Detectado",
    description: "Intento de inyección o ataque web detectado",
    eventTypes: ["waf_triggered", "injection_attempt", "xss_attempt"],
    severity: "critical",
    channels: ["email", "webhook", "console"],
    threshold: 1,
    windowMs: 60 * 1000, // 1 minuto
    cooldownMs: 5 * 60 * 1000, // 5 minutos
    enabled: true,
  },
  {
    id: "rate_limit_abuse",
    name: "Abuso de Rate Limit",
    description: "IP excediendo límites de tasa repetidamente",
    eventTypes: ["rate_limit_exceeded"],
    severity: "high",
    channels: ["webhook", "console"],
    threshold: 10,
    windowMs: 5 * 60 * 1000, // 5 minutos
    cooldownMs: 15 * 60 * 1000, // 15 minutos
    enabled: true,
  },
  {
    id: "suspicious_activity",
    name: "Actividad Sospechosa",
    description: "Comportamiento anómalo detectado",
    eventTypes: ["suspicious_activity", "path_traversal"],
    severity: "medium",
    channels: ["webhook", "console"],
    threshold: 3,
    windowMs: 10 * 60 * 1000, // 10 minutos
    cooldownMs: 30 * 60 * 1000, // 30 minutos
    enabled: true,
  },
  {
    id: "account_security",
    name: "Evento de Seguridad de Cuenta",
    description: "Cambio importante en la seguridad de una cuenta",
    eventTypes: ["password_change", "2fa_disabled", "account_locked"],
    severity: "high",
    channels: ["email", "console"],
    threshold: 1,
    windowMs: 60 * 1000,
    cooldownMs: 0, // Sin cooldown para estos eventos
    enabled: true,
  },
  {
    id: "privilege_escalation",
    name: "Intento de Escalada de Privilegios",
    description: "Intento de acceder a recursos no autorizados",
    eventTypes: ["privilege_escalation", "unauthorized_access"],
    severity: "critical",
    channels: ["email", "webhook", "console"],
    threshold: 1,
    windowMs: 60 * 1000,
    cooldownMs: 5 * 60 * 1000,
    enabled: true,
  },
];

// ============================================================================
// ESTADO DEL SISTEMA DE ALERTAS
// ============================================================================

// Eventos recientes para evaluación de reglas
const eventBuffer: Map<string, { timestamp: number; context: SecurityLogContext }[]> =
  new Map();

// Último tiempo de alerta por regla (para cooldown)
const lastAlertTime: Map<string, number> = new Map();

// Alertas activas
const activeAlerts: Alert[] = [];
const MAX_ACTIVE_ALERTS = 100;

// Reglas de alerta (inicializar con defaults)
let alertRules: AlertRule[] = [...DEFAULT_ALERT_RULES];

// ============================================================================
// FUNCIONES DE GESTIÓN DE ALERTAS
// ============================================================================

/**
 * Genera un ID único para alertas
 */
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Agrega un evento al buffer para evaluación
 */
export function recordSecurityEvent(
  eventType: SecurityEventType,
  context: SecurityLogContext
): void {
  const key = `${eventType}:${context.ip || "unknown"}`;
  const events = eventBuffer.get(key) || [];

  events.push({
    timestamp: Date.now(),
    context,
  });

  // Limpiar eventos antiguos (más de 1 hora)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const filteredEvents = events.filter((e) => e.timestamp > oneHourAgo);

  eventBuffer.set(key, filteredEvents);

  // Evaluar reglas de alerta
  evaluateAlertRules(eventType, context);
}

/**
 * Evalúa las reglas de alerta para un evento
 */
function evaluateAlertRules(
  eventType: SecurityEventType,
  context: SecurityLogContext
): void {
  const now = Date.now();

  for (const rule of alertRules) {
    if (!rule.enabled || !rule.eventTypes.includes(eventType)) {
      continue;
    }

    // Verificar cooldown
    const lastAlert = lastAlertTime.get(rule.id);
    if (lastAlert && now - lastAlert < rule.cooldownMs) {
      continue;
    }

    // Contar eventos en la ventana de tiempo
    const key = `${eventType}:${context.ip || "unknown"}`;
    const events = eventBuffer.get(key) || [];
    const windowStart = now - rule.windowMs;
    const eventsInWindow = events.filter((e) => e.timestamp >= windowStart);

    if (eventsInWindow.length >= rule.threshold) {
      // Activar alerta
      triggerAlert(rule, eventType, context, eventsInWindow.length);
      lastAlertTime.set(rule.id, now);
    }
  }
}

/**
 * Activa una alerta
 */
async function triggerAlert(
  rule: AlertRule,
  eventType: SecurityEventType,
  context: SecurityLogContext,
  eventCount: number
): Promise<void> {
  const alert: Alert = {
    id: generateAlertId(),
    timestamp: new Date().toISOString(),
    severity: rule.severity,
    title: rule.name,
    description: `${rule.description}. Eventos detectados: ${eventCount}`,
    eventType,
    context,
    channels: rule.channels,
    acknowledged: false,
  };

  // Agregar a alertas activas
  activeAlerts.unshift(alert);
  if (activeAlerts.length > MAX_ACTIVE_ALERTS) {
    activeAlerts.pop();
  }

  // Log de la alerta
  securityLog(
    rule.severity === "critical" ? "fatal" : rule.severity === "high" ? "error" : "warn",
    `ALERT: ${rule.name}`,
    {
      ...context,
      eventType,
      metadata: {
        ...context.metadata,
        alertId: alert.id,
        ruleId: rule.id,
        eventCount,
      },
    }
  );

  // Enviar notificaciones por cada canal
  for (const channel of rule.channels) {
    try {
      await sendAlertNotification(alert, channel);
    } catch (error) {
      console.error(`[ALERTS] Failed to send notification via ${channel}:`, error);
    }
  }
}

/**
 * Envía notificación de alerta por el canal especificado
 */
async function sendAlertNotification(
  alert: Alert,
  channel: AlertChannel
): Promise<void> {
  switch (channel) {
    case "email":
      await sendEmailAlert(alert);
      break;
    case "webhook":
      await sendWebhookAlert(alert);
      break;
    case "sms":
      await sendSMSAlert(alert);
      break;
    case "console":
      logConsoleAlert(alert);
      break;
  }
}

/**
 * Envía alerta por email usando Resend
 */
async function sendEmailAlert(alert: Alert): Promise<void> {
  const adminEmail = process.env.SECURITY_ADMIN_EMAIL;
  if (!adminEmail) return;

  try {
    const { resend } = await import("@/utils/resend");

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "security@localhost",
      to: adminEmail,
      subject: `[${alert.severity.toUpperCase()}] Alerta de Seguridad: ${alert.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${getSeverityColor(alert.severity)}; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Alerta de Seguridad</h1>
            <p style="margin: 10px 0 0 0;">${alert.severity.toUpperCase()}</p>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">${alert.title}</h2>
            <p style="color: #666;">${alert.description}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Timestamp</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${alert.timestamp}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Tipo de Evento</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${alert.eventType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">IP</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${alert.context.ip || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Path</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${alert.context.path || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">User Agent</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; word-break: break-all;">${alert.context.userAgent || "N/A"}</td>
              </tr>
              ${alert.context.userId ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">User ID</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${alert.context.userId}</td>
              </tr>
              ` : ""}
            </table>

            <p style="margin-top: 20px; color: #999; font-size: 12px;">
              Alert ID: ${alert.id}
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("[ALERTS] Failed to send email:", error);
  }
}

/**
 * Envía alerta por webhook (Slack, Discord, etc.)
 */
async function sendWebhookAlert(alert: Alert): Promise<void> {
  const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    // Formato compatible con Slack
    const payload = {
      text: `🚨 *Alerta de Seguridad* [${alert.severity.toUpperCase()}]`,
      attachments: [
        {
          color: getSeverityColor(alert.severity),
          title: alert.title,
          text: alert.description,
          fields: [
            {
              title: "Tipo de Evento",
              value: alert.eventType,
              short: true,
            },
            {
              title: "IP",
              value: alert.context.ip || "N/A",
              short: true,
            },
            {
              title: "Path",
              value: alert.context.path || "N/A",
              short: true,
            },
            {
              title: "Timestamp",
              value: alert.timestamp,
              short: true,
            },
          ],
          footer: `Alert ID: ${alert.id}`,
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[ALERTS] Failed to send webhook:", error);
  }
}

/**
 * Envía alerta por SMS (placeholder)
 */
async function sendSMSAlert(alert: Alert): Promise<void> {
  const phoneNumber = process.env.SECURITY_PHONE_NUMBER;
  if (!phoneNumber) return;

  // Implementar con Twilio, AWS SNS, etc.
  console.log(`[ALERTS] SMS to ${phoneNumber}: ${alert.title} - ${alert.severity}`);

  // Ejemplo con Twilio (comentado):
  // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  // await twilio.messages.create({
  //   body: `[${alert.severity}] ${alert.title}: ${alert.description}`,
  //   from: process.env.TWILIO_PHONE,
  //   to: phoneNumber,
  // });
}

/**
 * Log de alerta en consola con formato
 */
function logConsoleAlert(alert: Alert): void {
  const severityEmoji = {
    low: "ℹ️",
    medium: "⚠️",
    high: "🔶",
    critical: "🚨",
  };

  console.log(`
${severityEmoji[alert.severity]} ═══════════════════════════════════════════════════
  SECURITY ALERT [${alert.severity.toUpperCase()}]
  ${alert.title}
  ───────────────────────────────────────────────────
  ${alert.description}

  Event Type: ${alert.eventType}
  IP: ${alert.context.ip || "N/A"}
  Path: ${alert.context.path || "N/A"}
  Time: ${alert.timestamp}
  Alert ID: ${alert.id}
═══════════════════════════════════════════════════
  `);
}

/**
 * Obtiene el color según severidad
 */
function getSeverityColor(severity: AlertSeverity): string {
  const colors = {
    low: "#17a2b8",
    medium: "#ffc107",
    high: "#fd7e14",
    critical: "#dc3545",
  };
  return colors[severity];
}

// ============================================================================
// API PÚBLICA
// ============================================================================

/**
 * Obtiene las alertas activas
 */
export function getActiveAlerts(
  filter?: { severity?: AlertSeverity; acknowledged?: boolean },
  limit = 50
): Alert[] {
  let alerts = [...activeAlerts];

  if (filter) {
    if (filter.severity) {
      alerts = alerts.filter((a) => a.severity === filter.severity);
    }
    if (filter.acknowledged !== undefined) {
      alerts = alerts.filter((a) => a.acknowledged === filter.acknowledged);
    }
  }

  return alerts.slice(0, limit);
}

/**
 * Reconoce una alerta
 */
export function acknowledgeAlert(alertId: string, userId: string): boolean {
  const alert = activeAlerts.find((a) => a.id === alertId);
  if (!alert) return false;

  alert.acknowledged = true;
  alert.acknowledgedAt = new Date().toISOString();
  alert.acknowledgedBy = userId;

  return true;
}

/**
 * Obtiene las reglas de alerta
 */
export function getAlertRules(): AlertRule[] {
  return [...alertRules];
}

/**
 * Actualiza una regla de alerta
 */
export function updateAlertRule(ruleId: string, updates: Partial<AlertRule>): boolean {
  const index = alertRules.findIndex((r) => r.id === ruleId);
  if (index === -1) return false;

  alertRules[index] = { ...alertRules[index], ...updates };
  return true;
}

/**
 * Agrega una nueva regla de alerta
 */
export function addAlertRule(rule: AlertRule): void {
  alertRules.push(rule);
}

/**
 * Elimina una regla de alerta
 */
export function removeAlertRule(ruleId: string): boolean {
  const index = alertRules.findIndex((r) => r.id === ruleId);
  if (index === -1) return false;

  alertRules.splice(index, 1);
  return true;
}

/**
 * Obtiene estadísticas de alertas
 */
export function getAlertStats(): {
  total: number;
  unacknowledged: number;
  bySeverity: Record<AlertSeverity, number>;
  last24h: number;
} {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return {
    total: activeAlerts.length,
    unacknowledged: activeAlerts.filter((a) => !a.acknowledged).length,
    bySeverity: {
      low: activeAlerts.filter((a) => a.severity === "low").length,
      medium: activeAlerts.filter((a) => a.severity === "medium").length,
      high: activeAlerts.filter((a) => a.severity === "high").length,
      critical: activeAlerts.filter((a) => a.severity === "critical").length,
    },
    last24h: activeAlerts.filter(
      (a) => new Date(a.timestamp).getTime() > oneDayAgo
    ).length,
  };
}

/**
 * Dispara una alerta manual
 */
export async function triggerManualAlert(
  severity: AlertSeverity,
  title: string,
  description: string,
  context: SecurityLogContext
): Promise<string> {
  const alert: Alert = {
    id: generateAlertId(),
    timestamp: new Date().toISOString(),
    severity,
    title,
    description,
    eventType: "suspicious_activity",
    context,
    channels: ["email", "webhook", "console"],
    acknowledged: false,
  };

  activeAlerts.unshift(alert);
  if (activeAlerts.length > MAX_ACTIVE_ALERTS) {
    activeAlerts.pop();
  }

  for (const channel of alert.channels) {
    try {
      await sendAlertNotification(alert, channel);
    } catch (error) {
      console.error(`[ALERTS] Failed to send notification via ${channel}:`, error);
    }
  }

  return alert.id;
}
