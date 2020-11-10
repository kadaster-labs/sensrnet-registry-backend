import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsUrl, IsNumber, IsUUID, IsOptional, ValidateIf } from 'class-validator';

export abstract class ChangeDatastreamBody {
    @IsUUID(4)
    @IsOptional()
    dataStreamId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Reason for the DataStream.',
    })
    readonly reason: string;

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
        description: 'The property the DataStream observes (e.g. temperature).',
    })
    readonly observedProperty: string;

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
}
