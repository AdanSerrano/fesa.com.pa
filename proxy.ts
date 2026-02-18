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

const intlMiddleware = createIntlMiddleware(routing);

function getPathnameWithoutLocale(pathname: string): string {
  const localePrefix = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (localePrefix) {
    return pathname.slice(`/${localePrefix}`.length) || "/";
  }
  return pathname;
}

function getPublicOrigin(req: { headers: Headers; nextUrl: URL }): string {
  const proto =
    req.headers.get("x-forwarded-proto") ||
    req.nextUrl.protocol.replace(":", "");
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    req.nextUrl.host;
  return `${proto}://${host}`;
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

const isApiAuthRoute = (pathname: string): boolean =>
  pathname.startsWith(apiAuthPrefix);
const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api/");

const authMiddleware = NextAuth(authConfig).auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  if (isAuthRoute(pathname) && isLoggedIn) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    const redirectUrl =
      callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
        ? callbackUrl
        : DEFAULT_LOGIN_REDIRECT;
    return Response.redirect(new URL(redirectUrl, getPublicOrigin(req)));
  }

  if (!isAuthRoute(pathname) && !isLoggedIn) {
    const origin = getPublicOrigin(req);
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  return NextResponse.next();
});

function isRedirect(response: Response): boolean {
  return response.status >= 300 && response.status < 400;
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isApiAuthRoute(pathname) || isApiRoute(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return intlMiddleware(req);
  }

  const authResponse = await (
    authMiddleware as (req: NextRequest) => Promise<Response>
  )(req);

  if (isRedirect(authResponse)) {
    return authResponse;
  }

  const intlResponse = intlMiddleware(req);

  authResponse.headers.getSetCookie().forEach((cookie) => {
    intlResponse.headers.append("set-cookie", cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|browserconfig\\.xml$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|sw\\.js$|workbox-.*\\.js$|swe-worker-.*\\.js$|fallback-.*\\.js$|manifest\\.json$).*)",
  ],
};
