import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The id of the organization to join.',
    })
    readonly organization: string;
}
