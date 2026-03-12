import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTractorDto {
    @ApiProperty({ example: 'uuid-of-farm' })
    @IsString()
    @IsNotEmpty()
    farm_id: string;

    @ApiProperty({ example: 'John Deere 5050D' })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({ example: 'Primary utility tractor', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '#34d399', required: false })
    @IsString()
    @IsOptional()
    color_hex?: string;
}

export class UpdateTractorDto {
    @ApiProperty({ example: 'Updated Label', required: false })
    @IsString()
    @IsOptional()
    label?: string;

    @ApiProperty({ example: 'New description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '#ff0000', required: false })
    @IsString()
    @IsOptional()
    color_hex?: string;
}
