import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OperationJob } from '../database/entities/operation-job.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { Farm } from '../database/entities/farm.entity';
import { TelemetryPoint } from '../database/entities/telemetry-point.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(OperationJob)
    private jobRepository: Repository<OperationJob>,
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(FarmMember)
    private memberRepository: Repository<FarmMember>,
    @InjectRepository(TelemetryPoint)
    private telemetryRepository: Repository<TelemetryPoint>,
  ) { }

  async getOverview(userId: string) {
    const memberships = await this.memberRepository.find({ where: { user_id: userId } });
    const farmIds = memberships.map(m => m.farm_id);
    if (farmIds.length === 0) {
      return { totalFarms: 0, activeJobs: 0, totalDistanceM: 0 };
    }

    // This query is slightly complex to do in a single pass without query builder.
    // We'll do multiple queries for clarity and SQLite compatibility.
    const activeJobs = await this.jobRepository.count({
      where: {
        status: 'running',
        tractor: { farm_id: In(farmIds) }
      } as any,
      relations: ['tractor']
    });

    const jobs = await this.jobRepository.find({
      where: {
        tractor: { farm_id: In(farmIds) }
      } as any,
      relations: ['tractor']
    });

    const totalDistanceM = jobs.reduce((sum, job) => sum + (Number(job.total_distance_m) || 0), 0);

    return {
      totalFarms: farmIds.length,
      activeJobs,
      totalDistanceM,
      totalJobs: jobs.length
    };
  }

  async getFarmImprovement(farmId: string) {
    // Dynamic derivation from job performance
    const jobs = await this.jobRepository.find({
      where: { tractor: { farm_id: farmId } } as any,
      relations: ['tractor'],
      order: { created_at: 'ASC' }
    });

    // Group jobs by some period or just return a list of performance markers
    return jobs.map(j => ({
      jobId: j.id,
      date: j.created_at,
      avgSpeed: j.avg_speed_kmph,
      distance: j.total_distance_m,
      status: j.status
    }));
  }

  async getFarmTimeline(farmId: string) {
    // For now, return recent job events as a timeline
    const jobs = await this.jobRepository.find({
      where: { tractor: { farm_id: farmId } } as any,
      relations: ['tractor'],
      order: { created_at: 'DESC' },
      take: 20
    });

    return jobs.map(j => ({
      type: 'job',
      id: j.id,
      status: j.status,
      timestamp: j.updated_at
    }));
  }

  async getJobSummary(jobId: string) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['field', 'tractor']
    });

    if (!job) throw new NotFoundException('Job not found');

    // Calculate dynamic stats from telemetry if needed, or return persisted job metrics
    const telemetryStats = await this.telemetryRepository
      .createQueryBuilder('tp')
      .where('tp.job_id = :jobId', { jobId })
      .select('MAX(tp.infection_intensity)', 'maxInfection')
      .addSelect('AVG(tp.speed_kmph)', 'avgSpeed')
      .getRawOne();

    return {
      jobId: job.id,
      field: job.field.name,
      tractor: job.tractor.label,
      status: job.status,
      durationMinutes: job.started_at && job.ended_at ?
        Math.floor((job.ended_at.getTime() - job.started_at.getTime()) / 60000) : 0,
      distanceM: job.total_distance_m,
      avgSpeedKmph: telemetryStats.avgSpeed || job.avg_speed_kmph,
      maxInfection: telemetryStats.maxInfection || 0,
      coverage: job.coverage_summary
    };
  }
}
