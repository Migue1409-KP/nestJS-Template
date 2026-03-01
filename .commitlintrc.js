/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nueva funcionalidad
        'fix',      // Corrección de bug
        'docs',     // Solo documentación
        'style',    // Formato/estilo, sin cambio de lógica
        'refactor', // Refactoring sin nueva feature ni fix
        'test',     // Añadir o modificar tests
        'chore',    // Cambios de tooling, dependencias, CI
        'perf',     // Mejora de rendimiento
        'ci',       // Cambios en CI/CD
        'build',    // Cambios en el build system
        'revert',   // Revertir un commit anterior
      ],
    ],
    // Máximo 100 caracteres en el asunto
    'header-max-length': [2, 'always', 100],
    // El asunto no puede terminar en punto
    'subject-case': [0], // desactivado para permitir español
    'subject-full-stop': [2, 'never', '.'],
    // El tipo debe ir en minúsculas
    'type-case': [2, 'always', 'lower-case'],
    // El tipo no puede estar vacío
    'type-empty': [2, 'never'],
    // El asunto no puede estar vacío
    'subject-empty': [2, 'never'],
  },
};
