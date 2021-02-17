import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DatastreamBody } from './datastream.body';
import { RegisterObservationBody } from '../observation/register-observation.body';
import { Type } from 'class-transformer';

export class RegisterDatastreamBody extends DatastreamBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'DataStream name.',
    })
    readonly name: string;

    @IsObject()
    @IsOptional()
    @ApiProperty({
        type: RegisterObservationBody,
        required: false,
    })
    @Type(() => RegisterObservationBody)
    readonly observation: RegisterObservationBody;
}
