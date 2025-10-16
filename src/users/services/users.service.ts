import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user-profiles.repository';
import { UserProfile } from '../entities/user-profiles.entity';
import { CreateUserProfileDto } from '../dto/create-user.dto';
import { UpdateUserProfileDto } from '../dto/update-user.dto';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly userProfileRepository: UserRepository) {}

  async createProfile(data: CreateUserProfileDto): Promise<UserProfile> {
    const userProfileReq: UserProfile = {
      ...new UserProfile(),
      ...data,
    };
    const userProfileResponse = this.userProfileRepository.create(userProfileReq);
    return userProfileResponse;
  }

  async findByAuthUserId(authUserId: string): Promise<UserProfile> {
    const user = await this.userProfileRepository.findOneByAuthUserId(authUserId);
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    return user;
  }

  async updateProfile(id: UUID, data: UpdateUserProfileDto): Promise<UserProfile> {
    const existingProfile = await this.userProfileRepository.findOneById(id);
    if (!existingProfile) {
      throw new NotFoundException({message: 'User profile not found', data: [{field: 'id', message: 'No user profile with given id', code: 'id_not_found'}]});
    }

    const updateData: Partial<UserProfile> = { ...data };

    const updatedProfile = await this.userProfileRepository.update(id, updateData);
    if (!updatedProfile) {
      throw new NotFoundException('Failed to update user profile');
    }
    
    return updatedProfile;
  }

  async findProfileById(id: UUID): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOneById(id);
    if (!profile) {
      throw new NotFoundException({message: 'User profile not found', data: [{field: 'id', message: 'No user profile with given id', code: 'id_not_found'}]});
    }
    return profile;
  }

  async checkProfileExists(authUserId: string): Promise<boolean> {
    const profile = await this.userProfileRepository.findOneByAuthUserId(authUserId);
    return profile !== null;
  }
}
