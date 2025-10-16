import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplateTranslation } from '../entities/notifcation-template-translations.entity';

@Injectable()
export class NotificationTemplateTranslationsRepository {
    constructor(
        @InjectRepository(NotificationTemplateTranslation)
        private readonly repository: Repository<NotificationTemplateTranslation>,
    ) {}

    async create(
        data: Partial<NotificationTemplateTranslation>,
    ): Promise<NotificationTemplateTranslation> {
        const translation = this.repository.create(data);
        return await this.repository.save(translation);
    }

    async findAll(): Promise<NotificationTemplateTranslation[]> {
        return await this.repository.find({
            relations: ['template', 'language'],
        });
    }

    async findById(id: string): Promise<NotificationTemplateTranslation | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['template', 'language'],
        });
    }

    async findByTemplateCodeAndLanguageCode(
        templateCode: string,
        languageCode: string,
    ): Promise<NotificationTemplateTranslation | null> {
        return await this.repository.findOne({
            where: {
                template: { code: templateCode },
                language: { code: languageCode },
            },
            relations: ['template', 'language'],
        });
    }

    async update(
        id: string,
        data: Partial<NotificationTemplateTranslation>,
    ): Promise<NotificationTemplateTranslation | null> {
        await this.repository.update(id, data);
        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected > 0;
    }
}