import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class DeviceIdParams {
    @IsUUID(4)
    @IsNotEmpty()
    @ApiProperty()
    readonly deviceId: string;
}
