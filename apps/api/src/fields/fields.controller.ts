import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@ApiTags('fields')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'fields', version: '1' })
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new field for a farm' })
  // Ownership check for farm_id is handled in service for creation
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Get(':fieldId')
  @CheckOwnership('fieldId', 'field_member')
  @ApiOperation({ summary: 'Get details of a specific field' })
  findOne(@Param('fieldId') fieldId: string) {
    return this.fieldsService.findOne(fieldId);
  }

  @Patch(':fieldId')
  @CheckOwnership('fieldId', 'field_owner')
  @ApiOperation({ summary: 'Update a specific field' })
  update(@Param('fieldId') fieldId: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(fieldId, updateFieldDto);
  }

  @Post(':fieldId/boundary')
  @CheckOwnership('fieldId', 'field_owner')
  @ApiOperation({ summary: 'Update the polygon boundary' })
  updateBoundary(@Param('fieldId') fieldId: string, @Body() body: { wkt: string }) {
    return this.fieldsService.updateBoundary(fieldId, body.wkt);
  }
}
