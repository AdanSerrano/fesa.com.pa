export const publicRoutes = [
  "/",
  "/contact",
  "/api/health",
  "/products",
  "/products/:slug",
  "/products/:slug/:productSlug",
  "/services",
  "/services/:slug",
  "/services/:slug/:serviceSlug",
  "/news",
  "/news/:category",
  "/news/:category/:article",
  "/about",
];

export const authRoutes = [
  "/login",
  "/register",
  "/register-success",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/resend-verification",
  "/magic-link",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard/overview";
