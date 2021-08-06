import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DatastreamBody } from './datastream.body';

export class AddDatastreamBody extends DatastreamBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        required: true,
        description: 'Datastream name.',
    })
    readonly name: string;
}
