import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '../entities/user-profiles.entity';
import { UUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userRepository: Repository<UserProfile>,
  ) {}

  async findAll(): Promise<UserProfile[]> {
    return this.userRepository.find();
  }

  async findOneById(id: UUID): Promise<UserProfile | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['country', 'language'],
    });
  }

  async findOneByAuthUserId(auth_user_id: string): Promise<UserProfile | null> {
    return this.userRepository.findOne({
      where: { authUserId: auth_user_id },
    });
  }
  
  async create(data: UserProfile): Promise<UserProfile> {
    const userProfile = this.userRepository.create(data);
    return this.userRepository.save(userProfile);
  }

  async update(id: UUID, data: Partial<UserProfile>): Promise<UserProfile | null> {
    await this.userRepository.update(id, data);
    return this.findOneById(id);
  }

  async delete(id: UUID): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== null && result.affected > 0;
  }

  async softDelete(id: UUID): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return result.affected !== null && result.affected > 0;
  }
}
