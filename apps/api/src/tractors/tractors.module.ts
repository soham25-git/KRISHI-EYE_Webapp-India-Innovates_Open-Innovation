import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TractorsController } from './tractors.controller';
import { TractorsService } from './tractors.service';
import { Tractor } from '../database/entities/tractor.entity';
import { FarmMember } from '../database/entities/farm-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tractor, FarmMember]),
  ],
  controllers: [TractorsController],
  providers: [TractorsService],
  exports: [TractorsService],
})
export class TractorsModule { }
