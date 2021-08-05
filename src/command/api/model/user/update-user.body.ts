import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'The id of the legal entity to join.',
    })
    readonly legalEntityId: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        description: 'Whether to leave your legal entity.',
    })
    readonly leaveLegalEntity: boolean;
}
