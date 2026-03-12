import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { TelemetryPoint } from '../database/entities/telemetry-point.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { OperationJob } from '../database/entities/operation-job.entity';
import { FarmMember } from '../database/entities/farm-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelemetryPoint, Tractor, OperationJob, FarmMember]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule { }
