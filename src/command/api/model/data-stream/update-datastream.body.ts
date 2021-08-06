import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { DatastreamBody } from './datastream.body';

export class UpdateDatastreamBody extends DatastreamBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        required: false,
        description: 'Datastream name.',
    })
    readonly name: string;
}
