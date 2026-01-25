import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Genera parámetros estáticos para cada locale
 * Permite renderizado estático de todas las rutas localizadas
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Layout de Locale
 *
 * Envuelve las páginas con NextIntlClientProvider para
 * proporcionar traducciones a componentes cliente.
 *
 * IMPORTANTE: Este layout NO incluye <html> ni <body>,
 * eso se maneja en el layout raíz (app/layout.tsx)
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validar que el locale es soportado
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Habilitar renderizado estático
  setRequestLocale(locale as Locale);

  // Obtener mensajes para el locale actual
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
