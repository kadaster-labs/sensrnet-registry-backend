import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

export class LocationBody {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor longitude.',
    })
    @Min(-180, { message: 'Longitude should be greater than or equal to -180' })
    @Max(180, { message: 'Longitude should be less than or equal to 180' })
    @Type(() => Number)
    readonly longitude: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor latitude.',
    })
    @Min(-90, { message: 'Latitude should be greater than or equal to -90' })
    @Max(90, { message: 'Latitude should be less than or equal to 90' })
    @Type(() => Number)
    readonly latitude: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor height.',
    })
    readonly height: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Reference to an external ID.',
    })
    readonly baseObjectId: string;
}
