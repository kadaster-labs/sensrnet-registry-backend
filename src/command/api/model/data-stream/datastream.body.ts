import { Theme } from '../theme.body';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsString, IsBoolean, IsUrl, IsUUID, IsOptional, ValidateIf,
    IsArray, IsObject, IsEnum,
} from 'class-validator';
import Datastream from '../../../interfaces/datastream.interface';

export abstract class DatastreamBody implements Datastream {
    @IsUUID(4)
    @IsOptional()
    readonly datastreamId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Datastream description.',
    })
    readonly description: string;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: Object,
        required: false,
        description: 'Datastream unit of measurement.',
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
    @IsEnum(Theme, { each: true })
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
        description: 'Whether the Datastream is active.',
    })
    readonly isActive: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the Datastream is public.',
    })
    readonly isPublic: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the Datastream is considered open data.',
    })
    readonly isOpenData: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: false,
        required: false,
        description: 'Whether the Datastream can lead to a person.',
    })
    readonly containsPersonalInfoData: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
        description: 'Whether the Datastream is reusable.',
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
