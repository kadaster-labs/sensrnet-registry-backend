import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChangeDatastreamBody } from './change-datastream.body';

export class CreateDatastreamBody extends ChangeDatastreamBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'DataStream name.',
    })
    readonly name: string;
}
