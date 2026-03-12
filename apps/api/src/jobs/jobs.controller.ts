import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'jobs', version: '1' })
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new operation job' })
  create(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    return this.jobsService.create(createJobDto, req.user.sub || req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all jobs across user farms' })
  findAll(@Req() req: any) {
    return this.jobsService.findAll(req.user.sub || req.user.id);
  }

  @Get(':jobId')
  @CheckOwnership('jobId', 'job_member')
  @ApiOperation({ summary: 'Get details of a specific job' })
  findOne(@Param('jobId') jobId: string) {
    return this.jobsService.findOne(jobId);
  }

  @Patch(':jobId')
  @CheckOwnership('jobId', 'job_owner')
  @ApiOperation({ summary: 'Update job details (e.g. mark complete)' })
  update(@Param('jobId') jobId: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(jobId, updateJobDto);
  }

  @Get(':jobId/replay')
  @CheckOwnership('jobId', 'job_member')
  @ApiOperation({ summary: 'Get telemetry replay data for a job' })
  getReplayData(@Param('jobId') jobId: string) {
    return this.jobsService.getReplayData(jobId);
  }

  @Get(':jobId/heatmap')
  @CheckOwnership('jobId', 'job_member')
  @ApiOperation({ summary: 'Get telemetry heatmap data for a job (infection, heat)' })
  getHeatmapData(@Param('jobId') jobId: string) {
    return this.jobsService.getHeatmapData(jobId);
  }
}
