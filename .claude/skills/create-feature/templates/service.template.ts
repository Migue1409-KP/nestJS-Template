import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { {REPOSITORY_CLASS} } from '../repositories/{REPOSITORY_FILE}.repository';
import { {ENTITY_CLASS} } from '../entities/{ENTITY_FILE}.entity';
import {
  Create{ENTITY_CLASS}Dto,
  Update{ENTITY_CLASS}Dto,
} from '../dto/index';
import { Transactional } from '@shared/decorators/transactional.decorator';

/**
 * {ENTITY_NAME} Service
 * 
 * Business logic layer for {ENTITY_DESCRIPTION}
 */
@Injectable()
export class {SERVICE_CLASS} {
  constructor(
    private readonly {REPO_PROPERTY}: {REPOSITORY_CLASS},
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create new {ENTITY_NAME}
   */
  @Transactional()
  async create{ENTITY_CLASS}(
    data: Create{ENTITY_CLASS}Dto,
    queryRunner?: any,
  ): Promise<{ENTITY_CLASS}> {
    // TODO: Add validation logic if needed
    
    return this.{REPO_PROPERTY}.createEntity(data, queryRunner);
  }

  /**
   * Get {ENTITY_NAME} by ID
   */
  async find{ENTITY_CLASS}ById(id: string): Promise<{ENTITY_CLASS}> {
    const entity = await this.{REPO_PROPERTY}.findOneById(id);
    
    if (!entity) {
      throw new NotFoundException({
        message: '{ENTITY_NAME} not found',
        data: [
          {
            field: 'id',
            message: 'No {ENTITY_NAME} with given id exists',
            code: 'id_not_found',
          },
        ],
      });
    }

    return entity;
  }

  /**
   * List all {ENTITY_PLURAL}
   */
  async findAll{ENTITY_PLURAL}(): Promise<{ENTITY_CLASS}[]> {
    return this.{REPO_PROPERTY}.findAll();
  }

  /**
   * Update {ENTITY_NAME}
   */
  @Transactional()
  async update{ENTITY_CLASS}(
    id: string,
    data: Update{ENTITY_CLASS}Dto,
    queryRunner?: any,
  ): Promise<{ENTITY_CLASS}> {
    // Verify entity exists
    await this.find{ENTITY_CLASS}ById(id);

    // TODO: Add validation logic if needed

    const updated = await this.{REPO_PROPERTY}.updateEntity(id, data, queryRunner);
    
    if (!updated) {
      throw new NotFoundException({
        message: '{ENTITY_NAME} not found after update',
        data: [
          {
            field: 'id',
            message: 'Unable to update {ENTITY_NAME}',
            code: 'update_failed',
          },
        ],
      });
    }

    return updated;
  }

  /**
   * Delete {ENTITY_NAME}
   */
  @Transactional()
  async delete{ENTITY_CLASS}(id: string, queryRunner?: any): Promise<void> {
    const exists = await this.{REPO_PROPERTY}.findOneById(id, queryRunner);
    
    if (!exists) {
      throw new NotFoundException({
        message: '{ENTITY_NAME} not found',
        data: [
          {
            field: 'id',
            message: 'No {ENTITY_NAME} with given id exists',
            code: 'id_not_found',
          },
        ],
      });
    }

    await this.{REPO_PROPERTY}.softDeleteEntity(id, queryRunner);
  }

  {CUSTOM_SERVICE_METHODS}
}
