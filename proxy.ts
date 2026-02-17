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

export const proxy = NextAuth(authConfig).auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    const response = isApiRoute(pathname)
      ? NextResponse.next()
      : intlMiddleware(req);
    return response;
  }

  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;

      return Response.redirect(new URL(redirectUrl, nextUrl.origin));
    }

    const response = intlMiddleware(req);
    return response;
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  const response = isApiRoute(pathname)
    ? NextResponse.next()
    : intlMiddleware(req);

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|browserconfig\\.xml$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|sw\\.js$|workbox-.*\\.js$|swe-worker-.*\\.js$|fallback-.*\\.js$|manifest\\.json$).*)",
  ],
};