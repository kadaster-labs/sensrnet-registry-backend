import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The id of the legal entity to join.',
    })
    readonly legalEntityId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The user password.',
    })
    readonly password: string;
}
