import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DemoService } from './demo.service';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('demo')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'demo', version: '1' })
export class DemoController {
  constructor(private readonly demoService: DemoService) { }

  @ApiBearerAuth()
  @Roles('admin', 'demo_manager')
  @Post('seed-job')
  @ApiOperation({ summary: 'Seed a complete farm and job sequence for demo purposes' })
  async seedJob() {
    return await this.demoService.seedJob();
  }

  @ApiBearerAuth()
  @Roles('admin', 'demo_manager')
  @Post('reset')
  @ApiOperation({ summary: 'Reset all demo datasets' })
  async resetData() {
    return await this.demoService.resetData();
  }
}
