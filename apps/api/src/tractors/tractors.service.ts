import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTractorDto, UpdateTractorDto } from './dto/tractor.dto';

@Injectable()
export class TractorsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dto: CreateTractorDto, userId: string): Promise<any> {
    const member = await this.prisma.farmMember.findFirst({
      where: { farmId: dto.farm_id, userId: userId }
    });
    if (!member) {
      throw new ForbiddenException('Not a member of the target farm');
    }
    if (member.role !== 'farm_owner') {
      throw new ForbiddenException('Only farm owners can register tractors');
    }

    return this.prisma.tractor.create({
      data: {
        farmId: dto.farm_id,
        label: dto.label,
        description: dto.description,
        colorHex: dto.color_hex,
      }
    });
  }

  async findAll(userId: string): Promise<any[]> {
    const memberships = await this.prisma.farmMember.findMany({
      where: { userId: userId }
    });
    const farmIds = memberships.map(m => m.farmId);
    if (farmIds.length === 0) return [];

    return this.prisma.tractor.findMany({
      where: { farmId: { in: farmIds } },
      include: { farm: true },
    });
  }

  async findOne(id: string): Promise<any> {
    const tractor = await this.prisma.tractor.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!tractor) {
      throw new NotFoundException(`Tractor with ID ${id} not found`);
    }
    return tractor;
  }

  async update(id: string, dto: UpdateTractorDto): Promise<any> {
    await this.findOne(id);
    return this.prisma.tractor.update({
      where: { id },
      data: {
        label: dto.label,
        description: dto.description,
        colorHex: dto.color_hex,
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.tractor.delete({ where: { id } });
  }
}
