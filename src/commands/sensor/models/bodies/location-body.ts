import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';


export class LocationBody {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor latitude.'
    })
    readonly lat: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor longitude.'
    })
    readonly lon: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Sensor height.'
    })
    readonly height: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,
        description: 'Reference to an external ID.'
    })
    readonly baseObjectId: string;
}
