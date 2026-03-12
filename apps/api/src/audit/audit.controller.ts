import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller({ path: 'audit', version: '1' })
export class AuditController {
  constructor() { return { status: 'mocked' }; }

  // Scaffolded methods depending on module
}
