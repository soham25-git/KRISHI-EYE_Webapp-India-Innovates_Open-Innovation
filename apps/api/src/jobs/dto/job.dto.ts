import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JobStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export class CreateJobDto {
    @ApiProperty({ example: 'uuid-of-tractor' })
    @IsString()
    @IsNotEmpty()
    tractor_id: string;

    @ApiProperty({ example: 'uuid-of-field' })
    @IsString()
    @IsNotEmpty()
    field_id: string;

    @ApiProperty({ example: JobStatus.PENDING, enum: JobStatus })
    @IsEnum(JobStatus)
    @IsOptional()
    status?: JobStatus = JobStatus.PENDING;
}

export class UpdateJobDto {
    @ApiProperty({ example: JobStatus.COMPLETED, enum: JobStatus, required: false })
    @IsEnum(JobStatus)
    @IsOptional()
    status?: JobStatus;

    @ApiProperty({ example: 45.5, required: false })
    @IsNumber()
    @IsOptional()
    avg_speed_kmph?: number;

    @ApiProperty({ example: 1250.75, required: false })
    @IsNumber()
    @IsOptional()
    total_distance_m?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    coverage_summary?: any;

    @ApiProperty({ required: false })
    @IsOptional()
    improvement_summary?: any;
}
