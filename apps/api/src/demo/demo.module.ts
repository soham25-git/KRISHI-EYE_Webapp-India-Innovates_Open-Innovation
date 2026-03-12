import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from '../database/entities/farm.entity';
import { Field } from '../database/entities/field.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { OperationJob } from '../database/entities/operation-job.entity';
import { TelemetryPoint } from '../database/entities/telemetry-point.entity';
import { AnalyticsSnapshot } from '../database/entities/analytics-snapshot.entity';
import { SupportTicket } from '../database/entities/support-ticket.entity';
import { AdvisoryLog } from '../database/entities/advisory-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Farm, Field, Tractor, OperationJob, TelemetryPoint,
      AnalyticsSnapshot, SupportTicket, AdvisoryLog
    ])
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule { }
