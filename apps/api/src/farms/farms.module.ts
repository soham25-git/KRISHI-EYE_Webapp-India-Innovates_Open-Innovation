import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { Farm } from '../database/entities/farm.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { Field } from '../database/entities/field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Farm, FarmMember, Field]),
  ],
  controllers: [FarmsController],
  providers: [FarmsService],
  exports: [FarmsService],
})
export class FarmsModule { }
