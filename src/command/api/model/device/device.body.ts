import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class DeviceBody {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The device description.',
    })
    readonly description: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({
        type: String,
        required: false,
        description: 'The way the device is connected to the net.',
    })
    readonly connectivity: string;
}
