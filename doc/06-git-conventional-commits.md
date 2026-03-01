# Git y Commits Semánticos

Este template usa **Husky** + **commitlint** + **lint-staged** para asegurar calidad en cada commit.

---

## ¿Qué pasa cuando haces `git commit`?

Se ejecutan automáticamente en este orden:

```
git commit -m "..."
      │
      ├── [pre-commit] lint-staged → Prettier aplica formato a los .ts staged
      │
      ├── [pre-commit] jest --passWithNoTests --bail → Todos los tests deben pasar
      │
      └── [commit-msg]  commitlint → El mensaje debe seguir Conventional Commits
```

Si cualquier paso falla, **el commit se cancela**.

---

## Formato del mensaje de commit (Conventional Commits)

```
<tipo>(<alcance opcional>): <descripción corta>

[cuerpo opcional]

[footer opcional, ej: BREAKING CHANGE: ...]
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un bug |
| `docs` | Solo documentación |
| `style` | Formato/estilo sin cambio de lógica |
| `refactor` | Refactoring sin nueva feature ni fix |
| `test` | Añadir o modificar tests |
| `chore` | Tooling, dependencias, configuración |
| `perf` | Mejora de rendimiento |
| `ci` | Cambios en CI/CD pipelines |
| `build` | Cambios en el build system |
| `revert` | Revertir un commit anterior |

### Ejemplos válidos

```bash
git commit -m "feat: add user authentication endpoint"
git commit -m "fix(users): handle null profile on login"
git commit -m "docs: update getting started guide"
git commit -m "refactor(auth): extract session validation logic"
git commit -m "chore: upgrade typeorm to 0.3.20"
git commit -m "test: add unit tests for zod validation pipe"
```

### Ejemplos inválidos (serán rechazados)

```bash
git commit -m "arreglo bug"              # sin tipo
git commit -m "Fix: uppercase type"      # tipo en mayúscula
git commit -m "feat: added stuff."       # termina en punto
git commit -m "update"                   # sin tipo
```

---

## Bypass temporal (emergencias)

Si en algún caso necesitas saltarte los hooks (p.ej. trabajo en progreso):

```bash
git commit -m "wip: ..." --no-verify
```

> ⚠️ Solo usar en ramas personales. **Nunca en `main` o `develop`**.
