import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Decorator que envuelve un método en una transacción de base de datos.
 * Maneja automáticamente: connect, startTransaction, commit, rollback y release.
 *
 * @example
 * @Transactional()
 * async updateMultipleRecords(param1, param2, queryRunner?: any) {
 *   // El queryRunner será inyectado automáticamente como último argumento
 *   await queryRunner.manager.save(...);
 * }
 */
export function Transactional() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: any[]) {
      const dataSource: DataSource = this.dataSource;

      if (!dataSource) {
        throw new Error(
          `@Transactional() requires 'dataSource' to be injected in the service. ` +
          `Make sure your service has: constructor(private readonly dataSource: DataSource) {...}`,
        );
      }

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Pasar el queryRunner como último argumento al método original
        const result = await originalMethod.apply(this, [...args, queryRunner]);

        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    };

    return descriptor;
  };
}

/**
 * Version alternativa que inyecta el QueryRunner como contexto de ejecución.
 * Útil para servicios que necesitan acceder al queryRunner durante la ejecución.
 *
 * @example
 * @TransactionalWithContext()
 * async updateMultipleRecords() {
 *   // Usar this.queryRunner para todas las operaciones
 * }
 */
export function TransactionalWithContext() {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const logger = new Logger(`${target.name}`);

    descriptor.value = async function (this: any, ...args: any[]) {
      const dataSource: DataSource = this.dataSource;

      if (!dataSource) {
        throw new Error(
          `@TransactionalWithContext() requires 'dataSource' to be injected in the service. ` +
          `Make sure your service has: constructor(private readonly dataSource: DataSource) {...}`,
        );
      }

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Guardar el queryRunner anterior (por si hay transacciones anidadas)
      const previousQueryRunner = (this as any).queryRunner;
      (this as any).queryRunner = queryRunner;

      try {
        const result = await originalMethod.apply(this, args);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        logger.error(
          `Error in transactional method: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error instanceof Error ? error.stack : '',
        );
        throw error;
      } finally {
        await queryRunner.release();
        // Restaurar el queryRunner anterior
        (this as any).queryRunner = previousQueryRunner;
      }
    };

    return descriptor;
  };
}
