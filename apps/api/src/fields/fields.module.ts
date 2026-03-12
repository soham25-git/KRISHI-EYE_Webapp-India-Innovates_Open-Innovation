import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';
import { Field } from '../database/entities/field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Field]),
  ],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService],
})
export class FieldsModule { }
