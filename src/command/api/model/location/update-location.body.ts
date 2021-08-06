import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsArray, ArrayMinSize, ArrayMaxSize, Validate } from 'class-validator';
import { LongitudeLatitudeValidator } from '../../validation/location';
import { LocationBody } from './location.body';

export class UpdateLocationBody extends LocationBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Location name.',
    })
    readonly name: string;

    @IsArray()
    @IsOptional()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    @IsNumber({}, { each: true })
    @ApiProperty({
        type: Number,
        isArray: true,
        required: false,
    })
    @Validate(LongitudeLatitudeValidator)
    @Type(() => Number)
    readonly location: number[];
}
