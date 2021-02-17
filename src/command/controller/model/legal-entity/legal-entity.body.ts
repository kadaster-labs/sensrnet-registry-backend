import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ContactDetailsBody } from '../contact-details/contact-details.body';
import { IsObject, IsOptional, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export class LegalEntityBody {
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

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: ContactDetailsBody,
        required: false,
    })
    @Type(() => ContactDetailsBody)
    readonly contactDetails: ContactDetailsBody;
}
