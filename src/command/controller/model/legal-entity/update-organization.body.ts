import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export class UpdateLegalEntityBody {
    @IsOptional()
    @ValidateIf(e => e.name !== '')
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The organization name.',
    })
    readonly name: string;

    @ValidateIf(e => e.website !== '')
    @IsUrl()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The organization website.',
    })
    readonly website: string;
}
