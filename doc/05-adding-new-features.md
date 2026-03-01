# Añadir Nuevas Funcionalidades (Features)

Para mantener la Arquitectura Hexagonal/Domain Driven Design limpia, siempre crea un nuevo módulo con un dominio base en mente (ejemplo: `src/posts/`, `src/billing/`, `src/analytics/`).

## Pasos para un nuevo Dominio

Supongamos que vas a agregar el dominio **`Products`**.

### 1. El Módulo (Estructura Base)

Genera la estructura básica con Nest CLI o manualmente:

```bash
npx @nestjs/cli g module products
```

```text
src/products/
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
└── products.module.ts
```

### 2. Dtos (Data Transfer Objects) con Zod

En lugar de decorators de validación complejos como `class-validator`, prefermos la inferencia de tipos de Zod (ej: `create-product.dto.ts`):

```typescript
import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
```

### 3. Entidad de TypeORM

En `entities/product.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;
}
```

Añádelo al DataSource o a las entradas globales si la configuración del proyecto lo requiere (ej: usando glob pattern en app.module).

### 4. Controlador y Servicio

Conecta tu DTO con tus rutas utilizando el Decorador de Zod (Si cuentas con el `ZodValidationPipe` disponible en tu carpeta `shared/`).

```typescript
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CreateProductDto, CreateProductSchema } from '../dto/create-product.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';

@Controller('products')
export class ProductsController {
  
  // Utiliza pipes como este para asegurar la integridad de datos
  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  create(@Body() createProductDto: CreateProductDto) {
    // LLamar al servicio
  }
}
```

## Logging Correcto con Winston

Dentro del servicio (y siempre que sea útil para trazabilidad empresarial o depuración de errores), no uses un simple `console.log`.

Utiliza el NestJS `Logger` de @nestjs/common instanciado adecuadamente que ya está acoplado a **Winston** desde `main.ts` y que preservará un `requestId`.

De esta forma puedes mapear todas las ejecuciones desde el llamado del Postman al final de la BD relacionando ese identificador.