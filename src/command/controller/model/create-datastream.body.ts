import { ApiProperty } from '@nestjs/swagger';
import { ChangeDatastreamBody } from './change-datastream.body';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDatastreamBody extends ChangeDatastreamBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'DataStream name.',
    })
    readonly name: string;
}
