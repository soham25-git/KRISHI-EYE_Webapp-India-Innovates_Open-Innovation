import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tractor } from '../database/entities/tractor.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { CreateTractorDto, UpdateTractorDto } from './dto/tractor.dto';

@Injectable()
export class TractorsService {
  constructor(
    @InjectRepository(Tractor)
    private tractorRepository: Repository<Tractor>,
    @InjectRepository(FarmMember)
    private memberRepository: Repository<FarmMember>,
  ) { }

  async create(dto: CreateTractorDto, userId: string): Promise<Tractor> {
    // Permission check for farm
    const member = await this.memberRepository.findOne({
      where: { farm_id: dto.farm_id, user_id: userId }
    });
    if (!member) {
      throw new ForbiddenException('Not a member of the target farm');
    }
    if (member.role !== 'farm_owner') {
      throw new ForbiddenException('Only farm owners can register tractors');
    }

    const tractor = this.tractorRepository.create(dto);
    return this.tractorRepository.save(tractor);
  }

  async findAll(userId: string): Promise<Tractor[]> {
    const memberships = await this.memberRepository.find({
      where: { user_id: userId }
    });
    const farmIds = memberships.map(m => m.farm_id);
    if (farmIds.length === 0) return [];

    return this.tractorRepository.find({
      where: { farm_id: In(farmIds) },
      relations: ['farm'],
    });
  }

  async findOne(id: string): Promise<Tractor> {
    const tractor = await this.tractorRepository.findOne({
      where: { id },
      relations: ['farm'],
    });
    if (!tractor) {
      throw new NotFoundException(`Tractor with ID ${id} not found`);
    }
    return tractor;
  }

  async update(id: string, dto: UpdateTractorDto): Promise<Tractor> {
    const tractor = await this.findOne(id);
    Object.assign(tractor, dto);
    return this.tractorRepository.save(tractor);
  }

  async remove(id: string): Promise<void> {
    const tractor = await this.findOne(id);
    await this.tractorRepository.remove(tractor);
  }
}
