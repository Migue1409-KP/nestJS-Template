# Arquitectura y Estructura

El sistema está diseñado como un **Monolito Modular** (Modular Monolith) utilizando un enfoque en el dominio o características (*Feature First*).

## ¿Qué significa esto?

A diferencia de organizar el proyecto por el tipo de archivo (todas las entidades juntas, todos los servicios juntos, etc.), aquí organizamos el código según **la capacidad o módulo de dominio** al que pertenece el módulo. Cada carpeta principal bajo `src/` representa un subdominio específico de la aplicación.

```text
src/
├── auth/           # Módulo enfocado en seguridad y sesiones
├── users/          # Funcionalidades propias de usuarios (perfiles, avatares, roles)
├── core/           # Módulos transversales esenciales a la app y la infraestructura
└── shared/         # Helpers, DTOs compartidos, Filtros, Pipes
```

## Separación de `core/` y `shared/`

Es común confundir estas dos carpetas:

* **`core/`**: Contiene módulos, servicios o configuraciones que solo deben instanciarse UNA VEZ en el ciclo de vida de la aplicación. Ejemplos de estos son la conexión a la base de datos y la configuración transaccional, la instancia global del cliente HTTP o la configuración del logger Winston. Nunca deberías importar `CoreModule` desde un módulo de dominio de manera suelta, su lugar está en `AppModule`.
* **`shared/`**: Es para código "tonto", que no tiene estado o dependencias complejas. Generalmente contiene clases abstractas, interfaces, Dtypes, decoradores personales personalizados (ej: `@CurrentUser`), interceptores de log, `filters` de las excepciones (RFC 9457), y las validaciones con **Zod** (Zod Validation Pipe).

## Ciclo de Vida de una Petición

1. **Cliente HTTP**: Realiza la petición (ejemplo: POST `/api/users`).
2. **Pipes / Validation**: (Zod Validation Pipe) valida la entrada garantizando que el DTO es seguro, si este falla retorna un error formatado según RFC 9457 indicando que campos están mal.
3. **Guards / Interceptors**: Interceptores de Login y Auth se cruzan. Si la ruta está protegida, el `SessionGuard` verificara la cookie de sesión contra de BetterAuth. Adicionalmente `RequestIdInterceptor` inyecta un UUID en `AsyncLocalStorage` o request context.
4. **Controllers**: Direcciona a la lógica interna de `UsersService`.
5. **Services / UseCases**: Ejecutan la lógica del negocio.
6. **Repositories**: (`UserProfilesRepository`) Manejan operaciones en PostgreSQL apoyadas sobre TypeORM.

Este encapsulamiento asegura que no tengas un "Controller gigante", manteniendo dependencias localizadas.