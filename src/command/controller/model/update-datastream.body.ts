import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { ChangeDatastreamBody } from './change-datastream.body';

export class UpdateDatastreamBody extends ChangeDatastreamBody {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'DataStream name.',
    })
    readonly name: string;
}
