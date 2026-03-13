import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dto: CreateFarmDto, userId: string): Promise<any> {
    const farm = await this.prisma.farm.create({
      data: {
        name: dto.name,
        district: dto.district,
        state: dto.state,
        ownerUserId: userId,
      }
    });

    // Automatically add owner as a member
    await this.prisma.farmMember.create({
      data: {
        farmId: farm.id,
        userId: userId,
        role: 'farm_owner',
      }
    });

    return farm;
  }

  async findAll(userId: string): Promise<any[]> {
    const memberships = await this.prisma.farmMember.findMany({
      where: { userId: userId },
      include: { farm: true },
    });
    return memberships.map(m => m.farm);
  }

  async findOne(id: string): Promise<any> {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: { 
        members: true, 
        fields: true 
      },
    });
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<any> {
    await this.findOne(id);
    return this.prisma.farm.update({
      where: { id },
      data: {
        name: dto.name,
        district: dto.district,
        state: dto.state,
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    // Note: Due to foreign keys, might need to delete members/fields first if not cascading
    await this.prisma.farm.delete({ where: { id } });
  }

  async addMember(farmId: string, targetUserId: string, role: string): Promise<any> {
    return this.prisma.farmMember.create({
      data: {
        farmId,
        userId: targetUserId,
        role,
      }
    });
  }

  async getFields(farmId: string): Promise<any[]> {
    return this.prisma.field.findMany({
      where: { farmId: farmId },
    });
  }
}
