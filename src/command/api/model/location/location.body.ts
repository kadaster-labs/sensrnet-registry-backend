import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export abstract class LocationBody {
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
