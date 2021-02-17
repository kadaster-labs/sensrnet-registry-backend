import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { LegalEntityBody } from './legal-entity.body';

export class UpdateLegalEntityBody extends LegalEntityBody {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The organization name.',
    })
    readonly name: string;
}
