import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { OperationJob } from '../database/entities/operation-job.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { Field } from '../database/entities/field.entity';
import { FarmMember } from '../database/entities/farm-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OperationJob, Tractor, Field, FarmMember]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule { }
