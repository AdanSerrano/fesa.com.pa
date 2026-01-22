/**
 * Security Audit Endpoint
 *
 * Endpoint protegido para obtener información de auditoría de seguridad.
 * Solo accesible para administradores autenticados.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getRecentLogs,
  getSecurityStats,
  getActiveAlerts,
  getAlertStats,
  getWAFStats,
  type SecurityLogLevel,
  type SecurityEventType,
} from "@/lib/security";

interface AuditResponse {
  success: boolean;
  data?: {
    summary: {
      totalLogs: number;
      recentAlerts: number;
      unacknowledgedAlerts: number;
      wafBlockedIPs: number;
    };
    logs: {
      byLevel: Record<SecurityLogLevel, number>;
      byEventType: Record<string, number>;
    };
    alerts: {
      total: number;
      bySeverity: Record<string, number>;
      last24h: number;
    };
    waf: {
      totalRules: number;
      enabledRules: number;
    };
    recentEvents: unknown[];
    activeAlerts: unknown[];
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AuditResponse>> {
  // Verificar autenticación
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  // Verificar que es administrador
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Acceso denegado. Se requiere rol de administrador." },
      { status: 403 }
    );
  }

  try {
    // Obtener parámetros de filtro
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get("level") as SecurityLogLevel | null;
    const eventType = searchParams.get("eventType") as SecurityEventType | null;
    const ip = searchParams.get("ip");
    const userId = searchParams.get("userId");
    const since = searchParams.get("since");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // Construir filtro
    const filter: {
      level?: SecurityLogLevel;
      eventType?: SecurityEventType;
      ip?: string;
      userId?: string;
      since?: Date;
    } = {};

    if (level) filter.level = level;
    if (eventType) filter.eventType = eventType;
    if (ip) filter.ip = ip;
    if (userId) filter.userId = userId;
    if (since) filter.since = new Date(since);

    // Obtener datos
    const securityStats = getSecurityStats();
    const alertStats = getAlertStats();
    const wafStats = getWAFStats();
    const recentLogs = getRecentLogs(
      Object.keys(filter).length > 0 ? filter : undefined,
      limit
    );
    const activeAlerts = getActiveAlerts({ acknowledged: false }, 20);

    const response: AuditResponse = {
      success: true,
      data: {
        summary: {
          totalLogs: securityStats.totalLogs,
          recentAlerts: securityStats.recentAlerts,
          unacknowledgedAlerts: alertStats.unacknowledged,
          wafBlockedIPs: wafStats.blockedIPs,
        },
        logs: {
          byLevel: securityStats.byLevel,
          byEventType: securityStats.byEventType,
        },
        alerts: {
          total: alertStats.total,
          bySeverity: alertStats.bySeverity,
          last24h: alertStats.last24h,
        },
        waf: {
          totalRules: wafStats.totalRules,
          enabledRules: wafStats.enabledRules,
        },
        recentEvents: recentLogs,
        activeAlerts: activeAlerts,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[AUDIT] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener datos de auditoría" },
      { status: 500 }
    );
  }
}

/**
 * POST - Reconocer una alerta
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Acceso denegado" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { action, alertId } = body;

    if (action === "acknowledge" && alertId) {
      const { acknowledgeAlert } = await import("@/lib/security");
      const success = acknowledgeAlert(alertId, session.user.id || "unknown");

      return NextResponse.json({ success });
    }

    return NextResponse.json(
      { success: false, error: "Acción no válida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[AUDIT] POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
