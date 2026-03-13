import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getOverview(userId: string) {
    const memberships = await this.prisma.farmMember.findMany({ where: { userId: userId } });
    const farmIds = memberships.map(m => m.farmId);
    if (farmIds.length === 0) {
      return { totalFarms: 0, activeJobs: 0, totalDistanceM: 0 };
    }

    const activeJobs = await this.prisma.operationJob.count({
      where: {
        status: 'running',
        tractor: { farmId: { in: farmIds } }
      }
    });

    const jobs = await this.prisma.operationJob.findMany({
      where: {
        tractor: { farmId: { in: farmIds } }
      }
    });

    const totalDistanceM = jobs.reduce((sum, job) => sum + (Number(job.totalDistanceM) || 0), 0);

    return {
      totalFarms: farmIds.length,
      activeJobs,
      totalDistanceM,
      totalJobs: jobs.length
    };
  }

  async getFarmImprovement(farmId: string) {
    const jobs = await this.prisma.operationJob.findMany({
      where: { tractor: { farmId: farmId } },
      orderBy: { createdAt: 'asc' }
    });

    return jobs.map(j => ({
      jobId: j.id,
      date: j.createdAt,
      avgSpeed: j.avgSpeedKmph,
      distance: j.totalDistanceM,
      status: j.status
    }));
  }

  async getFarmTimeline(farmId: string) {
    const jobs = await this.prisma.operationJob.findMany({
      where: { tractor: { farmId: farmId } },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return jobs.map(j => ({
      type: 'job',
      id: j.id,
      status: j.status,
      timestamp: j.updatedAt
    }));
  }

  async getJobSummary(jobId: string) {
    const job = await this.prisma.operationJob.findUnique({
      where: { id: jobId },
      include: { 
        field: true, 
        tractor: true 
      }
    });

    if (!job) throw new NotFoundException('Job not found');

    // For complex aggregations on large tables, or those involving BigInt/Unsupported, 
    // sometimes raw SQL is clearer.
    const stats: any[] = await this.prisma.$queryRaw`
      SELECT 
        MAX(infection_intensity) as "maxInfection",
        AVG(speed_kmph) as "avgSpeed"
      FROM telemetry_points
      WHERE job_id = ${jobId}
    `;
    
    const telemetryStats = stats[0] || {};

    return {
      jobId: job.id,
      field: job.field.name,
      tractor: job.tractor.label,
      status: job.status,
      durationMinutes: job.startedAt && job.endedAt ?
        Math.floor((job.endedAt.getTime() - job.startedAt.getTime()) / 60000) : 0,
      distanceM: job.totalDistanceM,
      avgSpeedKmph: telemetryStats.avgSpeed || job.avgSpeedKmph,
      maxInfection: telemetryStats.maxInfection || 0,
      coverage: job.coverageSummary
    };
  }
}
