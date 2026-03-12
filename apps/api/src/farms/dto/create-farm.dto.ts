import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
    @ApiProperty({ example: 'My Sunny Farm' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Solapur' })
    @IsString()
    @IsNotEmpty()
    district: string;

    @ApiProperty({ example: 'Maharashtra' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ example: 'POINT(75.9064 17.6599)', required: false })
    @IsString()
    @IsOptional()
    centroid_wkt?: string;
}
