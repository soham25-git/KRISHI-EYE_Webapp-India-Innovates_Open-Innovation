import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AiProxyService } from './ai-proxy.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { CheckOwnership } from '../common/decorators/ownership.decorator';
import { Throttle } from '@nestjs/throttler';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000) // S-07
  question: string;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  language?: string = 'en';
}

export class FeedbackDto {
  @IsString()
  @IsNotEmpty()
  logId: string;

  @IsString()
  @IsNotEmpty()
  rating: 'positive' | 'negative';
}

@ApiTags('ai-proxy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Controller({ path: 'ai', version: '1' })
export class AiProxyController {
  constructor(private readonly aiProxyService: AiProxyService) { }

  @Post('chat')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // S-13 Hard AI Limits
  @ApiOperation({ summary: 'Ask AI agronomy questions' })
  async askChat(@Body() dto: ChatRequestDto, @Req() req: any) {
    return this.aiProxyService.askQuestion(dto, req.user.sub || req.user.id);
  }

  @Post('feedback')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Provide feedback on an AI response' })
  async submitFeedback(@Body() dto: FeedbackDto, @Req() req: any) {
    // S-01 We ensure they only provide feedback for their own logged prompts
    return this.aiProxyService.submitFeedback(dto.logId, dto.rating, req.user.sub || req.user.id);
  }

  @Post('escalate/:logId')
  @ApiOperation({ summary: 'Escalate a poor AI answer to human agronomists' })
  async escalateThread(@Param('logId') logId: string, @Req() req: any) {
    return this.aiProxyService.escalate(logId, req.user.sub || req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get chat history for current user' })
  async getHistory(@Req() req: any) {
    return this.aiProxyService.getHistory(req.user.sub || req.user.id);
  }

  @Get('sources/:sourceId')
  @ApiOperation({ summary: 'Get details of a cited knowledge source' })
  async getSource(@Param('sourceId') sourceId: string) {
    // Sources are generic, no ownership restriction
    return this.aiProxyService.getSource(sourceId);
  }
}
