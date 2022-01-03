import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsBoolean,
    IsUrl,
    IsUUID,
    IsOptional,
    ValidateIf,
    IsArray,
    IsObject,
    IsEnum,
    ValidateNested,
} from 'class-validator';
import Datastream from '../../../interfaces/datastream.interface';
import { Theme } from '../theme.body';
import { ObservedAreaBody } from './observed-area.body';
import { UnitOfMeasurementBody } from './unit-of-measurement.body';

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
    @ValidateNested()
    @ApiProperty({
        required: false,
        type: UnitOfMeasurementBody,
        description: 'Datastream unit of measurement.',
    })
    @Type(() => UnitOfMeasurementBody)
    readonly unitOfMeasurement: UnitOfMeasurementBody;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @ApiProperty({
        required: false,
        type: ObservedAreaBody,
        description: 'Bounding box of the observed area.',
    })
    @Type(() => ObservedAreaBody)
    readonly observedArea: ObservedAreaBody;

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
