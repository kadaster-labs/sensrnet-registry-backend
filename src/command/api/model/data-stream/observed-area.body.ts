import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class ObservedAreaBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'GeoJSON Object Type.',
    })
    readonly type: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        type: Array,
        required: true,
        description: 'GeoJSON Object Coordinates.',
    })
    readonly coordinates: any[];
}
