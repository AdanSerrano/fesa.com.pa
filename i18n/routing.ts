import { defineRouting } from "next-intl/routing";

/**
 * Configuración de routing para internacionalización
 *
 * @see https://next-intl.dev/docs/routing
 */
export const routing = defineRouting({
  // Lista de todos los locales soportados
  locales: ["es", "en"],

  // Locale por defecto cuando no hay match
  defaultLocale: "es",

  // Prefijo de locale: "as-needed" no muestra /es para el default
  localePrefix: "as-needed",
});

// Tipos derivados de la configuración
export type Locale = (typeof routing.locales)[number];
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
