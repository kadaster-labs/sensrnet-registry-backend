import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateUserBody {

    @IsUUID(4)
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The ownerId of the user.',
    })
    readonly ownerId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The password of the user.',
    })
    readonly password: string;
}
