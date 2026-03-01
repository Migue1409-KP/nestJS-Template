# Base de Datos y TypeORM

El persistente almacenamiento de información, configuración y perfiles estáticos de la aplicación lo provee **PostgreSQL** montado sobre el ORM **TypeORM**.

## Flujo Completo para Tener la BD al Día

Cada vez que inicias el proyecto desde cero (o hay cambios en el schema), ejecuta en este orden:

```bash
# 1. Genera el SQL que BetterAuth necesita para sus tablas internas
npm run auth:generate

# 2. Aplica las tablas de BetterAuth (user, session, account, verification)
npm run auth:migrate

# 3. (Solo si hay cambios en entidades de TypeORM) Genera la migración con nombre descriptivo
npm run migration:generate --name=DescripcionDelCambio

# 4. Aplica las migraciones de TypeORM (tablas de negocio: user_profiles, etc.)
npm run migration:run

# 5. Inicia la aplicación
npm run start:dev
```

> **Nota:** Los pasos 1, 2 y 4 son obligatorios al arrancar el proyecto por primera vez. El paso 3 solo es necesario cuando modificas entidades TypeORM.

---

## Variables de Conexión

En `.env` se definen las variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=secret
DB_DATABASE=nest_template
DB_SYNCHRONIZE=false
```

⚠️ **NOTA:** NUNCA setees `DB_SYNCHRONIZE=true` en producción. Es fuertemente recomendado utilizar un archivo `.env` o `.env.test` con dicha bandera encendida únicamente para el pipeline e2e, o preferiblemente crear migraciones controladas.

## Migraciones en TypeORM

Dado que hemos modificado el control sobre la creación de tablas, toda alteración de esquema relacional en entidades decoradas (modelos de negocio) se aplicará con **migraciones**.

### 1. Generar una Migración

Supongamos que modificas `LanguagesEntity` para agregar una nueva columna llamada `codeIso`:

```bash
npm run typeorm -- migration:generate src/core/database/migrations/AddCodeIsoToLanguages
```

El script de package.json leerá el `data-source.ts` el cual cargará tus entidades y comparará su código con lo que existe en DB, generando un SQL de tipo `ALTER TABLE`.

### 2. Ejecutar Migraciones Nuevas

Una vez confirmado y revisado el archivo generado en `src/core/database/migrations/`:

```bash
npm run migration:run
```

### 3. Reversión

A veces podemos cometer un error e insertar un script fallido o la lógica de retroceso está probando un despliegue sin éxito fallido:

```bash
npm run migration:revert
```

## Repositorios Custom 

Es una excelente práctica no depender directamente de EntityManagers injectados o llamadas nativas sueltas. En `src/users/repositories/` y en `src/core/notification/repositories/` notarás clases personalizadas. Inyecta este Repositorio en lugar del genérico, ya que proporciona un único punto para cambiar, optimizar o testear la manera de recuperar datos para una entidad.