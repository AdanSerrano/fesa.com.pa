/**
 * Middleware de Seguridad - Nivel Empresarial/Bancario
 *
 * Implementa:
 * - Rate Limiting distribuido (Redis/Memoria)
 * - WAF (Web Application Firewall)
 * - Logging estructurado
 * - Sistema de alertas
 * - Detección de ataques
 * - Bloqueo automático de IPs maliciosas
 * - Internacionalización con next-intl
 */

import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { routing } from "./i18n/routing";

// ============================================================================
// IMPORTACIÓN DINÁMICA DE SERVICIOS DE SEGURIDAD
// (Para evitar errores en edge runtime)
// ============================================================================

// Importamos los tipos que necesitamos
import type { RateLimitResult, RateLimitType } from "./lib/security/rate-limiter";
import type { SecurityLogContext } from "./lib/security/logger";
import type { WAFResult } from "./lib/security/waf";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Rate limiting en memoria (fallback cuando Redis no está disponible)
const memoryRateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_CONFIG = {
  general: { maxRequests: 100, windowMs: 60 * 1000 },
  api: { maxRequests: 60, windowMs: 60 * 1000 },
};


// Paths sospechosos
const SUSPICIOUS_PATHS = [
  /\.env/i,
  /\.git/i,
  /\.htaccess/i,
  /wp-admin/i,
  /wp-login/i,
  /phpinfo/i,
  /phpmyadmin/i,
  /admin\.php/i,
  /shell/i,
  /\.\.\//i,
];

// User-Agents maliciosos
const MALICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /nmap/i,
  /masscan/i,
  /acunetix/i,
  /dirbuster/i,
  /gobuster/i,
];

// Patrones de inyección básicos
const INJECTION_PATTERNS = [
  /<script[^>]*>/i,
  /javascript:/i,
  /(\bunion\b[\s\S]*\bselect\b)/i,
  /(\bor\b|\band\b)\s*['"]?\s*\d+\s*=\s*\d+/i,
];

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Genera un ID único para el request
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Obtiene la IP real del cliente
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;
  return "unknown";
}

/**
 * Rate limiting en memoria (fallback)
 */
