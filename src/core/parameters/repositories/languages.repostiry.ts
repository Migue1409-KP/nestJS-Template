import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '../entities/languages.entity';

@Injectable()
export class LanguagesRepository {
    constructor(
        @InjectRepository(Language)
        private readonly languageRepository: Repository<Language>,
    ) {}

    async findAll(): Promise<Language[]> {
        return this.languageRepository.find();
    }

    async findOneById(id: string): Promise<Language | null> {
        return this.languageRepository.findOne({ where: { id } });
    }

    async findOneByCode(code: string): Promise<Language | null> {
        return this.languageRepository.findOne({ where: { code } });
    }

    async findOneByName(name: string): Promise<Language | null> {
        return this.languageRepository.findOne({ where: { name } });
    }

    async create(data: Partial<Language>): Promise<Language> {
        const language = this.languageRepository.create(data);
        return this.languageRepository.save(language);
    }

    async update(id: string, data: Partial<Language>): Promise<Language | null> {
        await this.languageRepository.update(id, data);
        return this.findOneById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.languageRepository.delete(id);
        return result.affected > 0;
    }
}