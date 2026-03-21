import { Injectable } from '@nestjs/common';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { {ENTITY_CLASS} } from '../entities/{ENTITY_FILE}.entity';

/**
 * {ENTITY_NAME} Repository
 * 
 * Handles data access for {ENTITY_DESCRIPTION}
 */
@Injectable()
export class {REPOSITORY_CLASS} extends Repository<{ENTITY_CLASS}> {
  constructor(private dataSource: DataSource) {
    super({ENTITY_CLASS}, dataSource.createEntityManager());
  }

  /**
   * Get repository instance, supports transactions via QueryRunner
   */
  private getRepository(
    queryRunner?: QueryRunner,
  ): Repository<{ENTITY_CLASS}> {
    return queryRunner ? queryRunner.manager.getRepository({ENTITY_CLASS}) : this;
  }

  /**
   * Find all {ENTITY_PLURAL}
   */
  async findAll(queryRunner?: QueryRunner): Promise<{ENTITY_CLASS}[]> {
    return this.getRepository(queryRunner).find({
      relations: {RELATIONS_ARRAY},
    });
  }

  /**
   * Find one {ENTITY_NAME} by ID with relations
   */
  async findOneById(
    id: string,
    queryRunner?: QueryRunner,
  ): Promise<{ENTITY_CLASS} | null> {
    return this.getRepository(queryRunner).findOne({
      where: { id },
      relations: {RELATIONS_ARRAY},
    });
  }

  {CUSTOM_FINDERS}

  /**
   * Create and save new {ENTITY_NAME}
   */
  async createEntity(
    data: Partial<{ENTITY_CLASS}>,
    queryRunner?: QueryRunner,
  ): Promise<{ENTITY_CLASS}> {
    const entity = this.getRepository(queryRunner).create(data);
    return this.getRepository(queryRunner).save(entity);
  }

  /**
   * Update {ENTITY_NAME} by ID
   */
  async updateEntity(
    id: string,
    data: Partial<{ENTITY_CLASS}>,
    queryRunner?: QueryRunner,
  ): Promise<{ENTITY_CLASS} | null> {
    await this.getRepository(queryRunner).update(id, data);
    return this.findOneById(id, queryRunner);
  }

  /**
   * Soft delete {ENTITY_NAME} (sets deleted_at timestamp)
   */
  async softDeleteEntity(
    id: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const result = await this.getRepository(queryRunner).update(id, {
      deletedAt: new Date(),
    } as any);
    return result.affected ? result.affected > 0 : false;
  }

  {CUSTOM_METHODS}
}
