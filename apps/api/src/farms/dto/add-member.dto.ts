import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
    @ApiProperty({ example: 'uuid-of-user' })
    @IsString()
    @IsNotEmpty()
    targetUserId: string;

    @ApiProperty({ example: 'farm_member', enum: ['farm_owner', 'farm_member', 'farm_viewer'] })
    @IsEnum(['farm_owner', 'farm_member', 'farm_viewer'])
    role: string;
}
