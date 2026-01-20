import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { HeroButtons } from "@/components/landing/hero-buttons";
import { CtaButtons, BenefitsButton } from "@/components/landing/cta-buttons";
import {
  Shield,
  Lock,
  KeyRound,
  Mail,
  UserCheck,
  Smartphone,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Github,
  Zap,
  Layers,
  Code2,
  Cookie,
  Wand2,
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Registro seguro",
    description:
      "Sistema de registro con validación de email y contraseñas seguras con indicador de fortaleza.",
  },
  {
    icon: Mail,
    title: "Verificación de email",
    description:
      "Flujo completo de verificación de correo electrónico con tokens seguros y reenvío automático.",
  },
  {
    icon: Wand2,
    title: "Magic Link",
    description:
      "Inicio de sesión sin contraseña mediante enlace seguro enviado por email.",
  },
  {
    icon: Lock,
    title: "Recuperación de contraseña",
    description:
      "Proceso seguro de recuperación con enlaces temporales y validación de tokens.",
  },
  {
    icon: Smartphone,
    title: "Autenticación 2FA",
    description:
      "Verificación en dos pasos mediante código OTP enviado por email para mayor seguridad.",
  },
  {
    icon: Fingerprint,
    title: "Gestión de sesiones",
    description:
      "Sesiones JWT con expiración configurable y protección de rutas automática.",
  },
  {
    icon: Shield,
    title: "Protección avanzada",
    description:
      "Rate limiting, bloqueo de cuentas por intentos fallidos y auditoría de accesos.",
  },
  {
    icon: Cookie,
    title: "Gestión de cookies GDPR",
    description:
      "Banner de consentimiento con preferencias personalizables: cookies necesarias, analíticas y funcionales.",
  },
];

const techStack = [
  { name: "Next.js 16", description: "App Router + Turbopack" },
  { name: "React 19", description: "Server Components" },
  { name: "TypeScript", description: "Type-safe" },
  { name: "Prisma", description: "ORM + PostgreSQL" },
  { name: "Auth.js v5", description: "NextAuth Beta" },
  { name: "Tailwind CSS", description: "shadcn/ui" },
];

const benefits = [
  "Arquitectura limpia y modular",
  "Validación con Zod en cliente y servidor",
  "Emails transaccionales con React Email",
  "Soporte para dark/light mode",
  "Diseño responsive mobile-first",
  "Cumplimiento GDPR con gestión de cookies",
  "Listo para producción",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

          <div className="container px-4 py-24 md:px-6 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Next.js 16 + Auth.js v5
              </Badge>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Sistema de autenticación{" "}
                <span className="from-primary to-primary/60 bg-clip-text text-transparent">
                  completo y seguro
                </span>
              </h1>

              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Boilerplate de autenticación production-ready con arquitectura limpia,
                verificación de email, 2FA, gestión de cookies GDPR y mucho más.
              </p>

              <HeroButtons />

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                {techStack.slice(0, 4).map((tech) => (
                  <div key={tech.name} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Características
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Todo lo que necesitas para autenticación
              </h2>
              <p className="text-muted-foreground">
                Funcionalidades completas de autenticación implementadas siguiendo
                las mejores prácticas de seguridad.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tech" className="border-b bg-muted/30 py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                <Code2 className="mr-1 h-3 w-3" />
                Stack tecnológico
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Construido con las mejores tecnologías
              </h2>
              <p className="text-muted-foreground">
                Stack moderno y actualizado para desarrollo rápido y mantenible.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-4 rounded-xl border bg-card p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="border-b py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Layers className="mr-1 h-3 w-3" />
                  Arquitectura
                </Badge>
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Código limpio y escalable
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Arquitectura modular con separación de responsabilidades clara.
                  Cada módulo es independiente y fácil de mantener o extender.
                </p>

                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <BenefitsButton />
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 blur-2xl" />
                <div className="relative rounded-2xl border bg-card p-6 shadow-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="overflow-x-auto text-xs sm:text-sm">
                    <code className="text-muted-foreground">
{`modules/
├── login/
│   ├── actions/
│   ├── components/
│   ├── controllers/
│   ├── hooks/
│   ├── repository/
│   ├── services/
│   ├── validations/
│   └── view/
├── register/
├── two-factor/
├── user/
└── ...`}
                    </code>
                  </pre> 
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-2xl border from-primary/5 via-background to-primary/5 p-8 text-center shadow-lg md:p-12">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                Comienza a construir hoy
              </h2>
              <p className="mb-8 text-muted-foreground">
                Crea tu cuenta y explora todas las funcionalidades del sistema de
                autenticación.
              </p>
              <CtaButtons />
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <KeyRound className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Nexus</span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="transition-colors hover:text-foreground">
                Iniciar sesión
              </Link>
              <Link href="/register" className="transition-colors hover:text-foreground">
                Registrarse
              </Link>
              <Link href="/forgot-password" className="transition-colors hover:text-foreground">
                Recuperar contraseña
              </Link>
            </nav>

            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Nexus. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
