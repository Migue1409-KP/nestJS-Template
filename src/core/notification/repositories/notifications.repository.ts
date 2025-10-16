import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from '../entities/notifications.entity';

@Injectable()
export class NotificationsRepository {
    constructor(
        @InjectRepository(Notification)
        private readonly repository: Repository<Notification>,
    ) {}

    async create(notification: Partial<Notification>): Promise<Notification> {
        const newNotification = this.repository.create(notification);
        return await this.repository.save(newNotification);
    }

    async findAll(): Promise<Notification[]> {
        return await this.repository.find({
            relations: ['template'],
        });
    }

    async findById(id: string): Promise<Notification | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['template'],
        });
    }

    async findByEmail(email: string): Promise<Notification[]> {
        return await this.repository.find({
            where: { email },
            relations: ['template'],
        });
    }

    async findByStatus(status: NotificationStatus): Promise<Notification[]> {
        return await this.repository.find({
            where: { status },
            relations: ['template'],
        });
    }

    async update(id: string, notification: Partial<Notification>): Promise<Notification | null> {
        await this.repository.update(id, notification);
        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected > 0;
    }

    async updateStatus(id: string, status: NotificationStatus): Promise<Notification | null> {
        await this.repository.update(id, { status });
        return await this.findById(id);
    }
}