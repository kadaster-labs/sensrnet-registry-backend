import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, Validate } from 'class-validator';
import { OrganizationEmailValidator } from '../../validation/organization-email';

export abstract class ContactDetailsBody {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'Contact name.',
    })
    readonly name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @Validate(OrganizationEmailValidator)
    @ApiProperty({
        type: String,
        required: false,
        description: 'Contact email.',
    })
    readonly email: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'Contact phone number.',
    })
    readonly phone: string;
}
