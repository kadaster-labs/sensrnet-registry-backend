import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

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
