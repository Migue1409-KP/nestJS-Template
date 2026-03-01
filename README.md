# NestJS Modular Monolith Template

Template base para proyectos en **NestJS**, diseñado para escalar como un **Modular Monolith**. Ofrece una base estructurada y lista para producción con autenticación moderna, base de datos relacional, validación, trazabilidad y notificaciones por email.

---

## Stack Tecnológico

| Herramienta | Rol |
|---|---|
| **NestJS + ExpressJS + TypeScript** | Framework principal, estructura feature-first |
| **PostgreSQL + TypeORM** | Base de datos relacional con migraciones |
| **BetterAuth** | Autenticación: sesiones en cookie, Email/Password, OAuth, MFA |
| **Zod** | Validación de DTOs mediante pipes personalizados |
| **Winston** | Logging estructurado con `requestId` por petición |
| **Swagger (OpenAPI)** | Documentación automática de la API en `/api/v1/docs` |
| **AWS SES** | Envío de emails a través del módulo de notificaciones |
| **RFC 9457 (Problem Details)** | Formato estándar de errores en toda la API |
| **Docker** | Entorno de desarrollo local integrado |

---

## Estructura del Proyecto

```text
src/
 app.module.ts        # Módulo raíz
 main.ts              # Bootstrap, Swagger, Guards, Pipes e Interceptores globales
 auth/                # Autenticación con BetterAuth + endpoints custom
 core/                # Infraestructura: DB, Logger, HTTP Client, Notificaciones, Parámetros
 shared/              # Código transversal: decoradores, filtros, guards, interceptores, pipes
 users/               # Dominio de usuarios: perfiles, repositorios, servicios
doc/                     # Documentación detallada del template
```

---

## Configuración y Puesta en Marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Variables mínimas a configurar:

```env
# App
PORT=3000
API_PREFIX=api/v1
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secret
DB_DATABASE=nestjs_template
DB_SYNCHRONIZE=false

# BetterAuth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000/api/v1

# AWS SES (opcional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### 3. Levantar la base de datos (Docker)

```bash
docker-compose up -d postgres
```

---

## Flujo para tener la BD al día

Cada vez que haya cambios en el schema, seguir este orden:

```bash
# 1. Sincronizar el schema de BetterAuth (genera SQL interno)
npm run auth:generate

# 2. Aplicar tablas de BetterAuth (user, session, account, verification)
npm run auth:migrate

# 3. (Solo si hay cambios en entidades TypeORM) Generar migración
npm run migration:generate --name=DescripcionDelCambio

# 4. Aplicar migraciones de TypeORM
npm run migration:run

# 5. Aplicar seeders si los hay
npm run seed

# 6. Arrancar la aplicación
npm run start:dev
```

---

## Documentación Interna

Revisa la carpeta `/doc` para entender cómo trabajar con este template:

- [01 - Getting Started](./doc/01-getting-started.md)
- [02 - Arquitectura y Estructura](./doc/02-architecture-and-structure.md)
- [03 - Autenticación (BetterAuth)](./doc/03-authentication.md)
- [04 - Base de Datos y Migraciones](./doc/04-database-and-migrations.md)
- [05 - Añadir Nuevas Funcionalidades](./doc/05-adding-new-features.md)
- [06 - Git y Commits Semánticos](./doc/06-git-conventional-commits.md)

---

## Testing

```bash
npm run test          # Tests unitarios
npm run test:watch    # Tests en modo watch
npm run test:e2e      # End to End
npm run test:cov      # Cobertura
```

---

## Swagger

Con la aplicación levantada, la documentación interactiva está en:

```
http://localhost:3000/api/v1/docs
```

---

## Licencia

MIT