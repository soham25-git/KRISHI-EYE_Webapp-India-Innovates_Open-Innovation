import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../database/entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) { }

  async create(dto: CreateFieldDto): Promise<Field> {
    const field = this.fieldRepository.create(dto);
    return this.fieldRepository.save(field);
  }

  async findOne(id: string): Promise<Field> {
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ['farm'],
    });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }
    return field;
  }

  async update(id: string, dto: UpdateFieldDto): Promise<Field> {
    const field = await this.findOne(id);
    Object.assign(field, dto);
    return this.fieldRepository.save(field);
  }

  async remove(id: string): Promise<void> {
    const field = await this.findOne(id);
    await this.fieldRepository.remove(field);
  }

  async updateBoundary(id: string, wkt: string): Promise<Field> {
    const field = await this.findOne(id);
    field.boundary_wkt = wkt;
    return this.fieldRepository.save(field);
  }
}
