import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import Location from '../../../interfaces/location.interface';

export abstract class LocationBody implements Location {
    @IsUUID(4)
    @IsOptional()
    locationId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Location description.',
    })
    readonly description: string;
}
