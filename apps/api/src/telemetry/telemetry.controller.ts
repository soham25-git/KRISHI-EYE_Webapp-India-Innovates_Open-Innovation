import { Controller, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BatchTelemetryDto } from './dto/telemetry.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('telemetry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'telemetry', version: '1' })
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) { }

  @Post('batch')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a batch of telemetry points' })
  async ingestBatch(@Body() dto: BatchTelemetryDto, @Req() req: any) {
    if (dto.points && dto.points.length > 500) {
      throw new BadRequestException('Batch size exceeds maximum of 500 points');
    }
    return this.telemetryService.ingest(dto, req.user.sub || req.user.id);
  }
}
