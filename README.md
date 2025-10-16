# 📜 MyLasts API

Backend oficial de **MyLasts — Plataforma de Legado Digital**.  
Construido sobre **NestJS Modular Monolith Template** con autenticación **BetterAuth** y soporte para integraciones externas.

---

## 🚀 Características

- **NestJS + TypeScript**: Framework moderno con tipado fuerte.
- **Arquitectura modular** (*feature-first*): cada dominio encapsulado en su propio módulo.
- **Autenticación y sesiones**:
  - **BetterAuth** con cookies (`better-auth.session_token`)
  - Registro/Login con **Email & Password**
  - **Google OAuth** integrado
  - Soporte para MFA (TOTP, SMS, Email)
- **ORM y Base de Datos**:
  - **TypeORM** (PostgreSQL) con migraciones
  - **Kysely + BetterAuth** para persistencia de sesiones
- **Validación y logging**:
  - **Zod** para DTOs
  - **Winston** con `requestId` y trazabilidad
- **Interoperabilidad**:
  - Mail Module (AWS SES, Resend)
  - HTTP Client Module
- **APIs documentadas** con Swagger/OpenAPI

---

## 📁 Estructura del Proyecto

```bash
src/
├── app.module.ts        # Módulo raíz
├── main.ts              # Bootstrap de la app
├── core/                # Configuración global
│   ├── config/          # DB, Winston, etc.
│   ├── database/        # TypeORM + migraciones
│   ├── mail/            # Abstracción de correo
│   └── http/            # Cliente HTTP
├── shared/              # Reutilizables
│   ├── interceptors/    # RequestId, Logging, Response
│   ├── pipes/           # Validación con Zod
│   ├── filters/         # Filtros de excepciones
│   └── interfaces/      # Interfaces comunes
├── auth/                # Módulo de autenticación (BetterAuth)
├── users/               # Entidad UserProfile + lógica
└── integrations/        # Proveedores externos
````

---

## 🛠️ Configuración

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus configuraciones:

   * PostgreSQL
   * Secrets BetterAuth
   * Configuración OAuth (Google)
   * Configuración correo

3. **Levantar base de datos**

   ```bash
   docker-compose up -d postgres
   ```

4. **Ejecutar migraciones**

   ```bash
   npm run migration:run
   npm run auth:migrate
   ```

5. **Iniciar aplicación**

   ```bash
   # Desarrollo
   npm run start:dev

   # Producción
   npm run build
   npm run start:prod
   ```

---

## 🔌 Endpoints principales (Draft)

### Autenticación

* `POST /api/auth/sign-up/email` — Registro de usuario
* `POST /api/auth/sign-in/email` — Login con email y contraseña
* `GET /api/auth/me` — Perfil del usuario autenticado

### Planes y suscripciones

* `GET /api/plans`
* `POST /api/subscriptions`
* `POST /api/subscriptions/apply-coupon`

### Gestión de grantees

* `POST /api/grantees`
* `PUT /api/grantees/{id}`
* `POST /api/grantees/{id}/resend`

### Gestión de archivos

* `POST /api/assets`
* `POST /api/assets/{id}/assign`
* `POST /api/assets/markdown`

### Cartas de instrucciones

* `POST /api/letters`
* `PUT /api/letters/{id}`
* `POST /api/letters/{id}/activate`

---

## 🧪 Testing

* **Unit tests**: `*.spec.ts`
* **Integration tests**: `*.e2e-spec.ts`
* **Coverage**: configurado con Jest

```bash
npm run test
npm run test:e2e
npm run test:cov
```

---

## 📖 Documentación

* **Swagger UI** disponible en: [http://localhost:3000/docs](http://localhost:3000/docs)
* **API Response Standard**: basado en **RFC 9457** para errores

---

## 📄 Licencia

MIT License — ver [LICENSE](LICENSE).