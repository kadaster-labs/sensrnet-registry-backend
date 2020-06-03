import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class LocationBody {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor x coordinate.',
    })
    readonly x: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor y coordinate.',
    })
    readonly y: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor z coordinate.',
    })
    readonly z: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'The EPSG code of the coordinate.',
    })
    readonly epsgCode: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Reference to an external ID.',
    })
    readonly baseObjectId: string;
}
