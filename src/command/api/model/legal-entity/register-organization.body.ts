import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsUrl, MaxLength, ValidateIf } from 'class-validator';
import { ContactDetailsBody } from '../contact-details/contact-details.body';

export class RegisterOrganizationBody {
    @ValidateIf(e => e.name !== '')
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: true,
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

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: ContactDetailsBody,
        required: false,
    })
    @Type(() => ContactDetailsBody)
    readonly contactDetails: ContactDetailsBody;
}
