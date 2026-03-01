import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-templates.entity';

@Injectable()
export class NotificationTemplatesRepository {
  constructor(
    @InjectRepository(NotificationTemplate)
    private readonly repository: Repository<NotificationTemplate>,
  ) {}

  async create(data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const template = this.repository.create(data);
    return await this.repository.save(template);
  }

  async findAll(): Promise<NotificationTemplate[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<NotificationTemplate | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<NotificationTemplate | null> {
    return await this.repository.findOne({ where: { code }, relations: ['translations'] });
  }

  async findActive(): Promise<NotificationTemplate[]> {
    return await this.repository.find({ where: { isActive: true } });
  }

  async update(
    id: string,
    data: Partial<NotificationTemplate>,
  ): Promise<NotificationTemplate | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false });
    return result.affected > 0;
  }
}
