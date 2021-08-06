import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    ArrayMaxSize,
    Validate,
    IsOptional,
    MaxLength,
} from 'class-validator';
import { LongitudeLatitudeValidator } from '../../validation/location';
import { LocationBody } from './location.body';

export class RegisterLocationBody extends LocationBody {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'Location name.',
    })
    readonly name: string;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: Number,
        isArray: true,
        required: true,
    })
    @Validate(LongitudeLatitudeValidator)
    @Type(() => Number)
    readonly location: number[];
}
