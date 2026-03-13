import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BatchTelemetryDto } from './dto/telemetry.dto';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async ingest(dto: BatchTelemetryDto, userId: string): Promise<any> {
    const tractor = await this.prisma.tractor.findUnique({ where: { id: dto.tractorId } });
    if (!tractor) throw new NotFoundException('Tractor not found');

    const job = await this.prisma.operationJob.findUnique({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');

    if (job.tractorId !== dto.tractorId) {
      throw new BadRequestException('The specified tractor is not assigned to this job');
    }

    const member = await this.prisma.farmMember.findFirst({
      where: { farmId: tractor.farmId, userId: userId }
    });
    if (!member) throw new ForbiddenException('Not a member of the farm owning these resources');

    if (job.status === 'completed' || job.status === 'cancelled') {
      throw new BadRequestException(`Cannot ingest telemetry for a ${job.status} job`);
    }

    const data = dto.points.map(p => ({
      tractorId: dto.tractorId,
      jobId: dto.jobId,
      recordedAt: new Date(p.recordedAt),
      location_wkt: p.location,
      speedKmph: p.speedKmph,
      headingDeg: p.headingDeg,
      infectionIntensity: p.infectionIntensity,
      heatWeight: p.heatWeight,
      progressPercent: p.progressPercent,
      extra: p.extra ? JSON.stringify(p.extra) : undefined
    }));

    // Use raw SQL for PostGIS/Unsupported type support
    let ingested = 0;
    for (const p of data) {
      try {
        await this.prisma.$executeRaw`
          INSERT INTO telemetry_points (
            tractor_id, job_id, recorded_at, location, 
            speed_kmph, heading_deg, infection_intensity, 
            heat_weight, progress_percent, extra
          ) VALUES (
            ${p.tractorId}, ${p.jobId}, ${p.recordedAt}, 
            ST_GeomFromText(${p.location_wkt || 'POINT(0 0)'}, 4326), 
            ${p.speedKmph}, ${p.headingDeg}, ${p.infectionIntensity}, 
            ${p.heatWeight}, ${p.progressPercent}, ${p.extra ? JSON.parse(p.extra) : null}
          )
        `;
        ingested++;
      } catch (e) {
        this.logger.error(`Failed to ingest point: ${e.message}`);
      }
    }

    return { ingested };
  }
}
