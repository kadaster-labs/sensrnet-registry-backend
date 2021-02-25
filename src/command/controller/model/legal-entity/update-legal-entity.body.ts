import { ApiProperty } from '@nestjs/swagger';
import { LegalEntityBody } from './legal-entity.body';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
