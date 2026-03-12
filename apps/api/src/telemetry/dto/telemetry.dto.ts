import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PointDto {
    @ApiProperty({ example: '2024-03-10T10:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    recordedAt: string;

    @ApiProperty({ example: 'POINT(77.5946 12.9716)' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ example: 45.2, required: false })
    @IsNumber()
    @IsOptional()
    speedKmph?: number;

    @ApiProperty({ example: 180.5, required: false })
    @IsNumber()
    @IsOptional()
    headingDeg?: number;

    @ApiProperty({ example: 0.15, required: false })
    @IsNumber()
    @IsOptional()
    infectionIntensity?: number;

    @ApiProperty({ example: 0.8, required: false })
    @IsNumber()
    @IsOptional()
    heatWeight?: number;

    @ApiProperty({ example: 25.5, required: false })
    @IsNumber()
    @IsOptional()
    progressPercent?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    extra?: any;
}

export class BatchTelemetryDto {
    @ApiProperty({ example: 'uuid-of-tractor' })
    @IsString()
    @IsNotEmpty()
    tractorId: string;

    @ApiProperty({ example: 'uuid-of-job' })
    @IsString()
    @IsNotEmpty()
    jobId: string;

    @ApiProperty({ type: [PointDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PointDto)
    points: PointDto[];
}
