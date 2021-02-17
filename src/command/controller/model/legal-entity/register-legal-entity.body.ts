import { ApiProperty } from '@nestjs/swagger';
import { LegalEntityBody } from './legal-entity.body';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterLegalEntityBody extends LegalEntityBody {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: true,
        description: 'The legal entity name.',
    })
    readonly name: string;
}
