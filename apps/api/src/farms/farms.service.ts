import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../database/entities/farm.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Field } from '../database/entities/field.entity';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(FarmMember)
    private memberRepository: Repository<FarmMember>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) { }

  async create(dto: CreateFarmDto, userId: string): Promise<Farm> {
    const farm = this.farmRepository.create({
      ...dto,
      owner_user_id: userId,
    });
    const savedFarm = await this.farmRepository.save(farm);

    // Automatically add owner as a member
    const member = this.memberRepository.create({
      farm_id: savedFarm.id,
      user_id: userId,
      role: 'farm_owner',
    });
    await this.memberRepository.save(member);

    return savedFarm;
  }

  async findAll(userId: string): Promise<Farm[]> {
    // Find farms where user is a member
    const memberships = await this.memberRepository.find({
      where: { user_id: userId },
      relations: ['farm'],
    });
    return memberships.map(m => m.farm);
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['members', 'fields'],
    });
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);
    Object.assign(farm, dto);
    return this.farmRepository.save(farm);
  }

  async remove(id: string): Promise<void> {
    const farm = await this.findOne(id);
    await this.farmRepository.remove(farm);
  }

  async addMember(farmId: string, targetUserId: string, role: string): Promise<FarmMember> {
    const member = this.memberRepository.create({
      farm_id: farmId,
      user_id: targetUserId,
      role,
    });
    return this.memberRepository.save(member);
  }

  async getFields(farmId: string): Promise<Field[]> {
    return this.fieldRepository.find({
      where: { farm_id: farmId },
    });
  }
}
