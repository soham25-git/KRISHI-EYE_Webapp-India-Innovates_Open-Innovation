import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { AddMemberDto } from './dto/add-member.dto';

@ApiTags('farms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'farms', version: '1' })
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new farm' })
  create(@Body() createFarmDto: CreateFarmDto, @Req() req: any) {
    return this.farmsService.create(createFarmDto, req.user.sub || req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all farms for the current user' })
  findAll(@Req() req: any) {
    return this.farmsService.findAll(req.user.sub || req.user.id);
  }

  @Get(':farmId')
  @CheckOwnership('farmId', 'farm_member')
  @ApiOperation({ summary: 'Get details of a specific farm' })
  findOne(@Param('farmId') farmId: string) {
    return this.farmsService.findOne(farmId);
  }

  @Patch(':farmId')
  @CheckOwnership('farmId', 'farm_owner')
  @ApiOperation({ summary: 'Update a specific farm' })
  update(@Param('farmId') farmId: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(farmId, updateFarmDto);
  }

  @Delete(':farmId')
  @CheckOwnership('farmId', 'farm_owner')
  @ApiOperation({ summary: 'Delete a farm (soft/hard)' })
  remove(@Param('farmId') farmId: string) {
    return this.farmsService.remove(farmId);
  }

  @Post(':farmId/members')
  @CheckOwnership('farmId', 'farm_owner')
  @ApiOperation({ summary: 'Add a member to the farm' })
  addMember(@Param('farmId') farmId: string, @Body() body: AddMemberDto) {
    return this.farmsService.addMember(farmId, body.targetUserId, body.role);
  }

  @Get(':farmId/fields')
  @CheckOwnership('farmId', 'farm_member')
  @ApiOperation({ summary: 'List all fields in this farm' })
  getFields(@Param('farmId') farmId: string) {
    return this.farmsService.getFields(farmId);
  }
}
