# Structure - Next.js Authentication Boilerplate

Sistema de autenticación completo con arquitectura limpia, diseñado para ser escalable y fácilmente migrable.

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI** | Tailwind CSS 4 + shadcn/ui + Aceternity UI |
| **Autenticación** | Auth.js v5 (NextAuth) |
| **Base de Datos** | PostgreSQL + Prisma 7 |
| **Validación** | Zod 4 + React Hook Form |
| **Email** | Resend + React Email |
| **Runtime** | Bun |

## Funcionalidades

- Registro de usuarios con verificación por email
- Login con credenciales (email o nombre de usuario)
- Recuperación de contraseña
- Rate limiting para protección contra fuerza bruta
- Indicador de fortaleza de contraseña
- Diseño responsive (mobile-first)
- Tema claro/oscuro

## Inicio Rápido

### Requisitos

- [Bun](https://bun.sh/) >= 1.0
- PostgreSQL >= 14
- Cuenta en [Resend](https://resend.com/) (para emails)

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd structure

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno

Edita `.env.local` con tus credenciales:

```bash
# Auth.js - Clave secreta para firmar tokens de sesión
# Generar con: npx auth secret
AUTH_SECRET=

# PostgreSQL - URL de conexión a la base de datos
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=

# Resend - API key para envío de emails transaccionales
# Obtener en: https://resend.com/api-keys
RESEND_API_KEY=

# Resend - Email remitente verificado en Resend
RESEND_FROM_EMAIL=

# URL pública de la aplicación (sin slash al final)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Base de Datos

```bash
# Generar cliente de Prisma
bunx prisma generate

# Aplicar schema a la base de datos
bunx prisma db push

# (Opcional) Abrir Prisma Studio
bun run db:studio
```

### Ejecutar

```bash
# Desarrollo
bun run dev

# Producción
bun run build
bun run start
```

## Arquitectura

El proyecto sigue una arquitectura modular con separación estricta de capas:

```
modules/
└── {feature}/
    ├── actions/          # Server Actions (entry point)
    ├── components/       # Componentes UI + emails
    ├── controllers/      # Delegadores
    ├── emails/           # Servicios de envío de email
    ├── hooks/            # Lógica de UI (React hooks)
    ├── repository/       # Acceso a datos (abstracción DB)
    ├── services/         # Lógica de negocio
    ├── validations/      # Schemas Zod + validaciones
    ├── view/             # Componentes página
    └── view-model/       # Bridge entre view y hooks
```

### Flujo de Datos

```
view → actions → controllers → services → repository → db
```

Cada capa tiene una responsabilidad única y solo puede comunicarse con la capa adyacente.

## Módulos Disponibles

| Módulo | Descripción |
|--------|-------------|
| `login` | Autenticación con email/username |
| `register` | Registro de usuarios |
| `register-success` | Página de éxito post-registro |
| `verify-email` | Verificación de email |
| `resend-verification` | Reenvío de email de verificación |
| `forgot-password` | Solicitud de reset de contraseña |
| `reset-password` | Cambio de contraseña |
| `services` | Dashboard de usuario autenticado |

## Comandos

```bash
# Desarrollo
bun run dev              # Servidor de desarrollo
bun run build            # Build de producción
bun run lint             # ESLint

# Base de datos
bun run db:studio        # Prisma Studio
bun run db:test          # Test de conexión
bunx prisma generate     # Generar cliente
bunx prisma db push      # Push schema
bunx prisma migrate dev  # Migraciones
```

## Documentación

- [CLAUDE.md](./CLAUDE.md) - Guía completa de arquitectura y patrones
- [Auth.js](https://authjs.dev/) - Documentación de autenticación
- [Prisma](https://www.prisma.io/docs) - Documentación de ORM
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Resend](https://resend.com/docs) - Envío de emails

## Licencia

MIT
