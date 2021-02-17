import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { DatastreamBody } from './datastream.body';
import { UpdateObservationBody } from '../observation/update-observation.body';
import { Type } from 'class-transformer';

export class UpdateDatastreamBody extends DatastreamBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'DataStream name.',
    })
    readonly name: string;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: UpdateObservationBody,
        required: false,
    })
    @Type(() => UpdateObservationBody)
    readonly observation: UpdateObservationBody;
}
