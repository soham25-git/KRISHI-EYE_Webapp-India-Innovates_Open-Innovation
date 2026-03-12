import { IsString, IsOptional, IsNotEmpty, IsIn, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    district?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category?: string; // agronomist, technical_support, government_office

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orgId?: string;
}

export class CreateTicketDto {
    @ApiProperty({ example: 'title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'agronomy' })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ example: 'medium' })
    @IsString()
    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'critical'])
    priority?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    farmId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    fieldId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    tractorId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    jobId?: string;

    @ApiProperty({ example: 'description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    metadata?: any;
}

export class UpdateTicketDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsIn(['open', 'in_progress', 'resolved', 'closed', 'cancelled'])
    status?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'critical'])
    priority?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    resolutionSummary?: string;
}
