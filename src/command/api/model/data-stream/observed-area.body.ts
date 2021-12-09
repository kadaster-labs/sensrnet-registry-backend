import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsArray } from 'class-validator';

export enum GeoJSONType {
    polygon = 'Polygon',
}

export class ObservedAreaBody {
    @IsString()
    @IsNotEmpty()
    @IsEnum(GeoJSONType)
    @ApiProperty({
        type: String,
        required: true,
        description: 'GeoJSON Object Type.',
    })
    readonly type: GeoJSONType;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        type: Array,
        required: true,
        description: 'GeoJSON Object Coordinates.',
    })
    readonly coordinates: any[];
}
