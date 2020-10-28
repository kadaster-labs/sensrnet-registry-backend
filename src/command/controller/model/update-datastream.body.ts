import { ApiProperty } from '@nestjs/swagger';
import { ChangeDatastreamBody } from './change-datastream.body';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDatastreamBody extends ChangeDatastreamBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'DataStream name.',
    })
    readonly name: string;
}