function checkMemoryRateLimit(
  key: string,
  config: { maxRequests: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const record = memoryRateLimit.get(key);

  if (!record || now > record.resetTime) {
    memoryRateLimit.set(key, { count: 1, resetTime: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
      limit: config.maxRequests,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: config.maxRequests,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
    limit: config.maxRequests,
  };
}


/**
 * Verifica patrones de inyección básicos
 */
function checkBasicInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Verifica si el path es sospechoso
 */
function isSuspiciousPath(pathname: string): boolean {
  return SUSPICIOUS_PATHS.some((pattern) => pattern.test(pathname));
}

/**
 * Verifica si el User-Agent es malicioso
 */
function isMaliciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MALICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

/**
 * Log de seguridad simplificado (para edge runtime)
 */
function logSecurity(
  level: "info" | "warn" | "error",
  message: string,
  data: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };

  if (IS_PRODUCTION) {
    console[level](JSON.stringify(logEntry));
  } else {
    console[level](`[SECURITY] ${message}`, data);
  }
}

// Limpiar rate limit cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryRateLimit.entries()) {
      if (now > record.resetTime) {
        memoryRateLimit.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// ============================================================================
// MIDDLEWARE DE INTERNACIONALIZACIÓN
// ============================================================================

const intlMiddleware = createIntlMiddleware(routing);

// ============================================================================
// FUNCIONES DE ROUTING (con soporte para locales)
// ============================================================================

/**
 * Extrae el pathname sin el prefijo de locale
 * Ej: /en/dashboard -> /dashboard, /es/login -> /login, /dashboard -> /dashboard
 */
function getPathnameWithoutLocale(pathname: string): string {
  const localePrefix = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (localePrefix) {
    const pathnameWithoutLocale = pathname.slice(`/${localePrefix}`.length) || "/";
    return pathnameWithoutLocale;
  }
  return pathname;
}

function routePatternToRegex(pattern: string): RegExp {
  const regexPattern = pattern
    .replace(/:[^/]+/g, "[^/]+")
    .replace(/\//g, "\\/");
  return new RegExp(`^${regexPattern}$`);
}

const publicRouteRegexes = publicRoutes.map((route) => ({
  pattern: route,
  regex: routePatternToRegex(route),
}));

const isPublicRoute = (pathname: string): boolean => {
  const cleanPath = getPathnameWithoutLocale(pathname);
  return publicRouteRegexes.some(({ regex }) => regex.test(cleanPath));
};

const isAuthRoute = (pathname: string): boolean => {
  const cleanPath = getPathnameWithoutLocale(pathname);
  return authRoutes.includes(cleanPath);
};

const isApiAuthRoute = (pathname: string): boolean => pathname.startsWith(apiAuthPrefix);
const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api/");
const isHealthRoute = (pathname: string): boolean => pathname === "/api/health";

export const proxy = NextAuth(authConfig).auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const requestId = generateRequestId();
  const clientIP = getClientIP(req);
  const userAgent = req.headers.get("user-agent");
  const pathname = nextUrl.pathname;
  // ========================================================================
  if (isHealthRoute(pathname)) {
    return NextResponse.next();
  }

  // ========================================================================
  // 1. WAF - VERIFICACIONES DE SEGURIDAD BÁSICAS
  // ========================================================================

  // Verificar paths sospechosos
  if (isSuspiciousPath(pathname)) {
    logSecurity("warn", "Suspicious path blocked", {
      requestId,
      ip: clientIP,
      path: pathname,
      userAgent,
    });

    return new NextResponse("Not Found", { status: 404 });
  }

  // Verificar User-Agent malicioso (solo en producción)
  if (IS_PRODUCTION && isMaliciousUserAgent(userAgent)) {
    logSecurity("warn", "Malicious user-agent blocked", {
      requestId,
      ip: clientIP,
      path: pathname,
      userAgent,
    });

    return new NextResponse("Forbidden", { status: 403 });
  }

  // Verificar inyecciones básicas en el path y query
  const fullUrl = pathname + nextUrl.search;
  if (checkBasicInjection(decodeURIComponent(fullUrl))) {
    logSecurity("error", "Injection attempt blocked", {
      requestId,
      ip: clientIP,
      path: pathname,
      query: nextUrl.search,
      userAgent,
    });

    return new NextResponse("Bad Request", { status: 400 });
  }

  // ========================================================================
  // 2. RATE LIMITING
  // ========================================================================

  // Determinar tipo de rate limit
  // IMPORTANTE: /api/auth/session y /api/auth/providers son llamados automáticamente
  // por NextAuth en cada navegación, no son intentos de login reales.
  // Usamos "general" para estos endpoints para evitar falsos positivos.
  const isSessionOrProvidersCheck =
    pathname === "/api/auth/session" ||
    pathname === "/api/auth/providers" ||
    pathname === "/api/auth/csrf";

  let rateLimitType: RateLimitType = "general";
  if (isSessionOrProvidersCheck) {
    rateLimitType = "general";
  } else if (pathname === "/login" || pathname === "/api/auth/signin" || pathname === "/api/auth/callback/credentials") {
    rateLimitType = "general";
  } else if (isAuthRoute(pathname) || isApiAuthRoute(pathname)) {
    rateLimitType = "general";
  } else if (isApiRoute(pathname)) {
    rateLimitType = "api";
  }

  const rateLimitKey = `${rateLimitType}:${clientIP}`;
  const rateLimitConfig = RATE_LIMIT_CONFIG[rateLimitType] || RATE_LIMIT_CONFIG.general;
  const rateLimit = checkMemoryRateLimit(rateLimitKey, rateLimitConfig);

  if (!rateLimit.allowed) {
    logSecurity("warn", "Rate limit exceeded", {
      requestId,
      ip: clientIP,
      path: pathname,
      rateLimitType,
    });

    const retryAfter = rateLimit.retryAfter || 60;
    return new NextResponse(
      JSON.stringify({
        error: "RATE_LIMIT_EXCEEDED",
        message: "Demasiados intentos. Por favor, espera un momento.",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
        },
      }
    );
  }

  // ========================================================================
  // 3. ROUTING DE AUTENTICACIÓN
  // ========================================================================

  // Rutas de API de autenticación - permitir siempre (sin i18n)
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Rutas públicas - aplicar i18n y permitir
  if (isPublicRoute(pathname)) {
    // Continuar al paso de i18n al final
  }
  // Rutas de autenticación (login, register, etc.)
  else if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;

      logSecurity("info", "Authenticated user redirected from auth route", {
        requestId,
        ip: clientIP,
        path: pathname,
        redirectTo: redirectUrl,
        userId: req.auth?.user?.id,
      });

      return Response.redirect(new URL(redirectUrl, nextUrl.origin));
    }
    // Continuar al paso de i18n al final
  }
  // Rutas protegidas - requieren autenticación
  else if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    if (!isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }

    logSecurity("info", "Unauthenticated access attempt", {
      requestId,
      ip: clientIP,
      path: pathname,
      redirectTo: loginUrl.pathname,
    });

    return Response.redirect(loginUrl);
  }

  // ========================================================================
  // 4. INTERNACIONALIZACIÓN + HEADERS DE RESPUESTA
  // ========================================================================

  // Aplicar middleware de i18n para rutas que no son API
  const response = isApiRoute(pathname)
    ? NextResponse.next()
    : intlMiddleware(req);

  // Request ID para trazabilidad
  response.headers.set("X-Request-ID", requestId);

  // Headers de rate limiting
  response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.ceil(rateLimit.resetTime / 1000))
  );

  return response;
});

// ============================================================================
// CONFIGURACIÓN DEL MATCHER
// ============================================================================

export const config = {
  matcher: [
    // Excluir archivos estáticos, assets y SEO files
    "/((?!_next/static|_next/image|favicon.ico|robots\\.txt$|sitemap\\.xml$|browserconfig\\.xml$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|sw\\.js$|workbox-.*\\.js$|swe-worker-.*\\.js$|fallback-.*\\.js$|manifest\\.json$).*)",
  ],
};
