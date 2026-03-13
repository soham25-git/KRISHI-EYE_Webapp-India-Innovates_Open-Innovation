import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  private readonly logger = new Logger(FieldsService.name);
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dto: CreateFieldDto): Promise<any> {
    return this.prisma.field.create({
      data: {
        name: dto.name,
        farmId: dto.farm_id,
        crop: dto.crop,
        season: dto.season,
        areaAcres: dto.area_acres,
      }
    });
  }

  async findOne(id: string): Promise<any> {
    const field = await this.prisma.field.findUnique({
      where: { id },
      include: { farm: true },
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }
    return field;
  }

  async update(id: string, dto: UpdateFieldDto): Promise<any> {
    await this.findOne(id);
    return this.prisma.field.update({
      where: { id },
      data: {
        name: dto.name,
        crop: dto.crop,
        season: dto.season,
        areaAcres: dto.area_acres,
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.field.delete({ where: { id } });
  }

  async updateBoundary(id: string, wkt: string): Promise<any> {
    // Geometry updates require raw SQL for Unsupported types in Prisma
    this.logger.warn('Boundary update via Prisma raw SQL not implemented in this cleanup pass');
    return this.findOne(id);
  }
}
