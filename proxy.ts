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

const IS_PRODUCTION = process.env.NODE_ENV === "production";

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

const INJECTION_PATTERNS = [
  /<script[^>]*>/i,
  /javascript:/i,
  /(\bunion\b[\s\S]*\bselect\b)/i,
];


function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

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

function checkBasicInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

function isSuspiciousPath(pathname: string): boolean {
  return SUSPICIOUS_PATHS.some((pattern) => pattern.test(pathname));
}

function isMaliciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MALICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

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


const intlMiddleware = createIntlMiddleware(routing);

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

const isStaticRoute = (pathname: string): boolean => {
  const staticPatterns = [
    /\.well-known\//,
    /^\/robots\.txt$/i,
    /^\/sitemap\.xml$/i,
    /^\/favicon\.ico$/i,
    /^\/ads\.txt$/i,
  ];
  return staticPatterns.some((pattern) => pattern.test(pathname));
};

export const proxy = NextAuth(authConfig).auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const requestId = generateRequestId();
  const clientIP = getClientIP(req);
  const userAgent = req.headers.get("user-agent");
  const pathname = nextUrl.pathname;

  if (isHealthRoute(pathname)) {
    return NextResponse.next();
  }


  const isAuthEndpoint = pathname.startsWith("/api/auth/");

  if (!isAuthEndpoint) {
    if (isSuspiciousPath(pathname)) {
      logSecurity("warn", "Suspicious path blocked", {
        requestId,
        ip: clientIP,
        path: pathname,
        userAgent,
      });
      return new NextResponse("Not Found", { status: 404 });
    }

    if (IS_PRODUCTION && isMaliciousUserAgent(userAgent)) {
      logSecurity("warn", "Malicious user-agent blocked", {
        requestId,
        ip: clientIP,
        path: pathname,
        userAgent,
      });
      return new NextResponse("Forbidden", { status: 403 });
    }

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
  }

  if (isStaticRoute(pathname)) {
    return NextResponse.next();
  }

  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    // Continuar
  }
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
  }
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


  const response = isApiRoute(pathname)
    ? NextResponse.next()
    : intlMiddleware(req);

  response.headers.set("X-Request-ID", requestId);

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|browserconfig\\.xml$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|sw\\.js$|workbox-.*\\.js$|swe-worker-.*\\.js$|fallback-.*\\.js$|manifest\\.json$).*)",
  ],
};