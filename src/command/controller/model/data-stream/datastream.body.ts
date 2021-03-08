import { Theme } from '../theme.body';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsString, IsBoolean, IsUrl, IsNumber, IsUUID, IsOptional, ValidateIf,
    IsArray, IsObject, IsEnum
} from 'class-validator';
import { SensorType } from '../sensor-type.body';

export abstract class DatastreamBody {
    @IsUUID(4)
    @IsOptional()
    dataStreamId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'DataStream description.',
    })
    readonly description: string;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: Object,
        required: false,
        description: 'DataStream unit of measurement.',
    })
    readonly unitOfMeasurement: Record<string, any>;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: Object,
        required: false,
        description: 'Bounding box of the observed area.',
    })
    readonly observedArea: Record<string, any>;

    @IsArray()
    @IsEnum(Theme, {each: true})
    @IsOptional()
    @ApiProperty({
        type: String,
        isArray: true,
        required: false,
        enum: Theme,
        description: 'The sensor theme.',
    })
    readonly theme: string[];

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Data quality.',
    })
    readonly dataQuality: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the DataStream is active.',
    })
    readonly isActive: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the DataStream is public.',
    })
    readonly isPublic: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the DataStream is considered open data.',
    })
    readonly isOpenData: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: false,
        required: false,
        description: 'Whether the DataStream can lead to a person.',
    })
    readonly containsPersonalInfoData: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the DataStream is reusable.',
    })
    readonly isReusable: boolean;

    @ValidateIf(e => e.documentation !== '')
    @IsUrl()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'A link to the datastream documentation.',
    })
    readonly documentation: string;

    @ValidateIf(e => e.dataLink !== '')
    @IsUrl()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Data link.',
    })
    readonly dataLink: string;
}
