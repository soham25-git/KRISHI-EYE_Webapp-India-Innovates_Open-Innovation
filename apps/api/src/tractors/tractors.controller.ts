import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TractorsService } from './tractors.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { CreateTractorDto, UpdateTractorDto } from './dto/tractor.dto';

@ApiTags('tractors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'tractors', version: '1' })
export class TractorsController {
  constructor(private readonly tractorsService: TractorsService) { }

  @Post()
  @ApiOperation({ summary: 'Register a new tractor to a farm' })
  create(@Body() createTractorDto: CreateTractorDto, @Req() req: any) {
    return this.tractorsService.create(createTractorDto, req.user.sub || req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all tractors for farms this user is part of' })
  findAll(@Req() req: any) {
    return this.tractorsService.findAll(req.user.sub || req.user.id);
  }

  @Get(':tractorId')
  @CheckOwnership('tractorId', 'tractor_member')
  @ApiOperation({ summary: 'Get details of a specific tractor' })
  findOne(@Param('tractorId') tractorId: string) {
    return this.tractorsService.findOne(tractorId);
  }

  @Patch(':tractorId')
  @CheckOwnership('tractorId', 'tractor_owner')
  @ApiOperation({ summary: 'Update a specific tractor' })
  update(@Param('tractorId') tractorId: string, @Body() updateTractorDto: UpdateTractorDto) {
    return this.tractorsService.update(tractorId, updateTractorDto);
  }

  @Delete(':tractorId')
  @CheckOwnership('tractorId', 'tractor_owner')
  @ApiOperation({ summary: 'Delete a tractor' })
  remove(@Param('tractorId') tractorId: string) {
    return this.tractorsService.remove(tractorId);
  }
}
