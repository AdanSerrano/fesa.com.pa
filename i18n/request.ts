import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Configuración de request para Server Components
 *
 * Este archivo es detectado automáticamente por next-intl
 * y proporciona locale y messages a Server Components.
 *
 * @see https://next-intl.dev/docs/usage/configuration
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale viene del middleware o URL
  let locale = await requestLocale;

  // Validar que el locale es soportado
  if (!locale || !routing.locales.includes(locale as "es" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
