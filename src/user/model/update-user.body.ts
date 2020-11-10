import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateUserBody {
    @IsUUID(4)
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The id of the organization to join.',
    })
    readonly organization: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The user password.',
    })
    readonly password: string;
}
