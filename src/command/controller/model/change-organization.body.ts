import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChangeOrganizationBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Name of the contact person.',
    })
    readonly contactName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Email of the contact person.',
    })
    readonly contactEmail: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Phone number of the contact person.',
    })
    readonly contactPhone: string;
}
