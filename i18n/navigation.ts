import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Navegación internacionalizada
 *
 * Exporta versiones localizadas de los componentes de navegación
 * que automáticamente manejan el prefijo de locale.
 *
 * @see https://next-intl.dev/docs/routing/navigation
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
