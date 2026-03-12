import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('overview')
  @ApiOperation({ summary: 'Get global analytics overview for current user' })
  getOverview(@Req() req: any) {
    return this.analyticsService.getOverview(req.user.sub || req.user.id);
  }

  @Get('farms/:farmId/improvement')
  @CheckOwnership('farmId', 'farm_member')
  @ApiOperation({ summary: 'Get yield and coverage improvement metrics for a farm over time' })
  getFarmImprovement(@Param('farmId') farmId: string) {
    return this.analyticsService.getFarmImprovement(farmId);
  }

  @Get('farms/:farmId/timeline')
  @CheckOwnership('farmId', 'farm_member')
  @ApiOperation({ summary: 'Get timeline of analytics snapshots for a farm' })
  getFarmTimeline(@Param('farmId') farmId: string) {
    return this.analyticsService.getFarmTimeline(farmId);
  }

  @Get('jobs/:jobId/summary')
  @CheckOwnership('jobId', 'job_owner')
  @ApiOperation({ summary: 'Get post-job summary statistics' })
  getJobSummary(@Param('jobId') jobId: string) {
    return this.analyticsService.getJobSummary(jobId);
  }
}

