import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { CookieConsentWrapper } from "@/components/cookie-consent/cookie-consent-wrapper";
import { SessionGuard } from "@/components/auth/session-guard";
import { ThemeProvider } from "@/components/theme-provider";
import { RootJsonLd } from "@/lib/seo/json-ld";
import { getLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "FESA";
const APP_DESCRIPTION =
  "Formas Eficientes S.A. - Más de 50 años innovando en soluciones empresariales en Panamá. Impresión comercial, RFID, medios de pago, documentos de seguridad y soluciones tecnológicas integrales.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Formas Eficientes S.A. | Soluciones Empresariales en Panamá`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [
    {
      name: "Formas Eficientes S.A.",
      url: APP_URL,
    },
  ],
  generator: "Next.js",
  keywords: [
    "FESA",
    "Formas Eficientes",
    "impresión comercial",
    "RFID",
    "medios de pago",
    "documentos de seguridad",
    "formularios",
    "soluciones empresariales",
    "Panamá",
    "logística",
    "tarjetas digitales",
    "B2B",
  ],
  creator: "Formas Eficientes S.A.",
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
  classification: "Authentication System",

  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "es_PA",
    alternateLocale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Formas Eficientes S.A. | Soluciones Empresariales`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Formas Eficientes S.A.`,
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Soluciones Empresariales en Panamá`,
    description: APP_DESCRIPTION,
    images: ["/icon.png"],
    creator: "@FesaPanama",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    languages: {
      "es-ES": APP_URL,
      "en-US": `${APP_URL}/en`,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },

  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* DNS Prefetch para conexiones más rápidas */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Preconnect para fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* PWA & Mobile */}
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fesa" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Structured Data */}
        <RootJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <SessionGuard>
              {children}
            </SessionGuard>
            <CookieConsentWrapper />
          </SessionProvider>
          <Toaster position="bottom-right" richColors closeButton={true} duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
