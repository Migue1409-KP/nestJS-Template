import { Injectable } from '@nestjs/common';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Notification, NotificationStatus } from '../entities/notifications.entity';

@Injectable()
export class NotificationsRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  private getRepository(queryRunner?: QueryRunner): Repository<Notification> {
    return queryRunner ? queryRunner.manager.getRepository(Notification) : this;
  }

  async createEntity(
    notification: Partial<Notification>,
    queryRunner?: QueryRunner,
  ): Promise<Notification> {
    const repo = this.getRepository(queryRunner);
    const newNotification = repo.create(notification);
    return await repo.save(newNotification);
  }

  async findAll(queryRunner?: QueryRunner): Promise<Notification[]> {
    return await this.getRepository(queryRunner).find({
      relations: ['template'],
    });
  }

  async findById(id: string, queryRunner?: QueryRunner): Promise<Notification | null> {
    return await this.getRepository(queryRunner).findOne({
      where: { id },
      relations: ['template'],
    });
  }

  async findByEmail(email: string, queryRunner?: QueryRunner): Promise<Notification[]> {
    return await this.getRepository(queryRunner).find({
      where: { email },
      relations: ['template'],
    });
  }

  async findByStatus(
    status: NotificationStatus,
    queryRunner?: QueryRunner,
  ): Promise<Notification[]> {
    return await this.getRepository(queryRunner).find({
      where: { status },
      relations: ['template'],
    });
  }

  async updateEntity(
    id: string,
    notification: Partial<Notification>,
    queryRunner?: QueryRunner,
  ): Promise<Notification | null> {
    await this.getRepository(queryRunner).update(id, notification);
    return await this.findById(id, queryRunner);
  }

  async deleteEntity(id: string, queryRunner?: QueryRunner): Promise<boolean> {
    const result = await this.getRepository(queryRunner).delete(id);
    return result.affected > 0;
  }

  async updateStatus(
    id: string,
    status: NotificationStatus,
    queryRunner?: QueryRunner,
  ): Promise<Notification | null> {
    await this.getRepository(queryRunner).update(id, { status });
    return await this.findById(id, queryRunner);
  }
}
