import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFieldDto {
    @ApiProperty({ example: 'uuid-of-farm' })
    @IsString()
    @IsNotEmpty()
    farm_id: string;

    @ApiProperty({ example: 'North Field' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Maize', required: false })
    @IsString()
    @IsOptional()
    crop?: string;

    @ApiProperty({ example: 'Kharif', required: false })
    @IsString()
    @IsOptional()
    season?: string;

    @ApiProperty({ example: 5.5, required: false })
    @IsNumber()
    @IsOptional()
    area_acres?: number;

    @ApiProperty({ example: 'POLYGON((...))', required: false })
    @IsString()
    @IsOptional()
    boundary_wkt?: string;
}
