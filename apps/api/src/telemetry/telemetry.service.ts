import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelemetryPoint } from '../database/entities/telemetry-point.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { OperationJob } from '../database/entities/operation-job.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { BatchTelemetryDto } from './dto/telemetry.dto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(TelemetryPoint)
    private telemetryRepository: Repository<TelemetryPoint>,
    @InjectRepository(Tractor)
    private tractorRepository: Repository<Tractor>,
    @InjectRepository(OperationJob)
    private jobRepository: Repository<OperationJob>,
    @InjectRepository(FarmMember)
    private memberRepository: Repository<FarmMember>,
  ) { }

  async ingest(dto: BatchTelemetryDto, userId: string) {
    // 1. Fetch tractor and job
    const tractor = await this.tractorRepository.findOne({ where: { id: dto.tractorId } });
    if (!tractor) throw new NotFoundException('Tractor not found');

    const job = await this.jobRepository.findOne({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');

    // 2. Validate consistency: tractor must be the one assigned to the job
    if (job.tractor_id !== dto.tractorId) {
      throw new BadRequestException('The specified tractor is not assigned to this job');
    }

    // 3. Validate user permission on that farm (anchored to the farm of the tractor)
    const member = await this.memberRepository.findOne({
      where: { farm_id: tractor.farm_id, user_id: userId }
    });
    if (!member) throw new ForbiddenException('Not a member of the farm owning these resources');

    // 4. Validate job status
    if (job.status === 'completed' || job.status === 'cancelled') {
      throw new BadRequestException(`Cannot ingest telemetry for a ${job.status} job`);
    }

    // 5. Bulk insert
    const entities = dto.points.map(p => this.telemetryRepository.create({
      tractor_id: dto.tractorId,
      job_id: dto.jobId,
      recorded_at: new Date(p.recordedAt),
      location_wkt: p.location,
      speed_kmph: p.speedKmph,
      heading_deg: p.headingDeg,
      infection_intensity: p.infectionIntensity,
      heat_weight: p.heatWeight,
      progress_percent: p.progressPercent,
      extra: p.extra
    }));

    await this.telemetryRepository.save(entities);

    return { ingested: entities.length };
  }
}
