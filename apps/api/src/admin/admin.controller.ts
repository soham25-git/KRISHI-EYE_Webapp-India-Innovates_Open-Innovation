import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles('admin', 'staff') // Requires elevated privileges
@Controller({ path: 'admin', version: '1' })
export class AdminController {

  @Get('knowledge-sources')
  @ApiOperation({ summary: 'List all RAG knowledge sources' })
  getKnowledgeSources() { }

  @Post('knowledge-sources')
  @ApiOperation({ summary: 'Add a new manual knowledge source' })
  addKnowledgeSource(@Body() dto: any) { }

  @Patch('knowledge-sources/:sourceId')
  @ApiOperation({ summary: 'Update source attributes' })
  updateKnowledgeSource(@Param('sourceId') sourceId: string, @Body() dto: any) { }

  @Post('knowledge-sources/ingest')
  @ApiOperation({ summary: 'Trigger pipeline ingestion for pending sources' })
  ingestSources() { }

  @Get('support-contacts')
  @ApiOperation({ summary: 'Admin directory of support contacts' })
  getSupportContacts() { }

  @Post('support-contacts')
  @ApiOperation({ summary: 'Add verfied admin support contact' })
  addSupportContact(@Body() dto: any) { }

  @Patch('support-contacts/:contactId')
  @ApiOperation({ summary: 'Update support contact details' })
  updateSupportContact(@Param('contactId') contactId: string, @Body() dto: any) { }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Browse immutable audit event ledger' })
  getAuditLogs() { }

  @Get('metrics')
  @ApiOperation({ summary: 'System operational health metrics' })
  getMetrics() { }
}
