import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationBody } from './location.body';
import { LongitudeLatitudeValidator } from '../../validation/location';
import { IsString, IsNumber, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, Validate } from 'class-validator';

export class RegisterLocationBody extends LocationBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Location name.',
    })
    readonly name: string;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    @IsNumber({}, {each: true})
    @ApiProperty({
        type: Number,
        isArray: true,
        required: true,
    })
    @Validate(LongitudeLatitudeValidator)
    @Type(() => Number)
    readonly location: number[];
}
