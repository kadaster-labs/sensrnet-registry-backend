import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LongitudeLatitudeValidator } from '../validation/location';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from 'class-validator';

export class UpdateLocationBody {
    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(3)
    @IsNumber({}, {each: true})
    @ApiProperty({
        type: Number,
        isArray: true,
    })
    @Validate(LongitudeLatitudeValidator)
    @Type(() => Number)
    readonly location: number[];

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Reference to an external ID.',
    })
    readonly baseObjectId: string;
}
