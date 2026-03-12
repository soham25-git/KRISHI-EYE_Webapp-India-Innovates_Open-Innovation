import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OperationJob } from '../database/entities/operation-job.entity';
import { Tractor } from '../database/entities/tractor.entity';
import { Field } from '../database/entities/field.entity';
import { FarmMember } from '../database/entities/farm-member.entity';
import { CreateJobDto, UpdateJobDto, JobStatus } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(OperationJob)
    private jobRepository: Repository<OperationJob>,
    @InjectRepository(Tractor)
    private tractorRepository: Repository<Tractor>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    @InjectRepository(FarmMember)
    private memberRepository: Repository<FarmMember>,
  ) { }

  async create(dto: CreateJobDto, userId: string): Promise<OperationJob> {
    // 1. Fetch tractor and field to verify they exist and belong to the same farm
    const tractor = await this.tractorRepository.findOne({ where: { id: dto.tractor_id } });
    if (!tractor) throw new NotFoundException('Tractor not found');

    const field = await this.fieldRepository.findOne({ where: { id: dto.field_id } });
    if (!field) throw new NotFoundException('Field not found');

    if (tractor.farm_id !== field.farm_id) {
      throw new BadRequestException('Tractor and Field must belong to the same farm');
    }

    // 2. Verify user permission on that farm
    const member = await this.memberRepository.findOne({
      where: { farm_id: tractor.farm_id, user_id: userId }
    });
    if (!member) throw new ForbiddenException('Not a member of the farm owning these resources');

    // 3. Create job
    const job = this.jobRepository.create({
      ...dto,
      started_at: dto.status === JobStatus.RUNNING ? new Date() : undefined,
    } as any);
    return this.jobRepository.save(job as unknown as OperationJob);
  }

  async findAll(userId: string): Promise<OperationJob[]> {
    const memberships = await this.memberRepository.find({ where: { user_id: userId } });
    const farmIds = memberships.map(m => m.farm_id);
    if (farmIds.length === 0) return [];

    // This is slightly complex in TypeORM without query builder for deep filtering, 
    // but we can filter by tractors belonging to these farms.
    const tractors = await this.tractorRepository.find({
      where: { farm_id: In(farmIds) },
      select: ['id']
    });
    const tractorIds = tractors.map(t => t.id);
    if (tractorIds.length === 0) return [];

    return this.jobRepository.find({
      where: { tractor_id: In(tractorIds) },
      relations: ['tractor', 'field'],
    });
  }

  async findOne(id: string): Promise<OperationJob> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['tractor', 'field', 'tractor.farm'],
    });
    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
    return job;
  }

  async update(id: string, dto: UpdateJobDto): Promise<OperationJob> {
    const job = await this.findOne(id);

    // Handle status transitions
    if (dto.status && dto.status !== job.status) {
      if (job.status === JobStatus.COMPLETED || job.status === JobStatus.CANCELLED) {
        throw new BadRequestException(`Cannot change status of a ${job.status} job`);
      }

      if (dto.status === JobStatus.RUNNING && !job.started_at) {
        job.started_at = new Date();
      } else if (dto.status === JobStatus.COMPLETED || dto.status === JobStatus.CANCELLED) {
        job.ended_at = new Date();
      }
    }

    Object.assign(job, dto);
    return this.jobRepository.save(job);
  }

  async getReplayData(id: string) {
    // Stub for now, would fetch from telemetry points
    return { jobId: id, points: [] };
  }

  async getHeatmapData(id: string) {
    // Stub for now
    return { jobId: id, heatmap: [] };
  }
}
