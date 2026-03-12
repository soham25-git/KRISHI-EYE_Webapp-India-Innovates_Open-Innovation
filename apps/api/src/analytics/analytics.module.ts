import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsSnapshot } from '../database/entities/analytics-snapshot.entity';
import { OperationJob } from '../database/entities/operation-job.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { Farm } from '../database/entities/farm.entity';
import { TelemetryPoint } from '../database/entities/telemetry-point.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalyticsSnapshot,
      OperationJob,
      FarmMember,
      Farm,
      TelemetryPoint
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule { }
