import { Theme } from '../theme.body';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterObservationBody } from '../observation/register-observation.body';
import { IsString, IsBoolean, IsUrl, IsNumber, IsUUID, IsOptional, ValidateIf, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'DataStream unit of measurement.',
    })
    readonly unitOfMeasurement: string;

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
        default: true,
        required: false,
        description: 'Whether the DataStream is reusable.',
    })
    readonly isReusable: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        default: false,
        required: false,
        description: 'Whether the DataStream can lead to persons.',
    })
    readonly containsPersonalInfoData: boolean;

    @ValidateIf(e => e.documentationUrl !== '')
    @IsUrl()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'A link to the datastream documentation.',
    })
    readonly documentationUrl: string;

    @ValidateIf(e => e.dataLink !== '')
    @IsUrl()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Data link.',
    })
    readonly dataLink: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,
        description: 'Data frequency.',
    })
    readonly dataFrequency: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        type: Number,
        required: false,
        description: 'Data quality.',
    })
    readonly dataQuality: number;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        type: String,
        isArray: true,
        required: false,
        enum: Theme,
        description: 'The sensor theme.',
    })
    readonly theme: string[];
}
