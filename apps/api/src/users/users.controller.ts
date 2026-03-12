import { Controller, Get, Patch, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'me', version: '1' })
export class UsersController {

  @Get()
  @ApiOperation({ summary: 'Get current user' })
  getMe(@Req() req: any) {
    return req.user;
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user' })
  updateMe(@Body() dto: any) { }

  @Get('farmer-profile')
  @ApiOperation({ summary: 'Get current user farmer profile' })
  getFarmerProfile() { }

  @Put('farmer-profile')
  @ApiOperation({ summary: 'Create or update farmer profile' })
  putFarmerProfile(@Body() dto: any) { }
}
