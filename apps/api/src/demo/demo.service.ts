import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farm } from '../database/entities/farm.entity';
import { Field } from '../database/entities/field.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { OperationJob } from '../database/entities/operation-job.entity';
import { TelemetryPoint } from '../database/entities/telemetry-point.entity';
import { AnalyticsSnapshot } from '../database/entities/analytics-snapshot.entity';
import { SupportTicket } from '../database/entities/support-ticket.entity';
import { AdvisoryLog } from '../database/entities/advisory-log.entity';

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(
    @InjectRepository(Farm) private farmRepo: Repository<Farm>,
    @InjectRepository(Field) private fieldRepo: Repository<Field>,
    @InjectRepository(Tractor) private tractorRepo: Repository<Tractor>,
    @InjectRepository(OperationJob) private jobRepo: Repository<OperationJob>,
    @InjectRepository(TelemetryPoint) private telemetryRepo: Repository<TelemetryPoint>,
    @InjectRepository(AnalyticsSnapshot) private analyticsRepo: Repository<AnalyticsSnapshot>,
    @InjectRepository(SupportTicket) private ticketRepo: Repository<SupportTicket>,
    @InjectRepository(AdvisoryLog) private advisoryRepo: Repository<AdvisoryLog>,
  ) { }

  async resetData(): Promise<any> {
    this.logger.log(`Hard-resetting demo data (Mock impl for tests)`);
    return { status: 'mocked' };
  }

  async seedJob(): Promise<any> {
    this.logger.log(`Seeding demo data (Mock impl for tests)`);
    return { status: 'mocked' };
  }
}
