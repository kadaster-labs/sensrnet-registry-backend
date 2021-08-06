import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class DeviceIdParams {
    @IsUUID(4)
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'The id of the device.',
    })
    readonly deviceId: string;
}
